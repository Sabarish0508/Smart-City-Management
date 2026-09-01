package com.smartcity.controller;

import com.smartcity.dto.DashboardStatsResponse;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.security.CustomUserDetails;
import com.smartcity.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() != Role.ROLE_ADMIN && currentUser.getRole() != Role.ROLE_OFFICER) {
            throw new AccessDeniedException("Access Restricted: Central Administration and Municipal Official metrics only.");
        }
        return ResponseEntity.ok(analyticsService.getAdminDashboardStats());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<DashboardStatsResponse> getDepartmentStats(
            @PathVariable Long departmentId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizens cannot access department operational analytics.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || !headDeptId.equals(departmentId)) {
                throw new AccessDeniedException("Access Restricted: Department Heads may only access analytics for their own department.");
            }
        }

        return ResponseEntity.ok(analyticsService.getDepartmentDashboardStats(departmentId));
    }

    @GetMapping("/department/my")
    public ResponseEntity<DashboardStatsResponse> getMyDepartmentStats(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizen accounts cannot access department analytics.");
        }

        Long deptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
        if (deptId == null) {
            throw new AccessDeniedException("Access Restricted: User has no assigned department.");
        }
        return ResponseEntity.ok(analyticsService.getDepartmentDashboardStats(deptId));
    }

    @GetMapping("/map-data")
    public ResponseEntity<List<Map<String, Object>>> getMapData(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId != null) {
                return ResponseEntity.ok(analyticsService.getDepartmentMapLocations(headDeptId));
            }
        }
        return ResponseEntity.ok(analyticsService.getMapLocations());
    }

    @GetMapping("/department/{departmentId}/map-data")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentMapData(
            @PathVariable Long departmentId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User currentUser = userDetails.getUser();

        if (currentUser.getRole() == Role.ROLE_CITIZEN) {
            throw new AccessDeniedException("Access Restricted: Citizens cannot access internal GIS telemetry.");
        }

        if (currentUser.getRole() == Role.ROLE_HEAD) {
            Long headDeptId = currentUser.getDepartment() != null ? currentUser.getDepartment().getId() : null;
            if (headDeptId == null || !headDeptId.equals(departmentId)) {
                throw new AccessDeniedException("Access Restricted: Department Heads can only inspect GIS telemetry in their department.");
            }
        }

        return ResponseEntity.ok(analyticsService.getDepartmentMapLocations(departmentId));
    }
}
