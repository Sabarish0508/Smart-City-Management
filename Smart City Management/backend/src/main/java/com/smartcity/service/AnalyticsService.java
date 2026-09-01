package com.smartcity.service;

import com.smartcity.dto.DashboardStatsResponse;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintStatus;
import com.smartcity.entity.Priority;
import com.smartcity.entity.Role;
import com.smartcity.repository.ComplaintFeedbackRepository;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.DepartmentRepository;
import com.smartcity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    public DashboardStatsResponse getAdminDashboardStats() {
        List<Complaint> allComplaints = complaintRepository.findAll();
        long totalComplaints = allComplaints.size();

        long submitted = allComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED).count();
        long underReview = allComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.UNDER_REVIEW).count();
        long resolved = allComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED).count();
        long closed = allComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.CLOSED).count();
        long inProgress = Math.max(0, totalComplaints - (resolved + closed));
        long overdue = allComplaints.stream().filter(c -> c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED && c.getSlaDeadline() != null && c.getSlaDeadline().isBefore(LocalDateTime.now())).count();
        long critical = allComplaints.stream().filter(c -> c.getPriority() == Priority.CRITICAL && c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED).count();

        long totalOfficers = userRepository.countByRole(Role.ROLE_OFFICER);
        long totalCitizens = userRepository.countByRole(Role.ROLE_CITIZEN);
        long totalDepartments = departmentRepository.count();

        Double avgRating = feedbackRepository.getAverageRating();
        double resolutionRate = totalComplaints > 0 ? ((double) (resolved + closed) / totalComplaints) * 100.0 : 100.0;

        // Real Average Resolution Time from Database Records
        double totalResolutionHours = 0;
        int resolvedCountWithTimestamps = 0;
        for (Complaint c : allComplaints) {
            if ((c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED) && c.getCreatedAt() != null) {
                LocalDateTime finishTime = c.getResolvedAt() != null ? c.getResolvedAt() : (c.getClosedAt() != null ? c.getClosedAt() : c.getUpdatedAt());
                if (finishTime != null) {
                    double hours = Math.max(0.1, Duration.between(c.getCreatedAt(), finishTime).toMinutes() / 60.0);
                    totalResolutionHours += hours;
                    resolvedCountWithTimestamps++;
                }
            }
        }
        double realAvgResolutionHours = resolvedCountWithTimestamps > 0 ? Math.round((totalResolutionHours / resolvedCountWithTimestamps) * 10.0) / 10.0 : 0.0;

        // Categories breakdown
        List<Object[]> catRows = complaintRepository.countByCategories();
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Object[] row : catRows) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", row[0] != null ? row[0] : "General");
            item.put("count", row[1]);
            categoryBreakdown.add(item);
        }

        // Departments breakdown
        List<Object[]> deptRows = complaintRepository.countByDepartments();
        List<Map<String, Object>> deptBreakdown = new ArrayList<>();
        for (Object[] row : deptRows) {
            Map<String, Object> item = new HashMap<>();
            item.put("department", row[0] != null ? row[0] : "Unassigned");
            item.put("count", row[1]);
            deptBreakdown.add(item);
        }

        // Status breakdown
        List<Object[]> statusRows = complaintRepository.countByStatuses();
        List<Map<String, Object>> statusBreakdown = new ArrayList<>();
        for (Object[] row : statusRows) {
            Map<String, Object> item = new HashMap<>();
            item.put("status", row[0].toString());
            item.put("count", row[1]);
            statusBreakdown.add(item);
        }

        // Real Monthly Trends from Actual Complaint and Resolution Timestamps
        List<Map<String, Object>> monthlyTrends = calculateRealMonthlyTrends(allComplaints);

        return DashboardStatsResponse.builder()
                .totalComplaints(totalComplaints)
                .submittedComplaints(submitted)
                .underReviewComplaints(underReview)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .closedComplaints(closed)
                .overdueComplaints(overdue)
                .criticalComplaints(critical)
                .resolutionRatePercentage(Math.round(resolutionRate * 10.0) / 10.0)
                .averageResolutionTimeHours(realAvgResolutionHours)
                .averageCitizenRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalOfficers(totalOfficers)
                .totalCitizens(totalCitizens)
                .totalDepartments(totalDepartments)
                .categoryBreakdown(categoryBreakdown)
                .departmentBreakdown(deptBreakdown)
                .statusBreakdown(statusBreakdown)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    public DashboardStatsResponse getDepartmentDashboardStats(Long departmentId) {
        List<Complaint> deptComplaints = complaintRepository.findByAssignedDepartmentIdOrderByCreatedAtDesc(departmentId);
        long totalComplaints = deptComplaints.size();

        long submitted = deptComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED).count();
        long underReview = deptComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.UNDER_REVIEW).count();
        long resolved = deptComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED).count();
        long closed = deptComplaints.stream().filter(c -> c.getStatus() == ComplaintStatus.CLOSED).count();
        long inProgress = Math.max(0, totalComplaints - (resolved + closed));
        long overdue = deptComplaints.stream().filter(c -> c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED && c.getSlaDeadline() != null && c.getSlaDeadline().isBefore(LocalDateTime.now())).count();
        long critical = deptComplaints.stream().filter(c -> c.getPriority() == Priority.CRITICAL && c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED).count();

        long totalOfficers = userRepository.findByRoleAndDepartmentId(Role.ROLE_OFFICER, departmentId).size();
        long totalCitizens = userRepository.countByRole(Role.ROLE_CITIZEN);
        long totalDepartments = 1;

        Double avgRating = feedbackRepository.getAverageRating();
        double resolutionRate = totalComplaints > 0 ? ((double) (resolved + closed) / totalComplaints) * 100.0 : 100.0;

        // Real Average Resolution Time for Department
        double totalResolutionHours = 0;
        int resolvedCountWithTimestamps = 0;
        for (Complaint c : deptComplaints) {
            if ((c.getStatus() == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED) && c.getCreatedAt() != null) {
                LocalDateTime finishTime = c.getResolvedAt() != null ? c.getResolvedAt() : (c.getClosedAt() != null ? c.getClosedAt() : c.getUpdatedAt());
                if (finishTime != null) {
                    double hours = Math.max(0.1, Duration.between(c.getCreatedAt(), finishTime).toMinutes() / 60.0);
                    totalResolutionHours += hours;
                    resolvedCountWithTimestamps++;
                }
            }
        }
        double realAvgResolutionHours = resolvedCountWithTimestamps > 0 ? Math.round((totalResolutionHours / resolvedCountWithTimestamps) * 10.0) / 10.0 : 0.0;

        // Categories breakdown for department
        List<Object[]> catRows = complaintRepository.countByCategoriesForDepartment(departmentId);
        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Object[] row : catRows) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", row[0] != null ? row[0] : "General");
            item.put("count", row[1]);
            categoryBreakdown.add(item);
        }

        // Department breakdown (just this department)
        String deptName = departmentRepository.findById(departmentId)
                .map(com.smartcity.entity.Department::getName)
                .orElse("Department");
        List<Map<String, Object>> deptBreakdown = new ArrayList<>();
        Map<String, Object> dItem = new HashMap<>();
        dItem.put("department", deptName);
        dItem.put("count", totalComplaints);
        deptBreakdown.add(dItem);

        // Status breakdown for department
        List<Object[]> statusRows = complaintRepository.countByStatusesForDepartment(departmentId);
        List<Map<String, Object>> statusBreakdown = new ArrayList<>();
        for (Object[] row : statusRows) {
            Map<String, Object> item = new HashMap<>();
            item.put("status", row[0].toString());
            item.put("count", row[1]);
            statusBreakdown.add(item);
        }

        // Real Monthly Trends
        List<Map<String, Object>> monthlyTrends = calculateRealMonthlyTrends(deptComplaints);

        return DashboardStatsResponse.builder()
                .totalComplaints(totalComplaints)
                .submittedComplaints(submitted)
                .underReviewComplaints(underReview)
                .inProgressComplaints(inProgress)
                .resolvedComplaints(resolved)
                .closedComplaints(closed)
                .overdueComplaints(overdue)
                .criticalComplaints(critical)
                .resolutionRatePercentage(Math.round(resolutionRate * 10.0) / 10.0)
                .averageResolutionTimeHours(realAvgResolutionHours)
                .averageCitizenRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalOfficers(totalOfficers)
                .totalCitizens(totalCitizens)
                .totalDepartments(totalDepartments)
                .categoryBreakdown(categoryBreakdown)
                .departmentBreakdown(deptBreakdown)
                .statusBreakdown(statusBreakdown)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    private List<Map<String, Object>> calculateRealMonthlyTrends(List<Complaint> list) {
        List<Map<String, Object>> trends = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter monthFmt = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {
            LocalDateTime mStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime mEnd = mStart.plusMonths(1);
            String monthName = mStart.format(monthFmt);

            long reported = list.stream().filter(c -> c.getCreatedAt() != null && !c.getCreatedAt().isBefore(mStart) && c.getCreatedAt().isBefore(mEnd)).count();
            long resolved = list.stream().filter(c -> {
                if (c.getStatus() != ComplaintStatus.RESOLVED && c.getStatus() != ComplaintStatus.CLOSED) return false;
                LocalDateTime finish = c.getResolvedAt() != null ? c.getResolvedAt() : (c.getClosedAt() != null ? c.getClosedAt() : c.getUpdatedAt());
                return finish != null && !finish.isBefore(mStart) && finish.isBefore(mEnd);
            }).count();

            Map<String, Object> monthItem = new HashMap<>();
            monthItem.put("month", monthName);
            monthItem.put("reported", reported);
            monthItem.put("resolved", resolved);
            trends.add(monthItem);
        }
        return trends;
    }

    public List<Map<String, Object>> getMapLocations() {
        List<Complaint> complaints = complaintRepository.findAll();
        return convertComplaintsToMapMarkers(complaints);
    }

    public List<Map<String, Object>> getDepartmentMapLocations(Long departmentId) {
        List<Complaint> complaints = complaintRepository.findByAssignedDepartmentIdOrderByCreatedAtDesc(departmentId);
        return convertComplaintsToMapMarkers(complaints);
    }

    private List<Map<String, Object>> convertComplaintsToMapMarkers(List<Complaint> complaints) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Complaint c : complaints) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("complaintNumber", c.getComplaintNumber());
            map.put("title", c.getTitle());
            map.put("category", c.getCategory() != null ? c.getCategory().getName() : "General");
            map.put("categoryCode", c.getCategory() != null ? c.getCategory().getCode() : "ROADS");
            map.put("priority", c.getPriority().name());
            map.put("status", c.getStatus().name());
            map.put("address", c.getAddress());

            boolean hasExactCoordinates = c.getLatitude() != null && c.getLongitude() != null;
            map.put("latitude", hasExactCoordinates ? c.getLatitude() : 12.9716);
            map.put("longitude", hasExactCoordinates ? c.getLongitude() : 77.5946);
            map.put("isApproximateLocation", !hasExactCoordinates);
            map.put("locationType", hasExactCoordinates ? "EXACT_GPS" : "APPROXIMATE_MUNICIPALITY_AREA");

            map.put("imageUrl", c.getImageUrl());
            map.put("departmentName", c.getAssignedDepartment() != null ? c.getAssignedDepartment().getName() : "Unassigned");
            map.put("createdAt", c.getCreatedAt());
            list.add(map);
        }
        return list;
    }
}
