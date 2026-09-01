package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints", indexes = {
    @Index(name = "idx_complaint_number", columnList = "complaint_number"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_priority", columnList = "priority"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_number", nullable = false, unique = true, length = 50)
    private String complaintNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintStatus status = ComplaintStatus.SUBMITTED;

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String municipality;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String landmark;

    @Column(length = 20)
    private String pincode;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "ai_classification", length = 100)
    private String aiClassification;

    @Column(name = "ai_priority_confidence")
    private Double aiPriorityConfidence;

    @Column(name = "ai_predicted_department", length = 100)
    private String aiPredictedDepartment;

    @Column(name = "is_duplicate")
    private Boolean isDuplicate = false;

    @Column(name = "duplicate_of_complaint_number", length = 50)
    private String duplicateOfComplaintNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_department_id")
    private Department assignedDepartment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(name = "official_remarks", columnDefinition = "TEXT")
    private String officialRemarks;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolution_image_url", length = 500)
    private String resolutionImageUrl;

    @Column(name = "sla_deadline")
    private LocalDateTime slaDeadline;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "is_escalated")
    private Boolean isEscalated = false;

    @Column(name = "escalated_at")
    private LocalDateTime escalatedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "complaint", fetch = FetchType.EAGER)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"complaint"})
    private ComplaintFeedback feedback;

    public Complaint() {
        this.status = ComplaintStatus.SUBMITTED;
        this.priority = Priority.MEDIUM;
        this.isDuplicate = false;
    }

    public Complaint(Long id, String complaintNumber, User citizen, String title, String description, ComplaintCategory category, Priority priority, ComplaintStatus status, String address, String municipality, String city, String landmark, String pincode, Double latitude, Double longitude, String imageUrl, String aiClassification, Double aiPriorityConfidence, String aiPredictedDepartment, Boolean isDuplicate, String duplicateOfComplaintNumber, Department assignedDepartment, User assignedOfficer, String officialRemarks, String resolutionNotes, String resolutionImageUrl, LocalDateTime slaDeadline, LocalDateTime resolvedAt, LocalDateTime closedAt) {
        this.id = id;
        this.complaintNumber = complaintNumber;
        this.citizen = citizen;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.status = status != null ? status : ComplaintStatus.SUBMITTED;
        this.address = address;
        this.municipality = municipality;
        this.city = city;
        this.landmark = landmark;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.aiClassification = aiClassification;
        this.aiPriorityConfidence = aiPriorityConfidence;
        this.aiPredictedDepartment = aiPredictedDepartment;
        this.isDuplicate = isDuplicate != null ? isDuplicate : false;
        this.duplicateOfComplaintNumber = duplicateOfComplaintNumber;
        this.assignedDepartment = assignedDepartment;
        this.assignedOfficer = assignedOfficer;
        this.officialRemarks = officialRemarks;
        this.resolutionNotes = resolutionNotes;
        this.resolutionImageUrl = resolutionImageUrl;
        this.slaDeadline = slaDeadline;
        this.resolvedAt = resolvedAt;
        this.closedAt = closedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) this.status = ComplaintStatus.SUBMITTED;
        if (this.priority == null) this.priority = Priority.MEDIUM;
        if (this.isDuplicate == null) this.isDuplicate = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static class Builder {
        private Long id;
        private String complaintNumber;
        private User citizen;
        private String title;
        private String description;
        private ComplaintCategory category;
        private Priority priority = Priority.MEDIUM;
        private ComplaintStatus status = ComplaintStatus.SUBMITTED;
        private String address;
        private String municipality;
        private String city;
        private String landmark;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private String imageUrl;
        private String aiClassification;
        private Double aiPriorityConfidence;
        private String aiPredictedDepartment;
        private Boolean isDuplicate = false;
        private String duplicateOfComplaintNumber;
        private Department assignedDepartment;
        private User assignedOfficer;
        private String officialRemarks;
        private String resolutionNotes;
        private String resolutionImageUrl;
        private LocalDateTime slaDeadline;
        private LocalDateTime resolvedAt;
        private LocalDateTime closedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder complaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; return this; }
        public Builder citizen(User citizen) { this.citizen = citizen; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(ComplaintCategory category) { this.category = category; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder status(ComplaintStatus status) { this.status = status; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder municipality(String municipality) { this.municipality = municipality; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder landmark(String landmark) { this.landmark = landmark; return this; }
        public Builder pincode(String pincode) { this.pincode = pincode; return this; }
        public Builder latitude(Double latitude) { this.latitude = latitude; return this; }
        public Builder longitude(Double longitude) { this.longitude = longitude; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder aiClassification(String aiClassification) { this.aiClassification = aiClassification; return this; }
        public Builder aiPriorityConfidence(Double aiPriorityConfidence) { this.aiPriorityConfidence = aiPriorityConfidence; return this; }
        public Builder aiPredictedDepartment(String aiPredictedDepartment) { this.aiPredictedDepartment = aiPredictedDepartment; return this; }
        public Builder isDuplicate(Boolean isDuplicate) { this.isDuplicate = isDuplicate; return this; }
        public Builder duplicateOfComplaintNumber(String duplicateOfComplaintNumber) { this.duplicateOfComplaintNumber = duplicateOfComplaintNumber; return this; }
        public Builder assignedDepartment(Department assignedDepartment) { this.assignedDepartment = assignedDepartment; return this; }
        public Builder assignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; return this; }
        public Builder officialRemarks(String officialRemarks) { this.officialRemarks = officialRemarks; return this; }
        public Builder resolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; return this; }
        public Builder resolutionImageUrl(String resolutionImageUrl) { this.resolutionImageUrl = resolutionImageUrl; return this; }
        public Builder slaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; return this; }
        public Builder resolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public Builder closedAt(LocalDateTime closedAt) { this.closedAt = closedAt; return this; }

        public Complaint build() {
            return new Complaint(id, complaintNumber, citizen, title, description, category, priority, status, address, municipality, city, landmark, pincode, latitude, longitude, imageUrl, aiClassification, aiPriorityConfidence, aiPredictedDepartment, isDuplicate, duplicateOfComplaintNumber, assignedDepartment, assignedOfficer, officialRemarks, resolutionNotes, resolutionImageUrl, slaDeadline, resolvedAt, closedAt);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ComplaintCategory getCategory() { return category; }
    public void setCategory(ComplaintCategory category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { this.municipality = municipality; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAiClassification() { return aiClassification; }
    public void setAiClassification(String aiClassification) { this.aiClassification = aiClassification; }

    public Double getAiPriorityConfidence() { return aiPriorityConfidence; }
    public void setAiPriorityConfidence(Double aiPriorityConfidence) { this.aiPriorityConfidence = aiPriorityConfidence; }

    public String getAiPredictedDepartment() { return aiPredictedDepartment; }
    public void setAiPredictedDepartment(String aiPredictedDepartment) { this.aiPredictedDepartment = aiPredictedDepartment; }

    public Boolean getIsDuplicate() { return isDuplicate; }
    public void setIsDuplicate(Boolean isDuplicate) { this.isDuplicate = isDuplicate; }

    public String getDuplicateOfComplaintNumber() { return duplicateOfComplaintNumber; }
    public void setDuplicateOfComplaintNumber(String duplicateOfComplaintNumber) { this.duplicateOfComplaintNumber = duplicateOfComplaintNumber; }

    public Department getAssignedDepartment() { return assignedDepartment; }
    public void setAssignedDepartment(Department assignedDepartment) { this.assignedDepartment = assignedDepartment; }

    public User getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getOfficialRemarks() { return officialRemarks; }
    public void setOfficialRemarks(String officialRemarks) { this.officialRemarks = officialRemarks; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public String getResolutionImageUrl() { return resolutionImageUrl; }
    public void setResolutionImageUrl(String resolutionImageUrl) { this.resolutionImageUrl = resolutionImageUrl; }

    public LocalDateTime getSlaDeadline() { return slaDeadline; }
    public void setSlaDeadline(LocalDateTime slaDeadline) { this.slaDeadline = slaDeadline; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsEscalated() { return isEscalated; }
    public void setIsEscalated(Boolean isEscalated) { this.isEscalated = isEscalated; }

    public LocalDateTime getEscalatedAt() { return escalatedAt; }
    public void setEscalatedAt(LocalDateTime escalatedAt) { this.escalatedAt = escalatedAt; }

    public ComplaintFeedback getFeedback() { return feedback; }
    public void setFeedback(ComplaintFeedback feedback) { this.feedback = feedback; }
}
