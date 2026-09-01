package com.smartcity.service;

import com.smartcity.dto.FeedbackRequest;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintFeedback;
import com.smartcity.entity.ComplaintStatus;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintFeedbackRepository;
import com.smartcity.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {

    @Autowired
    private ComplaintFeedbackRepository feedbackRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public ComplaintFeedback submitFeedback(Long complaintId, FeedbackRequest request, User citizen) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with ID: " + complaintId));

        if (!complaint.getCitizen().getId().equals(citizen.getId())) {
            throw new BadRequestException("You can only submit feedback for complaints you reported.");
        }

        if (complaint.getStatus() != ComplaintStatus.RESOLVED && complaint.getStatus() != ComplaintStatus.CLOSED) {
            throw new BadRequestException("Feedback can only be submitted after the issue is resolved.");
        }

        if (feedbackRepository.findByComplaintId(complaintId).isPresent()) {
            throw new BadRequestException("Feedback has already been submitted for this complaint.");
        }

        ComplaintFeedback feedback = ComplaintFeedback.builder()
                .complaint(complaint)
                .citizen(citizen)
                .rating(request.getRating())
                .comments(request.getComments())
                .isSatisfied(request.getIsSatisfied() != null ? request.getIsSatisfied() : request.getRating() >= 3)
                .build();

        ComplaintFeedback saved = feedbackRepository.save(feedback);
        
        // Link to complaint and persist bidirectional relationship
        complaint.setFeedback(saved);
        complaintRepository.save(complaint);

        // Notify assigned officer if present
        if (complaint.getAssignedOfficer() != null) {
            notificationService.createNotification(
                    complaint.getAssignedOfficer(),
                    "Citizen Feedback Received",
                    "Citizen rated complaint " + complaint.getComplaintNumber() + " with " + request.getRating() + " stars.",
                    "FEEDBACK_RECEIVED",
                    complaint.getId(),
                    complaint.getComplaintNumber()
            );
        }

        return saved;
    }

    public ComplaintFeedback getFeedbackByComplaintId(Long complaintId) {
        return feedbackRepository.findByComplaintId(complaintId).orElse(null);
    }

    public List<ComplaintFeedback> getFeedbackByDepartment(Long departmentId) {
        return feedbackRepository.findByDepartmentIdOrderByCreatedAtDesc(departmentId);
    }

    public List<ComplaintFeedback> getFeedbackByOfficer(Long officerId) {
        return feedbackRepository.findByOfficerIdOrderByCreatedAtDesc(officerId);
    }

    public List<ComplaintFeedback> getAllFeedback() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc();
    }

    public Map<String, Object> getFeedbackAnalytics() {
        Double avgRating = feedbackRepository.getAverageRating();
        long satisfiedCount = feedbackRepository.countSatisfiedFeedback();
        long totalFeedback = feedbackRepository.count();
        List<Object[]> breakdown = feedbackRepository.getRatingBreakdown();

        Map<String, Object> result = new HashMap<>();
        result.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        result.put("totalFeedback", totalFeedback);
        result.put("satisfiedPercentage", totalFeedback > 0 ? Math.round(((double) satisfiedCount / totalFeedback) * 100.0) : 100);
        result.put("starBreakdown", breakdown);

        return result;
    }
}
