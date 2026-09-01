package com.smartcity.dto;

import com.smartcity.entity.Priority;
import java.util.List;

public class AiAnalysisResult {
    private String predictedCategoryName;
    private Long predictedCategoryId;
    private String predictedDepartmentName;
    private Long predictedDepartmentId;
    private Priority priority;
    private Double confidenceScore;
    private String reasoning;
    private Boolean isPotentialHazard;
    private Boolean isDuplicateDetected;
    private String duplicateComplaintNumber;
    private List<String> detectedKeywords;
    private String imageTaggingDescription;

    public AiAnalysisResult() {}

    public AiAnalysisResult(String predictedCategoryName, Long predictedCategoryId, String predictedDepartmentName, Long predictedDepartmentId, Priority priority, Double confidenceScore, String reasoning, Boolean isPotentialHazard, Boolean isDuplicateDetected, String duplicateComplaintNumber, List<String> detectedKeywords, String imageTaggingDescription) {
        this.predictedCategoryName = predictedCategoryName;
        this.predictedCategoryId = predictedCategoryId;
        this.predictedDepartmentName = predictedDepartmentName;
        this.predictedDepartmentId = predictedDepartmentId;
        this.priority = priority;
        this.confidenceScore = confidenceScore;
        this.reasoning = reasoning;
        this.isPotentialHazard = isPotentialHazard;
        this.isDuplicateDetected = isDuplicateDetected;
        this.duplicateComplaintNumber = duplicateComplaintNumber;
        this.detectedKeywords = detectedKeywords;
        this.imageTaggingDescription = imageTaggingDescription;
    }

    public static class Builder {
        private String predictedCategoryName;
        private Long predictedCategoryId;
        private String predictedDepartmentName;
        private Long predictedDepartmentId;
        private Priority priority;
        private Double confidenceScore;
        private String reasoning;
        private Boolean isPotentialHazard;
        private Boolean isDuplicateDetected;
        private String duplicateComplaintNumber;
        private List<String> detectedKeywords;
        private String imageTaggingDescription;

        public Builder predictedCategoryName(String predictedCategoryName) { this.predictedCategoryName = predictedCategoryName; return this; }
        public Builder predictedCategoryId(Long predictedCategoryId) { this.predictedCategoryId = predictedCategoryId; return this; }
        public Builder predictedDepartmentName(String predictedDepartmentName) { this.predictedDepartmentName = predictedDepartmentName; return this; }
        public Builder predictedDepartmentId(Long predictedDepartmentId) { this.predictedDepartmentId = predictedDepartmentId; return this; }
        public Builder priority(Priority priority) { this.priority = priority; return this; }
        public Builder confidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; return this; }
        public Builder reasoning(String reasoning) { this.reasoning = reasoning; return this; }
        public Builder isPotentialHazard(Boolean isPotentialHazard) { this.isPotentialHazard = isPotentialHazard; return this; }
        public Builder isDuplicateDetected(Boolean isDuplicateDetected) { this.isDuplicateDetected = isDuplicateDetected; return this; }
        public Builder duplicateComplaintNumber(String duplicateComplaintNumber) { this.duplicateComplaintNumber = duplicateComplaintNumber; return this; }
        public Builder detectedKeywords(List<String> detectedKeywords) { this.detectedKeywords = detectedKeywords; return this; }
        public Builder imageTaggingDescription(String imageTaggingDescription) { this.imageTaggingDescription = imageTaggingDescription; return this; }

        public AiAnalysisResult build() {
            return new AiAnalysisResult(predictedCategoryName, predictedCategoryId, predictedDepartmentName, predictedDepartmentId, priority, confidenceScore, reasoning, isPotentialHazard, isDuplicateDetected, duplicateComplaintNumber, detectedKeywords, imageTaggingDescription);
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public String getPredictedCategoryName() { return predictedCategoryName; }
    public void setPredictedCategoryName(String predictedCategoryName) { this.predictedCategoryName = predictedCategoryName; }

    public Long getPredictedCategoryId() { return predictedCategoryId; }
    public void setPredictedCategoryId(Long predictedCategoryId) { this.predictedCategoryId = predictedCategoryId; }

    public String getPredictedDepartmentName() { return predictedDepartmentName; }
    public void setPredictedDepartmentName(String predictedDepartmentName) { this.predictedDepartmentName = predictedDepartmentName; }

    public Long getPredictedDepartmentId() { return predictedDepartmentId; }
    public void setPredictedDepartmentId(Long predictedDepartmentId) { this.predictedDepartmentId = predictedDepartmentId; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }

    public Boolean getIsPotentialHazard() { return isPotentialHazard; }
    public void setIsPotentialHazard(Boolean isPotentialHazard) { this.isPotentialHazard = isPotentialHazard; }

    public Boolean getIsDuplicateDetected() { return isDuplicateDetected; }
    public void setIsDuplicateDetected(Boolean isDuplicateDetected) { this.isDuplicateDetected = isDuplicateDetected; }

    public String getDuplicateComplaintNumber() { return duplicateComplaintNumber; }
    public void setDuplicateComplaintNumber(String duplicateComplaintNumber) { this.duplicateComplaintNumber = duplicateComplaintNumber; }

    public List<String> getDetectedKeywords() { return detectedKeywords; }
    public void setDetectedKeywords(List<String> detectedKeywords) { this.detectedKeywords = detectedKeywords; }

    public String getImageTaggingDescription() { return imageTaggingDescription; }
    public void setImageTaggingDescription(String imageTaggingDescription) { this.imageTaggingDescription = imageTaggingDescription; }
}
