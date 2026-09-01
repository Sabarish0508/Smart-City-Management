package com.smartcity.controller;

import com.smartcity.entity.AuditLog;
import com.smartcity.entity.User;
import com.smartcity.repository.UserRepository;
import com.smartcity.service.AuditLogService;
import com.smartcity.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs(@RequestParam(defaultValue = "50") int limit) {
        List<AuditLog> logs = auditLogService.getRecentLogs(limit);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/escalate-overdue")
    public ResponseEntity<Map<String, Object>> triggerSlaEscalation() {
        int escalatedCount = complaintService.escalateOverdueComplaints();
        Map<String, Object> res = new HashMap<>();
        res.put("status", "SUCCESS");
        res.put("escalatedComplaintsCount", escalatedCount);
        res.put("message", "SLA escalation check completed. " + escalatedCount + " overdue cases processed.");
        return ResponseEntity.ok(res);
    }

    @GetMapping("/officials")
    public ResponseEntity<List<User>> getAllOfficials() {
        List<User> officials = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole() != com.smartcity.entity.Role.ROLE_CITIZEN)
                .toList();
        return ResponseEntity.ok(officials);
    }
}
