package com.smartcity.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    private long totalComplaints;
    private long submittedComplaints;
    private long underReviewComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long overdueComplaints;
    private long criticalComplaints;
    private double resolutionRatePercentage;
    private double averageResolutionTimeHours;
    private double averageCitizenRating;
    private long totalOfficers;
    private long totalCitizens;
    private long totalDepartments;

    private List<Map<String, Object>> categoryBreakdown;
    private List<Map<String, Object>> departmentBreakdown;
    private List<Map<String, Object>> statusBreakdown;
    private List<Map<String, Object>> monthlyTrends;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(long totalComplaints, long submittedComplaints, long underReviewComplaints, long inProgressComplaints, long resolvedComplaints, long closedComplaints, long overdueComplaints, long criticalComplaints, double resolutionRatePercentage, double averageResolutionTimeHours, double averageCitizenRating, long totalOfficers, long totalCitizens, long totalDepartments, List<Map<String, Object>> categoryBreakdown, List<Map<String, Object>> departmentBreakdown, List<Map<String, Object>> statusBreakdown, List<Map<String, Object>> monthlyTrends) {
        this.totalComplaints = totalComplaints;
        this.submittedComplaints = submittedComplaints;
        this.underReviewComplaints = underReviewComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.closedComplaints = closedComplaints;
        this.overdueComplaints = overdueComplaints;
        this.criticalComplaints = criticalComplaints;
        this.resolutionRatePercentage = resolutionRatePercentage;
        this.averageResolutionTimeHours = averageResolutionTimeHours;
        this.averageCitizenRating = averageCitizenRating;
        this.totalOfficers = totalOfficers;
        this.totalCitizens = totalCitizens;
        this.totalDepartments = totalDepartments;
        this.categoryBreakdown = categoryBreakdown;
        this.departmentBreakdown = departmentBreakdown;
        this.statusBreakdown = statusBreakdown;
        this.monthlyTrends = monthlyTrends;
    }

    public static class Builder {
        private long totalComplaints;
        private long submittedComplaints;
        private long underReviewComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private long closedComplaints;
        private long overdueComplaints;
        private long criticalComplaints;
        private double resolutionRatePercentage;
        private double averageResolutionTimeHours;
        private double averageCitizenRating;
        private long totalOfficers;
        private long totalCitizens;
        private long totalDepartments;
        private List<Map<String, Object>> categoryBreakdown;
        private List<Map<String, Object>> departmentBreakdown;
        private List<Map<String, Object>> statusBreakdown;
        private List<Map<String, Object>> monthlyTrends;

        public Builder totalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; return this; }
        public Builder submittedComplaints(long submittedComplaints) { this.submittedComplaints = submittedComplaints; return this; }
        public Builder underReviewComplaints(long underReviewComplaints) { this.underReviewComplaints = underReviewComplaints; return this; }
        public Builder inProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; return this; }
        public Builder resolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; return this; }
        public Builder closedComplaints(long closedComplaints) { this.closedComplaints = closedComplaints; return this; }
        public Builder overdueComplaints(long overdueComplaints) { this.overdueComplaints = overdueComplaints; return this; }
        public Builder criticalComplaints(long criticalComplaints) { this.criticalComplaints = criticalComplaints; return this; }
        public Builder resolutionRatePercentage(double resolutionRatePercentage) { this.resolutionRatePercentage = resolutionRatePercentage; return this; }
        public Builder averageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; return this; }
        public Builder averageCitizenRating(double averageCitizenRating) { this.averageCitizenRating = averageCitizenRating; return this; }
        public Builder totalOfficers(long totalOfficers) { this.totalOfficers = totalOfficers; return this; }
        public Builder totalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; return this; }
        public Builder totalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; return this; }
        public Builder categoryBreakdown(List<Map<String, Object>> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; return this; }
        public Builder departmentBreakdown(List<Map<String, Object>> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; return this; }
        public Builder statusBreakdown(List<Map<String, Object>> statusBreakdown) { this.statusBreakdown = statusBreakdown; return this; }
        public Builder monthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; return this; }

        public DashboardStatsResponse build() {
            return new DashboardStatsResponse(totalComplaints, submittedComplaints, underReviewComplaints, inProgressComplaints, resolvedComplaints, closedComplaints, overdueComplaints, criticalComplaints, resolutionRatePercentage, averageResolutionTimeHours, averageCitizenRating, totalOfficers, totalCitizens, totalDepartments, categoryBreakdown, departmentBreakdown, statusBreakdown, monthlyTrends);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getSubmittedComplaints() { return submittedComplaints; }
    public void setSubmittedComplaints(long submittedComplaints) { this.submittedComplaints = submittedComplaints; }

    public long getUnderReviewComplaints() { return underReviewComplaints; }
    public void setUnderReviewComplaints(long underReviewComplaints) { this.underReviewComplaints = underReviewComplaints; }

    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public long getClosedComplaints() { return closedComplaints; }
    public void setClosedComplaints(long closedComplaints) { this.closedComplaints = closedComplaints; }

    public long getOverdueComplaints() { return overdueComplaints; }
    public void setOverdueComplaints(long overdueComplaints) { this.overdueComplaints = overdueComplaints; }

    public long getCriticalComplaints() { return criticalComplaints; }
    public void setCriticalComplaints(long criticalComplaints) { this.criticalComplaints = criticalComplaints; }

    public double getResolutionRatePercentage() { return resolutionRatePercentage; }
    public void setResolutionRatePercentage(double resolutionRatePercentage) { this.resolutionRatePercentage = resolutionRatePercentage; }

    public double getAverageResolutionTimeHours() { return averageResolutionTimeHours; }
    public void setAverageResolutionTimeHours(double averageResolutionTimeHours) { this.averageResolutionTimeHours = averageResolutionTimeHours; }

    public double getAverageCitizenRating() { return averageCitizenRating; }
    public void setAverageCitizenRating(double averageCitizenRating) { this.averageCitizenRating = averageCitizenRating; }

    public long getTotalOfficers() { return totalOfficers; }
    public void setTotalOfficers(long totalOfficers) { this.totalOfficers = totalOfficers; }

    public long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(long totalCitizens) { this.totalCitizens = totalCitizens; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public List<Map<String, Object>> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<Map<String, Object>> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<Map<String, Object>> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(List<Map<String, Object>> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public List<Map<String, Object>> getStatusBreakdown() { return statusBreakdown; }
    public void setStatusBreakdown(List<Map<String, Object>> statusBreakdown) { this.statusBreakdown = statusBreakdown; }

    public List<Map<String, Object>> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
}
