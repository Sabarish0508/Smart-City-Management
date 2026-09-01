package com.smartcity.repository;

import com.smartcity.entity.ComplaintFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintFeedbackRepository extends JpaRepository<ComplaintFeedback, Long> {
    Optional<ComplaintFeedback> findByComplaintId(Long complaintId);
    List<ComplaintFeedback> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    List<ComplaintFeedback> findAllByOrderByCreatedAtDesc();

    @Query("SELECT f FROM ComplaintFeedback f WHERE f.complaint.assignedDepartment.id = :departmentId ORDER BY f.createdAt DESC")
    List<ComplaintFeedback> findByDepartmentIdOrderByCreatedAtDesc(@Param("departmentId") Long departmentId);

    @Query("SELECT f FROM ComplaintFeedback f WHERE f.complaint.assignedOfficer.id = :officerId ORDER BY f.createdAt DESC")
    List<ComplaintFeedback> findByOfficerIdOrderByCreatedAtDesc(@Param("officerId") Long officerId);

    @Query("SELECT AVG(f.rating) FROM ComplaintFeedback f")
    Double getAverageRating();

    @Query("SELECT COUNT(f) FROM ComplaintFeedback f WHERE f.isSatisfied = true")
    long countSatisfiedFeedback();

    @Query("SELECT f.rating, COUNT(f) FROM ComplaintFeedback f GROUP BY f.rating ORDER BY f.rating DESC")
    List<Object[]> getRatingBreakdown();
}
