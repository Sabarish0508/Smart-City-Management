package com.smartcity.dto;

import com.smartcity.entity.Priority;

public class ComplaintAssignmentRequest {
    private Long departmentId;
    private Long officerId;
    private Priority priority;
    private String remarks;

    public ComplaintAssignmentRequest() {}

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
