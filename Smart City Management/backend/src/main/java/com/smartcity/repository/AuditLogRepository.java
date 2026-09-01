package com.smartcity.repository;

import com.smartcity.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntityTypeAndEntityIdOrderByPerformedAtDesc(String entityType, Long entityId);

    List<AuditLog> findTop100ByOrderByPerformedAtDesc();

    Page<AuditLog> findAllByOrderByPerformedAtDesc(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE (:municipality IS NULL OR a.municipality = :municipality) ORDER BY a.performedAt DESC")
    List<AuditLog> findByMunicipality(@Param("municipality") String municipality);
}
