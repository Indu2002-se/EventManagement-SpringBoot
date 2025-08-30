package com.example.EventManagement.dto;

import com.example.EventManagement.model.Category;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
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
}
