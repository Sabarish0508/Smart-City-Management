package com.smartcity.controller;

import com.smartcity.dto.OfficialCreateRequest;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.security.CustomUserDetails;
import com.smartcity.service.OfficerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officers")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @GetMapping
    public ResponseEntity<List<User>> getAllOfficers(
            @RequestParam(required = false) Long departmentId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access internal personnel rosters.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null) {
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(officerService.getOfficersByDepartment(headDeptId));
        }

        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            Long officerDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (officerDeptId != null) {
                return ResponseEntity.ok(officerService.getOfficersByDepartment(officerDeptId));
            }
            return ResponseEntity.ok(List.of(currentUser));
        }

        if (departmentId != null) {
            return ResponseEntity.ok(officerService.getOfficersByDepartment(departmentId));
        }
        return ResponseEntity.ok(officerService.getAllOfficers());
    }

    @GetMapping("/officials")
    public ResponseEntity<List<User>> getAllOfficials(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Access Restricted: Only Central Administration can view all municipal personnel.");
        }
        return ResponseEntity.ok(officerService.getAllOfficials());
    }

    @GetMapping("/workload")
    public ResponseEntity<List<Map<String, Object>>> getOfficersWorkload(
            @RequestParam(required = false) Long departmentId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access official workload metrics.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            return ResponseEntity.ok(officerService.getOfficersWorkload(headDeptId));
        }

        if (currentUser.getRole() == Role.ROLE_OFFICER) {
            Long officerDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            return ResponseEntity.ok(officerService.getOfficersWorkload(officerDeptId));
        }

        return ResponseEntity.ok(officerService.getOfficersWorkload(departmentId));
    }

    @PostMapping("/create")
    public ResponseEntity<User> createOfficial(
            @Valid @RequestBody OfficialCreateRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() != Role.ROLE_ADMIN) {
            throw new AccessDeniedException("Access Restricted: Only Central Administration can provision official accounts.");
        }

        User created = officerService.createOfficialAccount(request);
        return ResponseEntity.ok(created);
    }
}
