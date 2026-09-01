package com.smartcity.controller;

import com.smartcity.dto.FeedbackRequest;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintFeedback;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.UserRepository;
import com.smartcity.security.CustomUserDetails;
import com.smartcity.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/complaint/{complaintId}")
    public ResponseEntity<ComplaintFeedback> submitFeedback(
            @PathVariable Long complaintId,
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        ComplaintFeedback feedback = feedbackService.submitFeedback(complaintId, request, userDetails.getUser());
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<ComplaintFeedback> getComplaintFeedback(
            @PathVariable Long complaintId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        validateFeedbackAccess(complaint, currentUser);
        return ResponseEntity.ok(feedbackService.getFeedbackByComplaintId(complaintId));
    }

    @GetMapping("/department/{deptId}")
    public ResponseEntity<List<ComplaintFeedback>> getDepartmentFeedback(
            @PathVariable Long deptId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizens cannot access department feedback logs.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || !headDeptId.equals(deptId)) {
                throw new AccessDeniedException("Access Restricted: Department Heads may only access feedback for their own department.");
            }
        }

        return ResponseEntity.ok(feedbackService.getFeedbackByDepartment(deptId));
    }

    @GetMapping("/officer/{officerId}")
    public ResponseEntity<List<ComplaintFeedback>> getOfficerFeedback(
            @PathVariable Long officerId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizens cannot access officer feedback logs.");
        }

        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            if (!currentUser.getId().equals(officerId)) {
                throw new AccessDeniedException("Access Restricted: Officers may only access their own feedback logs.");
            }
        } else if (currentUser.getRole() == Role.ROLE_HEAD) {
            User officer = userRepository.findById(officerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Officer not found: " + officerId));
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || officer.getDepartment() == null || !headDeptId.equals(officer.getDepartment().getId())) {
                throw new AccessDeniedException("Access Restricted: Department Heads can only inspect officers in their department.");
            }
        }

        return ResponseEntity.ok(feedbackService.getFeedbackByOfficer(officerId));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintFeedback>> getAllFeedback(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            return ResponseEntity.ok(feedbackService.getAllFeedback());
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId != null) {
                return ResponseEntity.ok(feedbackService.getFeedbackByDepartment(headDeptId));
            }
            return ResponseEntity.ok(List.of());
        }

        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            return ResponseEntity.ok(feedbackService.getAllFeedback());
        }

        throw new AccessDeniedException("Access Restricted: Unauthorized feedback access.");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getFeedbackStats(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access administrative feedback statistics.");
        }

        return ResponseEntity.ok(feedbackService.getFeedbackAnalytics());
    }

    private void validateFeedbackAccess(Complaint complaint, User currentUser) {
        if (currentUser.getRole() == Role.ROLE_ADMIN || currentUser.getRole() == Role.ROLE_OFFICER) {
            return;
        }
        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            if (complaint.getCitizen() == null || !complaint.getCitizen().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Access Restricted: You are authorized to access feedback only for your own complaints.");
            }
            return;
        }
        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || complaint.getAssignedDepartment() == null || !headDeptId.equals(complaint.getAssignedDepartment().getId())) {
                throw new AccessDeniedException("Access Restricted: Feedback belongs to another municipal department.");
            }
            return;
        }
        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            if (currentUser.getMunicipality() != null && !currentUser.getMunicipality().isBlank() && complaint.getMunicipality() != null) {
                if (!complaint.getMunicipality().equalsIgnoreCase(currentUser.getMunicipality())) {
                    throw new AccessDeniedException("Access Restricted: Feedback belongs to another municipality.");
                }
            }
            return;
        }
    }
}
