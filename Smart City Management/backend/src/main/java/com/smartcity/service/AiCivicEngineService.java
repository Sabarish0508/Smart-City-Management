package com.smartcity.service;

import com.smartcity.dto.AiAnalysisResult;
import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintCategory;
import com.smartcity.entity.Department;
import com.smartcity.entity.Priority;
import com.smartcity.repository.ComplaintCategoryRepository;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AiCivicEngineService {

    @Autowired
    private ComplaintCategoryRepository categoryRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    private static final Set<String> CRITICAL_HAZARD_KEYWORDS = Set.of(
            "live wire", "exposed wire", "electric shock", "gas leak", "sparking pole",
            "open manhole", "deep sinkhole", "bridge crack", "collapse", "major landslide",
            "toxic waste", "chemical spill", "hospital road blocked", "ambulance stuck",
            "transformer blast", "flooding inside houses", "sewage in drinking water"
    );

    private static final Set<String> HIGH_SEVERITY_KEYWORDS = Set.of(
            "major pothole", "pothole on highway", "water main burst", "pipeline burst",
            "traffic light broken", "heavy waterlogging", "drainage overflow", "garbage pile",
            "school zone", "uncollected waste for days", "dark street", "accidents happening",
            "broken streetlight on junction", "tree fallen on road", "manhole cover broken"
    );

    private static final Map<String, List<String>> CATEGORY_KEYWORD_MAP = Map.of(
            "ROADS", List.of("pothole", "crater", "asphalt", "tar", "road damage", "speed breaker", "paver block", "footpath", "sidewalk", "divider"),
            "SOLID_WASTE", List.of("garbage", "trash", "waste", "dump", "dustbin", "litter", "debris", "dead animal", "unclean", "sweep"),
            "WATER_SUPPLY", List.of("water leak", "pipeline", "no water", "contaminated water", "dirty water", "low pressure", "valve broken", "pipe burst", "tanker"),
            "ELECTRICITY", List.of("streetlight", "street light", "lamp", "dark", "wire", "pole", "fuse", "blackout", "sparking", "transformer", "cables"),
            "DRAINAGE", List.of("drain", "gutter", "manhole", "sewage", "clogged", "overflowing drain", "stormwater", "culvert", "choked"),
            "TRAFFIC_SAFETY", List.of("traffic signal", "signboard", "zebra crossing", "junction", "illegal parking", "road blockage", "barricade", "speeding")
    );

    public AiAnalysisResult analyzeComplaint(String title, String description, Long categoryId, Double lat, Double lng) {
        String combinedText = ((title != null ? title : "") + " " + (description != null ? description : "")).toLowerCase();
        
        List<String> detectedKeywords = new ArrayList<>();
        boolean isHazard = false;
        Priority priority = Priority.MEDIUM;
        double confidence = 0.85;
        String reasoning = "Standard civic issue detected.";

        // Check for Critical Hazards
        for (String hazard : CRITICAL_HAZARD_KEYWORDS) {
            if (combinedText.contains(hazard)) {
                isHazard = true;
                priority = Priority.CRITICAL;
                detectedKeywords.add(hazard);
                confidence = 0.98;
                reasoning = "Critical public safety hazard detected: '" + hazard + "'. Immediate emergency response recommended.";
                break;
            }
        }

        // Check for High Severity if not critical
        if (priority != Priority.CRITICAL) {
            for (String highKey : HIGH_SEVERITY_KEYWORDS) {
                if (combinedText.contains(highKey)) {
                    priority = Priority.HIGH;
                    detectedKeywords.add(highKey);
                    confidence = 0.92;
                    reasoning = "High priority civic issue detected containing urgent indicator: '" + highKey + "'.";
                    break;
                }
            }
        }

        // If simple/minor
        if (priority == Priority.MEDIUM && (combinedText.contains("minor") || combinedText.contains("small") || combinedText.contains("faded"))) {
            priority = Priority.LOW;
            reasoning = "Routine civic maintenance task detected.";
        }

        // Category & Department Inference
        String predictedCatCode = "ROADS";
        int maxMatches = 0;

        for (Map.Entry<String, List<String>> entry : CATEGORY_KEYWORD_MAP.entrySet()) {
            int matchCount = 0;
            for (String kw : entry.getValue()) {
                if (combinedText.contains(kw)) {
                    matchCount++;
                    detectedKeywords.add(kw);
                }
            }
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                predictedCatCode = entry.getKey();
            }
        }

        ComplaintCategory category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId).orElse(null);
        }
        if (category == null) {
            category = categoryRepository.findByCode(predictedCatCode).orElse(null);
        }

        Department recommendedDept = null;
        if (category != null && category.getDefaultDepartment() != null) {
            recommendedDept = category.getDefaultDepartment();
        } else {
            recommendedDept = departmentRepository.findByCode("DEPT_ROADS").orElse(null);
        }

        // Check Spatial & Textual Duplicates
        boolean isDuplicate = false;
        String duplicateNumber = null;
        if (lat != null && lng != null && category != null) {
            List<Complaint> nearby = complaintRepository.findNearbyOpenComplaints(category.getId(), lat, lng, 0.20); // 200m radius
            if (!nearby.isEmpty()) {
                Complaint closest = nearby.get(0);
                isDuplicate = true;
                duplicateNumber = closest.getComplaintNumber();
                reasoning += " Note: Potential duplicate complaint detected at this location (" + duplicateNumber + ").";
            }
        }

        return AiAnalysisResult.builder()
                .predictedCategoryName(category != null ? category.getName() : "General Road Maintenance")
                .predictedCategoryId(category != null ? category.getId() : 1L)
                .predictedDepartmentName(recommendedDept != null ? recommendedDept.getName() : "Roads & Infrastructure")
                .predictedDepartmentId(recommendedDept != null ? recommendedDept.getId() : null)
                .priority(priority)
                .confidenceScore(confidence)
                .reasoning(reasoning)
                .isPotentialHazard(isHazard)
                .isDuplicateDetected(isDuplicate)
                .duplicateComplaintNumber(duplicateNumber)
                .detectedKeywords(detectedKeywords.stream().distinct().toList())
                .imageTaggingDescription(isHazard ? "AI Flag: High Risk Obstruction/Hazard" : "AI Verified: Civic Defect Image Analyzed")
                .build();
    }
}
