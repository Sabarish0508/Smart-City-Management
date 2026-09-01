package com.smartcity.service;

import com.smartcity.entity.Department;
import com.smartcity.entity.Role;
import com.smartcity.exception.BadRequestException;
import com.smartcity.exception.ResourceNotFoundException;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.DepartmentRepository;
import com.smartcity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<Department> getAllActiveDepartments() {
        return departmentRepository.findByIsActiveTrue();
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
    }

    public Department createDepartment(Department department) {
        if (departmentRepository.existsByCode(department.getCode())) {
            throw new BadRequestException("Department code already exists: " + department.getCode());
        }
        if (departmentRepository.existsByName(department.getName())) {
            throw new BadRequestException("Department name already exists: " + department.getName());
        }
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updated) {
        Department existing = getDepartmentById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setContactEmail(updated.getContactEmail());
        existing.setContactPhone(updated.getContactPhone());
        existing.setHeadOfficerName(updated.getHeadOfficerName());
        if (updated.getSlaHours() != null) {
            existing.setSlaHours(updated.getSlaHours());
        }
        if (updated.getIsActive() != null) {
            existing.setIsActive(updated.getIsActive());
        }
        return departmentRepository.save(existing);
    }

    public void deleteDepartment(Long id) {
        Department dept = getDepartmentById(id);
        dept.setIsActive(false);
        departmentRepository.save(dept);
    }

    public List<Map<String, Object>> getDepartmentSummaryWithStats() {
        List<Department> departments = departmentRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Department d : departments) {
            long officerCount = userRepository.findByRoleAndDepartmentId(Role.ROLE_OFFICER, d.getId()).size();
            long complaintCount = complaintRepository.countByAssignedDepartmentId(d.getId());

            Map<String, Object> map = new HashMap<>();
            map.put("id", d.getId());
            map.put("name", d.getName());
            map.put("code", d.getCode());
            map.put("description", d.getDescription());
            map.put("contactEmail", d.getContactEmail());
            map.put("contactPhone", d.getContactPhone());
            map.put("headOfficerName", d.getHeadOfficerName());
            map.put("slaHours", d.getSlaHours());
            map.put("isActive", d.getIsActive());
            map.put("officerCount", officerCount);
            map.put("complaintCount", complaintCount);
            result.add(map);
        }
        return result;
    }
}
