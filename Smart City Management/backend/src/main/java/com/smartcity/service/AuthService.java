package com.smartcity.service;

import com.smartcity.dto.*;
import com.smartcity.entity.Department;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.DepartmentRepository;
import com.smartcity.repository.UserRepository;
import com.smartcity.security.CustomUserDetails;
import com.smartcity.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public AuthResponse registerCitizen(CitizenRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User citizen = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber().trim())
                .role(Role.ROLE_CITIZEN)
                .address(request.getAddress().trim())
                .municipality(request.getMunicipality().trim())
                .ward(request.getWard() != null && !request.getWard().isBlank() ? request.getWard().trim() : null)
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .isActive(true)
                .build();

        User savedUser = userRepository.save(citizen);

        // Send Welcome Notification
        notificationService.createNotification(
                savedUser,
                "Welcome to Smart Civic Portal",
                "Your citizen account has been successfully registered. You can now report civic issues, track real-time resolution, and help improve our city.",
                "SYSTEM_ALERT",
                null,
                null
        );

        // Auto authenticate and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return buildAuthResponse(savedUser, token);
    }

    @Transactional
    public AuthResponse registerOfficial(OfficialRegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and Confirm Password do not match");
        }

        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this official email already exists: " + email);
        }

        // Official Email Domain Validation
        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_OFFICER;

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        } else if (assignedRole == Role.ROLE_HEAD) {
            throw new BadRequestException("Department selection is required for Department Head registration.");
        }

        // 1. Department Head Email Format: username.departmentname@gov.in
        if (assignedRole == Role.ROLE_HEAD) {
            if (department == null) {
                throw new BadRequestException("Department Head must be assigned to an official department.");
            }
            if (!email.endsWith("@gov.in")) {
                throw new BadRequestException("Department Head email must use official government domain (@gov.in), e.g. username.departmentname@gov.in");
            }
            
            String deptCode = department.getCode() != null ? department.getCode().toLowerCase() : "";
            String deptName = department.getName() != null ? department.getName().toLowerCase() : "";

            boolean matchesDept = false;
            if ((deptCode.contains("road") || deptName.contains("road")) && (email.contains(".roads@") || email.contains(".road@") || email.contains(".infra@"))) {
                matchesDept = true;
            } else if ((deptCode.contains("waste") || deptName.contains("waste") || deptName.contains("sanitat")) && (email.contains(".waste@") || email.contains(".sanitation@") || email.contains(".sanitat@"))) {
                matchesDept = true;
            } else if ((deptCode.contains("water") || deptName.contains("water")) && (email.contains(".water@") || email.contains(".sewerage@"))) {
                matchesDept = true;
            } else if ((deptCode.contains("electr") || deptName.contains("electr") || deptName.contains("light")) && (email.contains(".electricity@") || email.contains(".electric@") || email.contains(".lighting@"))) {
                matchesDept = true;
            } else if ((deptCode.contains("drain") || deptName.contains("drain")) && (email.contains(".drainage@") || email.contains(".drain@"))) {
                matchesDept = true;
            } else if ((deptCode.contains("traffic") || deptName.contains("traffic")) && (email.contains(".traffic@") || email.contains(".safety@"))) {
                matchesDept = true;
            } else {
                String normalizedDept = deptName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                if (email.contains("." + normalizedDept + "@")) {
                    matchesDept = true;
                }
            }

            if (!matchesDept) {
                String expectedKey = deptName.contains("road") ? "roads" : deptName.contains("waste") || deptName.contains("sanitat") ? "waste" : deptName.contains("water") ? "water" : deptName.contains("electr") ? "electricity" : deptName.contains("drain") ? "drainage" : deptName.contains("traffic") ? "traffic" : "departmentname";
                throw new BadRequestException("Department Head email must match the assigned department convention: username." + expectedKey + "@gov.in (e.g. rajkumar.roads@gov.in).");
            }
        }

        // 2. Central Administration Email Format: username@central.gov.in
        if (assignedRole == Role.ROLE_ADMIN) {
            if (!email.endsWith("@central.gov.in")) {
                throw new BadRequestException("Central Administration email must use the official executive domain (@central.gov.in), e.g. commissioner@central.gov.in");
            }
        }

        // 3. Municipal Official Email Format: username@municipality.gov.in
        if (assignedRole == Role.ROLE_OFFICER) {
            if (!email.endsWith("@municipality.gov.in")) {
                throw new BadRequestException("Municipal Official email must end with @municipality.gov.in (e.g. rajkumar@municipality.gov.in, alok@municipality.gov.in).");
            }
        }

        String cleanPhone = null;
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            cleanPhone = request.getPhoneNumber().replaceAll("[^0-9+]", "").trim();
            if (cleanPhone.length() > 20) {
                cleanPhone = cleanPhone.substring(0, 20);
            }
        }

        User official = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(cleanPhone)
                .role(assignedRole)
                .designation(request.getDesignation() != null && !request.getDesignation().isBlank() 
                        ? request.getDesignation().trim() 
                        : (assignedRole == Role.ROLE_ADMIN ? "Municipal Administrator" : (assignedRole == Role.ROLE_HEAD ? "Department Head" : "Field Engineer")))
                .department(department)
                .municipality(request.getMunicipality() != null ? request.getMunicipality().trim() : "Central City Municipal Corporation")
                .ward(request.getWard() != null && !request.getWard().isBlank() ? request.getWard().trim() : null)
                .city(request.getCity() != null ? request.getCity().trim() : "Metro City")
                .state(request.getState() != null ? request.getState().trim() : "Karnataka")
                .isActive(true)
                .build();

        User savedOfficial = userRepository.save(official);

        // Send Welcome Notification
        notificationService.createNotification(
                savedOfficial,
                "Welcome to Municipal Command Network",
                "Your official personnel account has been authorized. You can now manage assigned field tasks, resolve issues, and monitor SLA compliance.",
                "SYSTEM_ALERT",
                null,
                null
        );

        // Auto authenticate and generate token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return buildAuthResponse(savedOfficial, token);
    }

    public AuthResponse loginCitizen(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        if (user.getRole() != Role.ROLE_CITIZEN) {
            throw new BadRequestException("This login is strictly for citizens. Municipal officials must use the Official Portal.");
        }

        String token = tokenProvider.generateToken(authentication);
        return buildAuthResponse(user, token);
    }

    public AuthResponse loginOfficial(AuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String requestedRoleStr = request.getRole();

        // 1. Role-specific preliminary domain validation if role is specified
        if (requestedRoleStr != null && !requestedRoleStr.isBlank()) {
            if ("ROLE_OFFICER".equalsIgnoreCase(requestedRoleStr) || "official".equalsIgnoreCase(requestedRoleStr)) {
                if (!email.endsWith("@municipality.gov.in")) {
                    throw new BadRequestException("Municipal Official email must use the official domain (@municipality.gov.in).");
                }
            } else if ("ROLE_HEAD".equalsIgnoreCase(requestedRoleStr) || "head".equalsIgnoreCase(requestedRoleStr)) {
                if (!email.endsWith("@gov.in") || !email.contains(".")) {
                    throw new BadRequestException("Department Head email must follow username.departmentname@gov.in.");
                }
            } else if ("ROLE_ADMIN".equalsIgnoreCase(requestedRoleStr) || "admin".equalsIgnoreCase(requestedRoleStr)) {
                if (!email.endsWith("@central.gov.in")) {
                    throw new BadRequestException("Central Administration email must use the official domain (@central.gov.in).");
                }
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Enforce DB-level role authorization
        if (user.getRole() == Role.ROLE_CITIZEN) {
            throw new BadRequestException("Citizen accounts cannot access the Official Municipal Portal. Please use the Citizen Login.");
        }

        // 2. Validate user role matches the requested portal role
        if (requestedRoleStr != null && !requestedRoleStr.isBlank()) {
            if (("ROLE_OFFICER".equalsIgnoreCase(requestedRoleStr) || "official".equalsIgnoreCase(requestedRoleStr)) && user.getRole() != Role.ROLE_OFFICER) {
                throw new BadRequestException("This account is not authorized as a Municipal Official.");
            }
            if (("ROLE_HEAD".equalsIgnoreCase(requestedRoleStr) || "head".equalsIgnoreCase(requestedRoleStr)) && user.getRole() != Role.ROLE_HEAD) {
                throw new BadRequestException("This account is not authorized as a Department Head.");
            }
            if (("ROLE_ADMIN".equalsIgnoreCase(requestedRoleStr) || "admin".equalsIgnoreCase(requestedRoleStr)) && user.getRole() != Role.ROLE_ADMIN) {
                throw new BadRequestException("This account is not authorized for Central Administration.");
            }
        }

        // 3. Strict Domain Validations per Stored Role
        if (user.getRole() == Role.ROLE_ADMIN) {
            if (!email.endsWith("@central.gov.in")) {
                throw new BadRequestException("Central Administration email must use the official domain (@central.gov.in).");
            }
        } else if (user.getRole() == Role.ROLE_HEAD) {
            if (!email.endsWith("@gov.in")) {
                throw new BadRequestException("Department Head email must follow username.departmentname@gov.in.");
            }
            Department dept = user.getDepartment();
            if (dept != null) {
                String deptCode = dept.getCode() != null ? dept.getCode().toLowerCase() : "";
                String deptName = dept.getName() != null ? dept.getName().toLowerCase() : "";
                boolean matchesDept = false;
                if ((deptCode.contains("road") || deptName.contains("road")) && (email.contains(".roads@") || email.contains(".road@") || email.contains(".infra@"))) {
                    matchesDept = true;
                } else if ((deptCode.contains("waste") || deptName.contains("waste") || deptName.contains("sanitat")) && (email.contains(".waste@") || email.contains(".sanitation@") || email.contains(".sanitat@"))) {
                    matchesDept = true;
                } else if ((deptCode.contains("water") || deptName.contains("water")) && (email.contains(".water@") || email.contains(".sewerage@"))) {
                    matchesDept = true;
                } else if ((deptCode.contains("electr") || deptName.contains("electr") || deptName.contains("light")) && (email.contains(".electricity@") || email.contains(".electric@") || email.contains(".lighting@"))) {
                    matchesDept = true;
                } else if ((deptCode.contains("drain") || deptName.contains("drain")) && (email.contains(".drainage@") || email.contains(".drain@"))) {
                    matchesDept = true;
                } else if ((deptCode.contains("traffic") || deptName.contains("traffic")) && (email.contains(".traffic@") || email.contains(".safety@"))) {
                    matchesDept = true;
                } else {
                    String normalizedDept = deptName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
                    if (email.contains("." + normalizedDept + "@")) {
                        matchesDept = true;
                    }
                }
                if (!matchesDept) {
                    throw new BadRequestException("Department Head email does not match your assigned department (" + dept.getName() + ").");
                }
            }
        } else if (user.getRole() == Role.ROLE_OFFICER) {
            if (!email.endsWith("@municipality.gov.in")) {
                throw new BadRequestException("Municipal Official email must use the official domain (@municipality.gov.in).");
            }
        }

        String token = tokenProvider.generateToken(authentication);
        return buildAuthResponse(user, token);
    }

    public AuthResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        return buildAuthResponse(user, null);
    }

    @Transactional
    public AuthResponse updateUserProfile(String email, UserProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress().trim());
        }
        if (request.getMunicipality() != null) {
            user.setMunicipality(request.getMunicipality().trim());
        }
        if (request.getWard() != null) {
            user.setWard(request.getWard().trim());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity().trim());
        }
        if (request.getState() != null) {
            user.setState(request.getState().trim());
        }
        if (request.getDesignation() != null) {
            user.setDesignation(request.getDesignation().trim());
        }

        User saved = userRepository.save(user);
        return buildAuthResponse(saved, null);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .designation(user.getDesignation())
                .address(user.getAddress())
                .municipality(user.getMunicipality())
                .ward(user.getWard())
                .city(user.getCity())
                .state(user.getState())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
