package com.example.EventManagement.controller;

import com.example.EventManagement.dto.CategoryDto;
import com.example.EventManagement.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        try {
            CategoryDto savedCategory = categoryService.createCategory(categoryDto);
            return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating category: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testCategoryCreation() {
        Map<String, Object> response = new java.util.HashMap<>();
        
        try {
            // Test with a simple category
            CategoryDto testCategory = new CategoryDto();
            testCategory.setName("Test Category");
            testCategory.setDescription("Test Description");
            testCategory.setIcon("🧪");
            testCategory.setColor("#FF0000");
            
            CategoryDto savedCategory = categoryService.createCategory(testCategory);
            
            response.put("success", true);
            response.put("message", "Test category created successfully");
            response.put("category", savedCategory);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create test category");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            // Log the full error for debugging
            System.err.println("Test category creation failed: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long categoryId) {
        CategoryDto category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }
    
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDto categoryDto) {
        CategoryDto updatedCategory = categoryService.updateCategory(categoryId, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}
