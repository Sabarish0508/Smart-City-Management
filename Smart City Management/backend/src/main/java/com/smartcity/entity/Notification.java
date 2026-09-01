package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(length = 50)
    private String type;

    @Column(name = "related_complaint_id")
    private Long relatedComplaintId;

    @Column(name = "related_complaint_number", length = 50)
    private String relatedComplaintNumber;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Notification() {
        this.isRead = false;
    }

    public Notification(Long id, User recipient, String title, String message, String type, Long relatedComplaintId, String relatedComplaintNumber, Boolean isRead) {
        this.id = id;
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.type = type;
        this.relatedComplaintId = relatedComplaintId;
        this.relatedComplaintNumber = relatedComplaintNumber;
        this.isRead = isRead != null ? isRead : false;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) {
            this.isRead = false;
        }
    }

    public static class Builder {
        private Long id;
        private User recipient;
        private String title;
        private String message;
        private String type;
        private Long relatedComplaintId;
        private String relatedComplaintNumber;
        private Boolean isRead = false;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder recipient(User recipient) { this.recipient = recipient; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder relatedComplaintId(Long relatedComplaintId) { this.relatedComplaintId = relatedComplaintId; return this; }
        public Builder relatedComplaintNumber(String relatedComplaintNumber) { this.relatedComplaintNumber = relatedComplaintNumber; return this; }
        public Builder isRead(Boolean isRead) { this.isRead = isRead; return this; }

        public Notification build() {
            return new Notification(id, recipient, title, message, type, relatedComplaintId, relatedComplaintNumber, isRead);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getRelatedComplaintId() { return relatedComplaintId; }
    public void setRelatedComplaintId(Long relatedComplaintId) { this.relatedComplaintId = relatedComplaintId; }

    public String getRelatedComplaintNumber() { return relatedComplaintNumber; }
    public void setRelatedComplaintNumber(String relatedComplaintNumber) { this.relatedComplaintNumber = relatedComplaintNumber; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
