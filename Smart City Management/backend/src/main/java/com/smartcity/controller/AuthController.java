package com.smartcity.controller;

import com.smartcity.dto.*;
import com.smartcity.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerCitizen(@Valid @RequestBody CitizenRegisterRequest request) {
        AuthResponse response = authService.registerCitizen(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register-official")
    public ResponseEntity<AuthResponse> registerOfficial(@Valid @RequestBody OfficialRegisterRequest request) {
        AuthResponse response = authService.registerOfficial(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginCitizen(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginCitizen(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/official-login")
    public ResponseEntity<AuthResponse> loginOfficial(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginOfficial(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse response = authService.getCurrentUserProfile(authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @Valid @RequestBody UserProfileUpdateRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse response = authService.updateUserProfile(authentication.getName(), request);
        return ResponseEntity.ok(response);
    }
}
