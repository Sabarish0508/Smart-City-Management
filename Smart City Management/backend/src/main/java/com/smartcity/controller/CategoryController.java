package com.smartcity.controller;

import com.smartcity.entity.ComplaintCategory;
import com.smartcity.repository.ComplaintCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ComplaintCategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<ComplaintCategory>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }
}
