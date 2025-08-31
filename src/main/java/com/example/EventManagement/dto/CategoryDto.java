package com.example.EventManagement.dto;

import com.example.EventManagement.model.Category;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Data
public class CategoryDto {
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String name;
    
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;
    
    @Size(max = 10, message = "Icon cannot exceed 10 characters")
    private String icon;
    
    @Size(max = 7, message = "Color code cannot exceed 7 characters")
    private String color;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer eventCount;
    
    // Constructor to convert from Entity
    public CategoryDto(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.icon = category.getIcon();
        this.color = category.getColor();
        this.createdAt = category.getCreatedAt();
        this.updatedAt = category.getUpdatedAt();
        //this.eventCount = category.getEventCount();
    }
    
    // Default constructor for JSON deserialization
    public CategoryDto() {}
}
