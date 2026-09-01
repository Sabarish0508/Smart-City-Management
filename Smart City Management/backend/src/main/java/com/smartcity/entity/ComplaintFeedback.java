package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_feedback")
public class ComplaintFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "complaint_id", nullable = false, unique = true)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"feedback"})
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "is_satisfied")
    private Boolean isSatisfied;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ComplaintFeedback() {}

    public ComplaintFeedback(Long id, Complaint complaint, User citizen, Integer rating, String comments, Boolean isSatisfied) {
        this.id = id;
        this.complaint = complaint;
        this.citizen = citizen;
        this.rating = rating;
        this.comments = comments;
        this.isSatisfied = isSatisfied;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static class Builder {
        private Long id;
        private Complaint complaint;
        private User citizen;
        private Integer rating;
        private String comments;
        private Boolean isSatisfied;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder complaint(Complaint complaint) { this.complaint = complaint; return this; }
        public Builder citizen(User citizen) { this.citizen = citizen; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder comments(String comments) { this.comments = comments; return this; }
        public Builder isSatisfied(Boolean isSatisfied) { this.isSatisfied = isSatisfied; return this; }

        public ComplaintFeedback build() {
            return new ComplaintFeedback(id, complaint, citizen, rating, comments, isSatisfied);
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

    public User getCitizen() { return citizen; }
    public void setCitizen(User citizen) { this.citizen = citizen; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public Boolean getIsSatisfied() { return isSatisfied; }
    public void setIsSatisfied(Boolean isSatisfied) { this.isSatisfied = isSatisfied; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
