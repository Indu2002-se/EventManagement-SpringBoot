package com.example.EventManagement.dto;

import com.example.EventManagement.model.Event;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;
    private Integer maxCapacity;
    private Double ticketPrice;
    private Event.EventStatus status;
    private Long categoryId;
    private String categoryName;
    private Long organizerId;
    private String organizerName;
    private String imageUrl;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer currentRegistrations;
    
    // Constructor to convert from Entity
    public EventDto(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.startDate = event.getStartDate();
        this.endDate = event.getEndDate();
        this.location = event.getLocation();
        this.maxCapacity = event.getMaxCapacity();
        this.ticketPrice = event.getTicketPrice();
        this.status = event.getStatus();
        this.imageUrl = event.getImageUrl();
        this.tags = event.getTags();
        this.createdAt = event.getCreatedAt();
        this.updatedAt = event.getUpdatedAt();
        
        if (event.getCategory() != null) {
            this.categoryId = event.getCategory().getId();
            this.categoryName = event.getCategory().getName();
        }
        
        if (event.getOrganizer() != null) {
            this.organizerId = event.getOrganizer().getId();
            this.organizerName = event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName();
        }
        
        if (event.getRegistrations() != null) {
            this.currentRegistrations = event.getRegistrations().size();
        }
    }
}
