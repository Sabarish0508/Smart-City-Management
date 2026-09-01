package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id"),
    @Index(name = "idx_audit_performed_at", columnList = "performed_at")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "performed_by", nullable = false, length = 150)
    private String performedBy;

    @Column(name = "user_role", nullable = false, length = 50)
    private String userRole;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "entity_identifier", length = 100)
    private String entityIdentifier;

    @Column(name = "previous_value", columnDefinition = "TEXT")
    private String previousValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "municipality", length = 100)
    private String municipality;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    public AuditLog() {
        this.performedAt = LocalDateTime.now();
    }

    public AuditLog(Long id, String performedBy, String userRole, String action, String entityType, Long entityId, String entityIdentifier, String previousValue, String newValue, String details, String municipality, LocalDateTime performedAt) {
        this.id = id;
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityIdentifier = entityIdentifier;
        this.previousValue = previousValue;
        this.newValue = newValue;
        this.details = details;
        this.municipality = municipality;
        this.performedAt = performedAt != null ? performedAt : LocalDateTime.now();
    }

    public static class Builder {
        private Long id;
        private String performedBy;
        private String userRole;
        private String action;
        private String entityType;
        private Long entityId;
        private String entityIdentifier;
        private String previousValue;
        private String newValue;
        private String details;
        private String municipality;
        private LocalDateTime performedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder performedBy(String performedBy) { this.performedBy = performedBy; return this; }
        public Builder userRole(String userRole) { this.userRole = userRole; return this; }
        public Builder action(String action) { this.action = action; return this; }
        public Builder entityType(String entityType) { this.entityType = entityType; return this; }
        public Builder entityId(Long entityId) { this.entityId = entityId; return this; }
        public Builder entityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; return this; }
        public Builder previousValue(String previousValue) { this.previousValue = previousValue; return this; }
        public Builder newValue(String newValue) { this.newValue = newValue; return this; }
        public Builder details(String details) { this.details = details; return this; }
        public Builder municipality(String municipality) { this.municipality = municipality; return this; }
        public Builder performedAt(LocalDateTime performedAt) { this.performedAt = performedAt; return this; }

        public AuditLog build() {
            return new AuditLog(id, performedBy, userRole, action, entityType, entityId, entityIdentifier, previousValue, newValue, details, municipality, performedAt);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getEntityIdentifier() { return entityIdentifier; }
    public void setEntityIdentifier(String entityIdentifier) { this.entityIdentifier = entityIdentifier; }

    public String getPreviousValue() { return previousValue; }
    public void setPreviousValue(String previousValue) { this.previousValue = previousValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { this.municipality = municipality; }

    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
}
