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
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return new CategoryDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto categoryDto) {
        // Check if category name already exists
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIcon(categoryDto.getIcon());
        category.setColor(categoryDto.getColor());

        Category savedCategory = categoryRepository.save(category);
        return new CategoryDto(savedCategory);
    }

    @Transactional
    public CategoryDto updateCategory(Long categoryId, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Check if new name conflicts with existing categories
        if (!category.getName().equals(categoryDto.getName()) &&
            categoryRepository.existsByName(categoryDto.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIcon(categoryDto.getIcon());
        category.setColor(categoryDto.getColor());

        Category updatedCategory = categoryRepository.save(category);
        return new CategoryDto(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Check if category has events
        if (category.getEvents() != null && !category.getEvents().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing events");
        }
        
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesByNameContaining(String name) {
        List<Category> categories = categoryRepository.findAll().stream()
                .filter(cat -> cat.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
        return categories.stream().map(CategoryDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}
