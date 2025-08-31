package com.example.EventManagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Event title is required")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;
    
    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Event description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @Column(nullable = false)
    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    @NotBlank(message = "Location is required")
    private String location;
    
    @Column(nullable = false)
    @NotNull(message = "Maximum capacity is required")
    @Min(value = 1, message = "Maximum capacity must be at least 1")
    private Integer maxCapacity;
    
    @Column(nullable = false)
    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.0", message = "Ticket price cannot be negative")
    private Double ticketPrice;
    
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.DRAFT;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @NotNull(message = "Category is required")
    @JsonIgnore
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id")
    @NotNull(message = "Organizer is required")
    @JsonIgnore
    private User organizer;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<EventRegistration> registrations = new HashSet<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @Column
    private String imageUrl;
    
    @Column
    private String tags;
    
    public enum EventStatus {
        DRAFT, PUBLISHED, CANCELLED, COMPLETED
    }
}
