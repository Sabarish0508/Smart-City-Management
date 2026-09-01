package com.smartcity.dto;

import jakarta.validation.constraints.NotBlank;

public class UserProfileUpdateRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phoneNumber;
    private String address;
    private String municipality;
    private String ward;
    private String city;
    private String state;
    private String designation;

    public UserProfileUpdateRequest() {}

    public UserProfileUpdateRequest(String fullName, String phoneNumber, String address, String municipality, String ward, String city, String state, String designation) {
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.municipality = municipality;
        this.ward = ward;
        this.city = city;
        this.state = state;
        this.designation = designation;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

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

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
}
