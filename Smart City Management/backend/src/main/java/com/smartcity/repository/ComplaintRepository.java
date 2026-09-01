package com.smartcity.repository;

import com.smartcity.entity.Complaint;
import com.smartcity.entity.ComplaintStatus;
import com.smartcity.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    Page<Complaint> findByCitizenId(Long citizenId, Pageable pageable);

    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(Long officerId);

    List<Complaint> findByAssignedDepartmentIdOrderByCreatedAtDesc(Long departmentId);

    List<Complaint> findByStatus(ComplaintStatus status);

    List<Complaint> findByPriority(Priority priority);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:municipality IS NULL OR :municipality = '' OR LOWER(c.municipality) LIKE LOWER(CONCAT('%', :municipality, '%')) OR LOWER(:municipality) LIKE LOWER(CONCAT('%', c.municipality, '%'))) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:deptId IS NULL OR c.assignedDepartment.id = :deptId) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:officerId IS NULL OR c.assignedOfficer.id = :officerId) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.address) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> filterComplaints(
            @Param("municipality") String municipality,
            @Param("status") ComplaintStatus status,
            @Param("priority") Priority priority,
            @Param("deptId") Long deptId,
            @Param("categoryId") Long categoryId,
            @Param("officerId") Long officerId,
            @Param("search") String search
    );

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED') AND c.slaDeadline < :now AND (c.isEscalated IS NULL OR c.isEscalated = false)")
    List<Complaint> findUnescalatedOverdueComplaints(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Complaint c WHERE " +
           "c.citizen.id = :citizenId AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    List<Complaint> filterCitizenComplaints(
            @Param("citizenId") Long citizenId,
            @Param("status") ComplaintStatus status,
            @Param("search") String search
    );

    long countByStatus(ComplaintStatus status);

    long countByPriority(Priority priority);

    long countByCitizenId(Long citizenId);

    long countByCitizenIdAndStatus(Long citizenId, ComplaintStatus status);

    long countByAssignedOfficerIdAndStatus(Long officerId, ComplaintStatus status);

    long countByAssignedOfficerId(Long officerId);

    long countByAssignedDepartmentId(Long departmentId);

    long countByAssignedDepartmentIdAndStatus(Long departmentId, ComplaintStatus status);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED') AND c.slaDeadline < :now")
    long countOverdueComplaints(@Param("now") LocalDateTime now);

    @Query("SELECT c.category.name, COUNT(c) FROM Complaint c GROUP BY c.category.name")
    List<Object[]> countByCategories();

    @Query("SELECT c.assignedDepartment.name, COUNT(c) FROM Complaint c WHERE c.assignedDepartment IS NOT NULL GROUP BY c.assignedDepartment.name")
    List<Object[]> countByDepartments();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countByStatuses();

    long countByAssignedDepartmentIdAndPriority(Long departmentId, Priority priority);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.assignedDepartment.id = :deptId AND c.status NOT IN ('RESOLVED', 'CLOSED') AND c.slaDeadline < :now")
    long countOverdueComplaintsByDepartment(@Param("deptId") Long deptId, @Param("now") LocalDateTime now);

    @Query("SELECT c.category.name, COUNT(c) FROM Complaint c WHERE c.assignedDepartment.id = :deptId GROUP BY c.category.name")
    List<Object[]> countByCategoriesForDepartment(@Param("deptId") Long deptId);

    @Query("SELECT c.status, COUNT(c) FROM Complaint c WHERE c.assignedDepartment.id = :deptId GROUP BY c.status")
    List<Object[]> countByStatusesForDepartment(@Param("deptId") Long deptId);

    @Query("SELECT c FROM Complaint c WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL")
    List<Complaint> findAllWithCoordinates();

    @Query("SELECT c FROM Complaint c WHERE c.assignedDepartment.id = :deptId AND c.latitude IS NOT NULL AND c.longitude IS NOT NULL")
    List<Complaint> findWithCoordinatesByDepartmentId(@Param("deptId") Long deptId);

    @Query(value = "SELECT * FROM complaints c WHERE " +
           "c.category_id = :categoryId AND " +
           "c.status NOT IN ('RESOLVED', 'CLOSED') AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(c.latitude)) * cos(radians(c.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(c.latitude)))) <= :radiusKm " +
           "LIMIT 5", nativeQuery = true)
    List<Complaint> findNearbyOpenComplaints(
            @Param("categoryId") Long categoryId,
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm
    );
}
