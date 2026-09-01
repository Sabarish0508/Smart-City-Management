package com.smartcity.repository;

import com.smartcity.entity.ComplaintCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplaintCategoryRepository extends JpaRepository<ComplaintCategory, Long> {
    Optional<ComplaintCategory> findByCode(String code);
    Optional<ComplaintCategory> findByName(String name);
}
