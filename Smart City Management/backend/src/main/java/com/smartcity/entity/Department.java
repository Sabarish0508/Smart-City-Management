package com.smartcity.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String contactEmail;

    @Column(length = 20)
    private String contactPhone;

    @Column(length = 100)
    private String headOfficerName;

    @Column(name = "sla_hours")
    private Integer slaHours = 48;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Department() {
        this.isActive = true;
        this.slaHours = 48;
    }

    public Department(Long id, String name, String code, String description, String contactEmail, String contactPhone, String headOfficerName, Integer slaHours, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.headOfficerName = headOfficerName;
        this.slaHours = slaHours != null ? slaHours : 48;
        this.isActive = isActive != null ? isActive : true;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
    }

    public static class Builder {
        private Long id;
        private String name;
        private String code;
        private String description;
        private String contactEmail;
        private String contactPhone;
        private String headOfficerName;
        private Integer slaHours = 48;
        private Boolean isActive = true;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder contactEmail(String contactEmail) { this.contactEmail = contactEmail; return this; }
        public Builder contactPhone(String contactPhone) { this.contactPhone = contactPhone; return this; }
        public Builder headOfficerName(String headOfficerName) { this.headOfficerName = headOfficerName; return this; }
        public Builder slaHours(Integer slaHours) { this.slaHours = slaHours; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }

        public Department build() {
            return new Department(id, name, code, description, contactEmail, contactPhone, headOfficerName, slaHours, isActive);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getHeadOfficerName() { return headOfficerName; }
    public void setHeadOfficerName(String headOfficerName) { this.headOfficerName = headOfficerName; }

    public Integer getSlaHours() { return slaHours; }
    public void setSlaHours(Integer slaHours) { this.slaHours = slaHours; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
