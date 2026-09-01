package com.smartcity.service;

import com.smartcity.dto.AiAnalysisResult;
import com.smartcity.dto.ComplaintAssignmentRequest;
import com.smartcity.dto.ComplaintCreateRequest;
import com.smartcity.dto.ComplaintStatusUpdateRequest;
import com.smartcity.entity.*;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintCategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintStatusHistoryRepository historyRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AiCivicEngineService aiEngineService;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public Complaint createComplaint(ComplaintCreateRequest request, User citizen) {
        ComplaintCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        // Run AI Civic Engine
        AiAnalysisResult aiResult = aiEngineService.analyzeComplaint(
                request.getTitle(),
                request.getDescription(),
                request.getCategoryId(),
                request.getLatitude(),
                request.getLongitude()
        );

        // Generate Unique Complaint Number e.g. CMP-2026-081492
        String year = String.valueOf(LocalDateTime.now().getYear());
        int randomSuffix = ThreadLocalRandom.current().nextInt(100000, 999999);
        String complaintNumber = "CMP-" + year + "-" + randomSuffix;

        Department assignedDept = category.getDefaultDepartment();
        if (assignedDept == null && aiResult.getPredictedDepartmentId() != null) {
            assignedDept = departmentRepository.findById(aiResult.getPredictedDepartmentId()).orElse(null);
        }

        // Calculate SLA Deadline
        int slaHours = (assignedDept != null && assignedDept.getSlaHours() != null) ? assignedDept.getSlaHours() : 48;
        if (aiResult.getPriority() == Priority.CRITICAL) {
            slaHours = 6; // Emergency 6-hour response SLA
        } else if (aiResult.getPriority() == Priority.HIGH) {
            slaHours = Math.min(slaHours, 24);
        }

        Complaint complaint = Complaint.builder()
                .complaintNumber(complaintNumber)
                .citizen(citizen)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .category(category)
                .priority(aiResult.getPriority())
                .status(ComplaintStatus.SUBMITTED)
                .address(request.getAddress().trim())
                .municipality(request.getMunicipality() != null ? request.getMunicipality() : citizen.getMunicipality())
                .city(request.getCity() != null ? request.getCity() : citizen.getCity())
                .landmark(request.getLandmark())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(request.getImageUrl())
                .aiClassification(aiResult.getPredictedCategoryName())
                .aiPriorityConfidence(aiResult.getConfidenceScore())
                .aiPredictedDepartment(aiResult.getPredictedDepartmentName())
                .isDuplicate(aiResult.getIsDuplicateDetected())
                .duplicateOfComplaintNumber(aiResult.getDuplicateComplaintNumber())
                .assignedDepartment(assignedDept)
                .slaDeadline(LocalDateTime.now().plusHours(slaHours))
                .build();

        Complaint saved = complaintRepository.save(complaint);

        // Record Initial Timeline History
        ComplaintStatusHistory initialHistory = ComplaintStatusHistory.builder()
                .complaint(saved)
                .status(ComplaintStatus.SUBMITTED)
                .remarks("Complaint reported by citizen. AI automatically analyzed urgency as " + aiResult.getPriority() + ".")
                .updatedBy(citizen)
                .build();
        historyRepository.save(initialHistory);

        // Audit Log
        auditLogService.logAction(
                citizen,
                "COMPLAINT_CREATED",
                "COMPLAINT",
                saved.getId(),
                saved.getComplaintNumber(),
                null,
                saved.getStatus().name(),
                "New complaint submitted under category " + category.getName() + " in " + saved.getMunicipality(),
                saved.getMunicipality()
        );

        // Notify Citizen
        notificationService.createNotification(
                citizen,
                "Complaint Submitted: " + complaintNumber,
                "Your issue '" + request.getTitle() + "' has been successfully registered and routed to " + (assignedDept != null ? assignedDept.getName() : "the municipal team") + ".",
                "COMPLAINT_SUBMITTED",
                saved.getId(),
                complaintNumber
        );

        // Notify Department Officers
        if (assignedDept != null) {
            List<User> officers = userRepository.findByRoleAndDepartmentId(Role.ROLE_OFFICER, assignedDept.getId());
            for (User officer : officers) {
                notificationService.createNotification(
                        officer,
                        "New " + aiResult.getPriority() + " Complaint: " + complaintNumber,
                        "A new " + category.getName() + " issue has been reported in " + saved.getMunicipality() + ".",
                        "NEW_COMPLAINT",
                        saved.getId(),
                        complaintNumber
                );
            }
        }

        return saved;
    }

    @Transactional
    public Complaint updateStatus(Long complaintId, ComplaintStatusUpdateRequest request, User updatedBy) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        ComplaintStatus oldStatus = complaint.getStatus();
        ComplaintStatus newStatus = request.getStatus();

        complaint.setStatus(newStatus);
        if (request.getRemarks() != null && !request.getRemarks().isBlank()) {
            complaint.setOfficialRemarks(request.getRemarks());
        }

        if (newStatus == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
            if (request.getRemarks() != null) {
                complaint.setResolutionNotes(request.getRemarks());
            }
            if (request.getProofImageUrl() != null) {
                complaint.setResolutionImageUrl(request.getProofImageUrl());
            }
        } else if (newStatus == ComplaintStatus.CLOSED) {
            complaint.setClosedAt(LocalDateTime.now());
        }

        Complaint saved = complaintRepository.save(complaint);

        // Record Status History
        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(saved)
                .status(newStatus)
                .remarks(request.getRemarks() != null ? request.getRemarks() : "Status updated from " + oldStatus + " to " + newStatus)
                .updatedBy(updatedBy)
                .proofImageUrl(request.getProofImageUrl())
                .build();
        historyRepository.save(history);

        // Audit Log
        auditLogService.logAction(
                updatedBy,
                "STATUS_UPDATED",
                "COMPLAINT",
                saved.getId(),
                saved.getComplaintNumber(),
                oldStatus != null ? oldStatus.name() : null,
                newStatus != null ? newStatus.name() : null,
                request.getRemarks() != null ? request.getRemarks() : "Status changed to " + newStatus,
                saved.getMunicipality()
        );

        // Notify Citizen about the Live Status Change
        String statusMessage = switch (newStatus) {
            case UNDER_REVIEW -> "Your complaint is currently under review by the municipal engineering desk.";
            case ASSIGNED -> "An official field team has been assigned to address your complaint.";
            case IN_PROGRESS -> "Field work is actively in progress to resolve your reported issue.";
            case ON_HOLD -> "Your complaint is temporarily on hold: " + (request.getRemarks() != null ? request.getRemarks() : "Pending site inspection materials.");
            case RESOLVED -> "Great news! Your complaint has been marked as RESOLVED. Please verify and submit your feedback.";
            case CLOSED -> "This complaint case has been officially closed.";
            case REOPENED -> "Your complaint has been reopened for further municipal review.";
            default -> "Status changed to " + newStatus;
        };

        notificationService.createNotification(
                complaint.getCitizen(),
                "Status Update: " + complaint.getComplaintNumber() + " is now " + newStatus,
                statusMessage,
                "STATUS_CHANGE",
                complaint.getId(),
                complaint.getComplaintNumber()
        );

        return saved;
    }

    @Transactional
    public Complaint assignComplaint(Long complaintId, ComplaintAssignmentRequest request, User assigner) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        String oldOfficer = complaint.getAssignedOfficer() != null ? complaint.getAssignedOfficer().getFullName() : "Unassigned";

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            complaint.setAssignedDepartment(dept);
        }

        if (request.getOfficerId() != null) {
            User officer = userRepository.findById(request.getOfficerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));
            complaint.setAssignedOfficer(officer);
        }

        if (request.getPriority() != null) {
            complaint.setPriority(request.getPriority());
        }

        if (complaint.getStatus() == ComplaintStatus.SUBMITTED || complaint.getStatus() == ComplaintStatus.UNDER_REVIEW) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        if (request.getRemarks() != null) {
            complaint.setOfficialRemarks(request.getRemarks());
        }

        Complaint saved = complaintRepository.save(complaint);

        String newOfficer = saved.getAssignedOfficer() != null ? saved.getAssignedOfficer().getFullName() : "Unassigned";

        // History
        String assignMsg = "Assigned to " + newOfficer +
                " (" + (saved.getAssignedDepartment() != null ? saved.getAssignedDepartment().getName() : "") + ").";
        if (request.getRemarks() != null) assignMsg += " Note: " + request.getRemarks();

        ComplaintStatusHistory history = ComplaintStatusHistory.builder()
                .complaint(saved)
                .status(saved.getStatus())
                .remarks(assignMsg)
                .updatedBy(assigner)
                .build();
        historyRepository.save(history);

        // Audit Log
        auditLogService.logAction(
                assigner,
                "COMPLAINT_ASSIGNED",
                "COMPLAINT",
                saved.getId(),
                saved.getComplaintNumber(),
                oldOfficer,
                newOfficer,
                assignMsg,
                saved.getMunicipality()
        );

        // Notify Assigned Officer
        if (saved.getAssignedOfficer() != null) {
            notificationService.createNotification(
                    saved.getAssignedOfficer(),
                    "Complaint Assigned to You: " + saved.getComplaintNumber(),
                    "You have been assigned to handle issue: " + saved.getTitle() + " (" + saved.getAddress() + ")",
                    "ASSIGNMENT",
                    saved.getId(),
                    saved.getComplaintNumber()
            );
        }

        // Notify Citizen
        notificationService.createNotification(
                saved.getCitizen(),
                "Officer Assigned: " + saved.getComplaintNumber(),
                "Your issue has been assigned to " + (saved.getAssignedDepartment() != null ? saved.getAssignedDepartment().getName() : "municipal team") + ".",
                "ASSIGNMENT",
                saved.getId(),
                saved.getComplaintNumber()
        );

        return saved;
    }

    @Transactional
    public int escalateOverdueComplaints() {
        List<Complaint> overdueList = complaintRepository.findUnescalatedOverdueComplaints(LocalDateTime.now());
        for (Complaint c : overdueList) {
            c.setIsEscalated(true);
            c.setEscalatedAt(LocalDateTime.now());
            complaintRepository.save(c);

            // Record in Status History
            ComplaintStatusHistory escalationHistory = ComplaintStatusHistory.builder()
                    .complaint(c)
                    .status(c.getStatus())
                    .remarks("AUTOMATIC SLA ESCALATION: Case has exceeded SLA resolution deadline of " + c.getSlaDeadline() + ". Escalated to Department Head and Municipal Directorate.")
                    .updatedBy(null)
                    .build();
            historyRepository.save(escalationHistory);

            // Record in Audit Log
            auditLogService.logAction(
                    null,
                    "SLA_ESCALATION",
                    "COMPLAINT",
                    c.getId(),
                    c.getComplaintNumber(),
                    "PENDING_SLA",
                    "ESCALATED",
                    "SLA breach: deadline was " + c.getSlaDeadline(),
                    c.getMunicipality()
            );

            // Notify Department Head if available
            if (c.getAssignedDepartment() != null) {
                List<User> deptHeads = userRepository.findByRole(Role.ROLE_HEAD);
                for (User head : deptHeads) {
                    if (head.getDepartment() != null && head.getDepartment().getId().equals(c.getAssignedDepartment().getId())) {
                        notificationService.createNotification(
                                head,
                                "URGENT SLA ESCALATION: " + c.getComplaintNumber(),
                                "Complaint #" + c.getComplaintNumber() + " ('" + c.getTitle() + "') has breached its SLA resolution deadline and requires immediate supervisory action.",
                                "SLA_BREACH",
                                c.getId(),
                                c.getComplaintNumber()
                        );
                    }
                }
            }
        }
        return overdueList.size();
    }

    public List<Complaint> filterComplaints(String municipality, ComplaintStatus status, Priority priority, Long deptId, Long categoryId, Long officerId, String search) {
        return complaintRepository.filterComplaints(municipality, status, priority, deptId, categoryId, officerId, search);
    }

    public List<Complaint> getCitizenComplaints(Long citizenId, ComplaintStatus status, String search) {
        return complaintRepository.filterCitizenComplaints(citizenId, status, search);
    }

    public List<Complaint> getOfficerAssignedComplaints(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officerId);
    }

    public List<Complaint> getDepartmentComplaints(Long departmentId) {
        return complaintRepository.findByAssignedDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + id));
    }

    public Complaint getComplaintByNumber(String complaintNumber) {
        return complaintRepository.findByComplaintNumber(complaintNumber)
                .orElseThrow(() -> new ResourceNotFoundException("No complaint found with tracking number: " + complaintNumber));
    }

    public List<ComplaintStatusHistory> getComplaintTimeline(Long complaintId) {
        return historyRepository.findByComplaintIdOrderByCreatedAtAsc(complaintId);
    }

    public Map<String, Object> getPublicStats() {
        long total = complaintRepository.count();
        long resolved = complaintRepository.countByStatus(ComplaintStatus.RESOLVED) + complaintRepository.countByStatus(ComplaintStatus.CLOSED);
        long inProgress = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS);
        long citizens = userRepository.countByRole(Role.ROLE_CITIZEN);

        Map<String, Object> map = new HashMap<>();
        map.put("totalComplaints", total);
        map.put("resolvedComplaints", resolved);
        map.put("inProgressComplaints", inProgress);
        map.put("totalCitizens", citizens);
        map.put("resolutionRate", total > 0 ? Math.round(((double) resolved / total) * 100.0) : 100);
        return map;
    }
}
