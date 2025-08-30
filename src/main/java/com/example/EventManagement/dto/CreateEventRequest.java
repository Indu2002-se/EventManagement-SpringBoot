package com.example.EventManagement.dto;

import lombok.Data;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Data
public class CreateEventRequest {
    
    @NotBlank(message = "Event title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @NotBlank(message = "Event description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;
    
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;
    
    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Maximum capacity is required")
    @Min(value = 1, message = "Maximum capacity must be at least 1")
    @Max(value = 10000, message = "Maximum capacity cannot exceed 10000")
    private Integer maxCapacity;
    
    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.0", message = "Ticket price cannot be negative")
    private Double ticketPrice;
    
    @NotNull(message = "Category is required")
    private Long categoryId;
    
    private String imageUrl;
    private String tags;
}
