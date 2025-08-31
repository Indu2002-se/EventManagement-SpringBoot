package com.example.EventManagement.service;

import com.example.EventManagement.dto.CategoryDto;
import com.example.EventManagement.model.Category;
import com.example.EventManagement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().map(CategoryDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        return new CategoryDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        // Validate input
        if (categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Category name cannot be null or empty");
        }
        
        // Check if category name already exists
        if (categoryRepository.existsByName(categoryDto.getName().trim())) {
            throw new RuntimeException("Category name '" + categoryDto.getName() + "' already exists");
        }

        Category category = new Category();
        category.setName(categoryDto.getName().trim());
        category.setDescription(categoryDto.getDescription() != null ? categoryDto.getDescription().trim() : null);
        category.setIcon(categoryDto.getIcon() != null ? categoryDto.getIcon().trim() : null);
        category.setColor(categoryDto.getColor() != null ? categoryDto.getColor().trim() : null);

        try {
            Category savedCategory = categoryRepository.save(category);
            return new CategoryDto(savedCategory);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create category: " + e.getMessage(), e);
        }
    }

    @Transactional
    public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));

        // Validate input
        if (categoryDto.getName() == null || categoryDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Category name cannot be null or empty");
        }

        // Check if new name conflicts with existing categories
        if (!category.getName().equals(categoryDto.getName().trim()) &&
            categoryRepository.existsByName(categoryDto.getName().trim())) {
            throw new RuntimeException("Category name '" + categoryDto.getName() + "' already exists");
        }

        category.setName(categoryDto.getName().trim());
        category.setDescription(categoryDto.getDescription() != null ? categoryDto.getDescription().trim() : null);
        category.setIcon(categoryDto.getIcon() != null ? categoryDto.getIcon().trim() : null);
        category.setColor(categoryDto.getColor() != null ? categoryDto.getColor().trim() : null);

        try {
            Category updatedCategory = categoryRepository.save(category);
            return new CategoryDto(updatedCategory);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update category: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + categoryId));
        
        // Check if category has events
        if (category.getEvents() != null && !category.getEvents().isEmpty()) {
            throw new RuntimeException("Cannot delete category '" + category.getName() + "' with existing events. Please remove or reassign events first.");
        }
        
        try {
            categoryRepository.delete(category);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete category: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesByNameContaining(String name) {
        if (name == null || name.trim().isEmpty()) {
            return getAllCategories();
        }
        
        List<Category> categories = categoryRepository.findAll().stream()
                .filter(cat -> cat.getName().toLowerCase().contains(name.toLowerCase().trim()))
                .collect(Collectors.toList());
        return categories.stream().map(CategoryDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return name != null && !name.trim().isEmpty() && categoryRepository.existsByName(name.trim());
    }
}
