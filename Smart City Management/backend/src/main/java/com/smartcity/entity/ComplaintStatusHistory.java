package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_status_history")
public class ComplaintStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintStatus status;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "updated_by_user_id")
    private User updatedBy;

    @Column(name = "proof_image_url", length = 500)
    private String proofImageUrl;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ComplaintStatusHistory() {}

    public ComplaintStatusHistory(Long id, Complaint complaint, ComplaintStatus status, String remarks, User updatedBy, String proofImageUrl) {
        this.id = id;
        this.complaint = complaint;
        this.status = status;
        this.remarks = remarks;
        this.updatedBy = updatedBy;
        this.proofImageUrl = proofImageUrl;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static class Builder {
        private Long id;
        private Complaint complaint;
        private ComplaintStatus status;
        private String remarks;
        private User updatedBy;
        private String proofImageUrl;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public Builder status(ComplaintStatus status) { this.status = status; return this; }
        public Builder remarks(String remarks) { this.remarks = remarks; return this; }
        public Builder updatedBy(User updatedBy) { this.updatedBy = updatedBy; return this; }
        public Builder proofImageUrl(String proofImageUrl) { this.proofImageUrl = proofImageUrl; return this; }

        public ComplaintStatusHistory build() {
            return new ComplaintStatusHistory(id, complaint, status, remarks, updatedBy, proofImageUrl);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Complaint getComplaint() { return complaint; }
    public void setComplaint(Complaint complaint) { this.complaint = complaint; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public User getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(User updatedBy) { this.updatedBy = updatedBy; }

    public String getProofImageUrl() { return proofImageUrl; }
    public void setProofImageUrl(String proofImageUrl) { this.proofImageUrl = proofImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
