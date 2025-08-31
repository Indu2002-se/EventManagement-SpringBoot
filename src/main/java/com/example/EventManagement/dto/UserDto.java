package com.example.EventManagement.dto;

import com.example.EventManagement.model.User;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    private String fullName;
    private String phoneNumber;
    
    @NotNull(message = "User role is required")
    private User.UserRole role;
    
    private String profileImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive = true;
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
        
        // Safely handle organized events count
        try {
            if (user.getOrganizedEvents() != null) {
                this.organizedEventCount = user.getOrganizedEvents().size();
            } else {
                this.organizedEventCount = 0;
            }
        } catch (Exception e) {
            // If we can't access organizedEvents (lazy loading issue), set to 0
            this.organizedEventCount = 0;
        }
    }
}
