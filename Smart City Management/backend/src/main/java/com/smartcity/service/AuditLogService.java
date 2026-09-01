package com.smartcity.service;

import com.smartcity.entity.AuditLog;
import com.smartcity.entity.User;
import com.smartcity.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public AuditLog logAction(User performer, String action, String entityType, Long entityId, String entityIdentifier, String previousValue, String newValue, String details, String municipality) {
        String performerName = performer != null ? performer.getFullName() + " (" + performer.getEmail() + ")" : "SYSTEM_ENGINE";
        String performerRole = performer != null && performer.getRole() != null ? performer.getRole().name() : "SYSTEM";
        String resolvedMunicipality = municipality != null ? municipality : (performer != null ? performer.getMunicipality() : null);

        AuditLog log = AuditLog.builder()
                .performedBy(performerName)
                .userRole(performerRole)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .entityIdentifier(entityIdentifier)
                .previousValue(previousValue)
                .newValue(newValue)
                .details(details)
                .municipality(resolvedMunicipality)
                .performedAt(LocalDateTime.now())
                .build();

        return auditLogRepository.save(log);
    }

    public List<AuditLog> getRecentLogs(int limit) {
        return auditLogRepository.findAllByOrderByPerformedAtDesc(PageRequest.of(0, Math.min(limit, 100))).getContent();
    }

    public List<AuditLog> getLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByPerformedAtDesc(entityType, entityId);
    }
}
