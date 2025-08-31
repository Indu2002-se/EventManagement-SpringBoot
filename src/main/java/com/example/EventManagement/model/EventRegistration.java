package com.example.EventManagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Enumerated(EnumType.STRING)
    private RegistrationStatus status = RegistrationStatus.PENDING;
    
    @Column
    private String paymentId;
    
    @Column(nullable = false)
    private Double amountPaid;
    
    @Column
    private String specialRequirements;
    
    @CreationTimestamp
    private LocalDateTime registeredAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum RegistrationStatus {
        PENDING, CONFIRMED, CANCELLED, REFUNDED
    }
}
