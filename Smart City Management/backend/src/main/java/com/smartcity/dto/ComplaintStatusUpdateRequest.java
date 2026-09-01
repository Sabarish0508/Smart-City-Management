package com.smartcity.dto;

import com.smartcity.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public class ComplaintStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    private String remarks;
    private String proofImageUrl;

    public ComplaintStatusUpdateRequest() {}

    public ComplaintStatusUpdateRequest(ComplaintStatus status, String remarks, String proofImageUrl) {
        this.status = status;
        this.remarks = remarks;
        this.proofImageUrl = proofImageUrl;
    }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getProofImageUrl() { return proofImageUrl; }
    public void setProofImageUrl(String proofImageUrl) { this.proofImageUrl = proofImageUrl; }
}
