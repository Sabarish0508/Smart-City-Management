package com.smartcity.controller;

import com.smartcity.dto.AiAnalysisResult;
import com.smartcity.service.AiCivicEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiCivicEngineService aiCivicEngineService;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResult> analyzeCivicIssue(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        Long categoryId = payload.get("categoryId") != null ? Long.valueOf(payload.get("categoryId").toString()) : null;
        Double latitude = payload.get("latitude") != null ? Double.valueOf(payload.get("latitude").toString()) : null;
        Double longitude = payload.get("longitude") != null ? Double.valueOf(payload.get("longitude").toString()) : null;

        AiAnalysisResult result = aiCivicEngineService.analyzeComplaint(title, description, categoryId, latitude, longitude);
        return ResponseEntity.ok(result);
    }
}
