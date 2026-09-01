package com.smartcity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "complaint_categories")
public class ComplaintCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority defaultPriority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "default_department_id")
    private Department defaultDepartment;

    public ComplaintCategory() {
        this.defaultPriority = Priority.MEDIUM;
    }

    public ComplaintCategory(Long id, String name, String code, String description, String icon, Priority defaultPriority, Department defaultDepartment) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.icon = icon;
        this.defaultPriority = defaultPriority != null ? defaultPriority : Priority.MEDIUM;
        this.defaultDepartment = defaultDepartment;
    }

    public static class Builder {
        private Long id;
        private String name;
        private String code;
        private String description;
        private String icon;
        private Priority defaultPriority = Priority.MEDIUM;
        private Department defaultDepartment;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder code(String code) { this.code = code; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder icon(String icon) { this.icon = icon; return this; }
        public Builder defaultPriority(Priority defaultPriority) { this.defaultPriority = defaultPriority; return this; }
        public Builder defaultDepartment(Department defaultDepartment) { this.defaultDepartment = defaultDepartment; return this; }

        public ComplaintCategory build() {
            return new ComplaintCategory(id, name, code, description, icon, defaultPriority, defaultDepartment);
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

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public Priority getDefaultPriority() { return defaultPriority; }
    public void setDefaultPriority(Priority defaultPriority) { this.defaultPriority = defaultPriority; }

    public Department getDefaultDepartment() { return defaultDepartment; }
    public void setDefaultDepartment(Department defaultDepartment) { this.defaultDepartment = defaultDepartment; }
}
