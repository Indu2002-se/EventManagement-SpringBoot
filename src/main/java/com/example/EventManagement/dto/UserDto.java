package com.example.EventManagement.dto;

import com.example.EventManagement.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String password; // Added for registration
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private User.UserRole role;
    private String profileImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    private Integer organizedEventCount;
    
    // Default constructor
    public UserDto() {}
    
    // Constructor to convert from Entity
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = null; // Don't expose password in DTO
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
        this.profileImageUrl = user.getProfileImageUrl();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.isActive = user.getIsActive();
        
        if (user.getOrganizedEvents() != null) {
            this.organizedEventCount = user.getOrganizedEvents().size();
        }
    }
}
