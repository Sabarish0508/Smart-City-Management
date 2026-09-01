package com.smartcity.controller;

import com.smartcity.dto.ComplaintAssignmentRequest;
import com.smartcity.dto.ComplaintCreateRequest;
import com.smartcity.dto.ComplaintStatusUpdateRequest;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintStatus;
import com.smartcity.entity.ComplaintStatusHistory;
import com.smartcity.entity.Priority;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.repository.UserRepository;
import com.smartcity.security.CustomUserDetails;
import com.smartcity.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(@Valid @RequestBody ComplaintCreateRequest request,
                                                    Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Complaint created = complaintService.createComplaint(request, userDetails.getUser());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long officerId,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        // 1. Citizen role: strictly scoped to own complaints only
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            List<Complaint> list = complaintService.getCitizenComplaints(currentUser.getId(), status, search);
            return ResponseEntity.ok(list);
        }

        // 2. Department Head role: strictly scoped to own department
        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null) {
                return ResponseEntity.ok(List.of());
            }
            List<Complaint> list = complaintService.filterComplaints(null, status, priority, headDeptId, categoryId, officerId, search);
            return ResponseEntity.ok(list);
        }

        // 3. Municipal Official & Central Administration: full operational visibility across all complaints and departments in portal
        List<Complaint> list = complaintService.filterComplaints(null, status, priority, departmentId, categoryId, officerId, search);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMyComplaints(
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String search,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        List<Complaint> list = complaintService.getCitizenComplaints(userDetails.getId(), status, search);
        return ResponseEntity.ok(list);
    }

    @GetMapping({"/officer/assigned", "/my-assigned"})
    public ResponseEntity<List<Complaint>> getOfficerAssignedComplaints(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access official task assignments.");
        }
        List<Complaint> list = complaintService.getOfficerAssignedComplaints(userDetails.getId());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/officer/department")
    public ResponseEntity<List<Complaint>> getOfficerDepartmentComplaints(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access department operations queues.");
        }
        Long deptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
        if (deptId != null) {
            List<Complaint> list = complaintService.getDepartmentComplaints(deptId);
            return ResponseEntity.ok(list);
        }
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Complaint>> getDepartmentComplaints(
            @PathVariable Long departmentId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access internal department queues.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || !headDeptId.equals(departmentId)) {
                throw new AccessDeniedException("Access Restricted: Department Heads may only access complaints within their own department.");
            }
        }

        List<Complaint> list = complaintService.getDepartmentComplaints(departmentId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/department/my")
    public ResponseEntity<List<Complaint>> getMyDepartmentComplaints(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();
        
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access department queues.");
        }

        Long deptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
        if (deptId == null) {
            return ResponseEntity.ok(List.of());
        }
        List<Complaint> list = complaintService.getDepartmentComplaints(deptId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(
            @PathVariable Long id,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Complaint complaint = complaintService.getComplaintById(id);
        validateComplaintAccess(complaint, userDetails.getUser());
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/track/{complaintNumber}")
    public ResponseEntity<Complaint> trackComplaint(
            @PathVariable String complaintNumber,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Complaint complaint = complaintService.getComplaintByNumber(complaintNumber);
        validateComplaintAccess(complaint, userDetails.getUser());
        return ResponseEntity.ok(complaint);
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<List<ComplaintStatusHistory>> getComplaintTimeline(
            @PathVariable Long id,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Complaint complaint = complaintService.getComplaintById(id);
        validateComplaintAccess(complaint, userDetails.getUser());
        List<ComplaintStatusHistory> timeline = complaintService.getComplaintTimeline(id);
        return ResponseEntity.ok(timeline);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ComplaintStatusUpdateRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizens cannot modify official complaint status.");
        }

        Complaint complaint = complaintService.getComplaintById(id);
        validateComplaintAccess(complaint, currentUser);

        Complaint updated = complaintService.updateStatus(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Complaint> assignOfficer(
            @PathVariable Long id,
            @RequestBody ComplaintAssignmentRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN || currentUser.getRole() == Role.ROLE_OFFICER) {
            throw new AccessDeniedException("Access Restricted: Only Department Heads and Central Administration can assign complaints.");
        }

        Complaint complaint = complaintService.getComplaintById(id);
        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || complaint.getAssignedDepartment() == null || !headDeptId.equals(complaint.getAssignedDepartment().getId())) {
                throw new AccessDeniedException("Access Restricted: Department Heads can only assign complaints within their own department.");
            }
        }

        Complaint updated = complaintService.assignComplaint(id, request, currentUser);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/public-stats")
    public ResponseEntity<Map<String, Object>> getPublicStats() {
        return ResponseEntity.ok(complaintService.getPublicStats());
    }

    /**
     * Strict Resource Authorization Verification
     */
    private void validateComplaintAccess(Complaint complaint, User currentUser) {
        if (currentUser.getRole() == Role.ROLE_ADMIN || currentUser.getRole() == Role.ROLE_OFFICER) {
            return; // Municipal Official & Central Administration have full portal authorization
        }

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            if (complaint.getCitizen() == null || !complaint.getCitizen().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Access Restricted: You are authorized to access only complaints registered under your citizen account.");
            }
            return;
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || complaint.getAssignedDepartment() == null || !headDeptId.equals(complaint.getAssignedDepartment().getId())) {
                throw new AccessDeniedException("Access Restricted: You are authorized to access only complaints within your assigned department.");
            }
            return;
        }

        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            if (currentUser.getMunicipality() != null && !currentUser.getMunicipality().isBlank() && complaint.getMunicipality() != null) {
                if (!complaint.getMunicipality().equalsIgnoreCase(currentUser.getMunicipality())) {
                    throw new AccessDeniedException("Access Restricted: You are authorized to access complaints only within your assigned municipality (" + currentUser.getMunicipality() + ").");
                }
            }
            return;
        }
    }
}
