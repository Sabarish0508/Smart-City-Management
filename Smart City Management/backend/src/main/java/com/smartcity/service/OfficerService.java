package com.smartcity.service;

import com.smartcity.dto.OfficialCreateRequest;
import com.smartcity.entity.Department;
import com.smartcity.entity.Role;
import com.smartcity.entity.User;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.DepartmentRepository;
import com.smartcity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OfficerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllOfficers() {
        return userRepository.findByRole(Role.ROLE_OFFICER);
    }

    public List<User> getOfficersByDepartment(Long departmentId) {
        return userRepository.findByRoleAndDepartmentId(Role.ROLE_OFFICER, departmentId);
    }

    public List<User> getAllOfficials() {
        List<User> list = new ArrayList<>();
        list.addAll(userRepository.findByRole(Role.ROLE_HEAD));
        list.addAll(userRepository.findByRole(Role.ROLE_OFFICER));
        list.addAll(userRepository.findByRole(Role.ROLE_ADMIN));
        return list;
    }

    public User createOfficialAccount(OfficialCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with this email already exists: " + request.getEmail());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }

        User official = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_OFFICER)
                .designation(request.getDesignation())
                .department(department)
                .municipality(request.getMunicipality())
                .isActive(true)
                .build();

        return userRepository.save(official);
    }

    public List<Map<String, Object>> getOfficersWorkload() {
        return getOfficersWorkload(null);
    }

    public List<Map<String, Object>> getOfficersWorkload(Long departmentId) {
        List<User> officers;
        if (departmentId != null) {
            officers = userRepository.findByRoleAndDepartmentId(Role.ROLE_OFFICER, departmentId);
        } else {
            officers = userRepository.findByRole(Role.ROLE_OFFICER);
        }
        List<Map<String, Object>> result = new ArrayList<>();

        for (User officer : officers) {
            long totalAssigned = complaintRepository.countByAssignedOfficerId(officer.getId());
            long inProgress = complaintRepository.countByAssignedOfficerIdAndStatus(officer.getId(), com.smartcity.entity.ComplaintStatus.IN_PROGRESS);
            long assigned = complaintRepository.countByAssignedOfficerIdAndStatus(officer.getId(), com.smartcity.entity.ComplaintStatus.ASSIGNED);
            long resolved = complaintRepository.countByAssignedOfficerIdAndStatus(officer.getId(), com.smartcity.entity.ComplaintStatus.RESOLVED);
            long closed = complaintRepository.countByAssignedOfficerIdAndStatus(officer.getId(), com.smartcity.entity.ComplaintStatus.CLOSED);
            long activeTasks = inProgress + assigned;

            Map<String, Object> map = new HashMap<>();
            map.put("id", officer.getId());
            map.put("fullName", officer.getFullName());
            map.put("email", officer.getEmail());
            map.put("phoneNumber", officer.getPhoneNumber());
            map.put("designation", officer.getDesignation());
            map.put("departmentName", officer.getDepartment() != null ? officer.getDepartment().getName() : "Unassigned");
            map.put("departmentId", officer.getDepartment() != null ? officer.getDepartment().getId() : null);
            map.put("totalAssigned", totalAssigned);
            map.put("inProgress", inProgress);
            map.put("assigned", assigned);
            map.put("activeTasks", activeTasks);
            map.put("resolved", resolved);
            map.put("closed", closed);
            result.add(map);
        }

        return result;
    }
}
