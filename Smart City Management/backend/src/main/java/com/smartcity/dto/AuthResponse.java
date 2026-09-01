package com.smartcity.dto;

import com.smartcity.entity.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Long departmentId;
    private String departmentName;
    private String designation;
    private String address;
    private String municipality;
    private String ward;
    private String city;
    private String state;
    private String phoneNumber;

    public AuthResponse() {
        this.type = "Bearer";
    }

    public AuthResponse(String token, String type, Long id, String email, String fullName, Role role, Long departmentId, String departmentName, String designation, String address, String municipality, String ward, String city, String state, String phoneNumber) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.designation = designation;
        this.address = address;
        this.municipality = municipality;
        this.ward = ward;
        this.city = city;
        this.state = state;
        this.phoneNumber = phoneNumber;
    }

    public static class Builder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String fullName;
        private Role role;
        private Long departmentId;
        private String departmentName;
        private String designation;
        private String address;
        private String municipality;
        private String ward;
        private String city;
        private String state;
        private String phoneNumber;

        public Builder token(String token) { this.token = token; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder id(Long id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder municipality(String municipality) { this.municipality = municipality; return this; }
        public Builder ward(String ward) { this.ward = ward; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, type, id, email, fullName, role, departmentId, departmentName, designation, address, municipality, ward, city, state, phoneNumber);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getMunicipality() { return municipality; }
    public void setMunicipality(String municipality) { this.municipality = municipality; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
