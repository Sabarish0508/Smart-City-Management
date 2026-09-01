package com.smartcity.repository;

import com.smartcity.entity.ComplaintStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintStatusHistoryRepository extends JpaRepository<ComplaintStatusHistory, Long> {
    List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtAsc(Long complaintId);
    List<ComplaintStatusHistory> findByComplaintIdOrderByCreatedAtDesc(Long complaintId);
}
