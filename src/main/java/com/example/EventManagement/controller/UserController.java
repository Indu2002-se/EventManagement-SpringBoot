package com.example.EventManagement.controller;

import com.example.EventManagement.dto.UserDto;
import com.example.EventManagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserDto userDto) {
        try {
            UserDto registeredUser = userService.registerUser(userDto);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error registering user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testUserCreation() {
        Map<String, Object> response = new java.util.HashMap<>();
        
        try {
            // Test with a simple user
            UserDto testUser = new UserDto();
            testUser.setUsername("testuser");
            testUser.setEmail("test@example.com");
            testUser.setPassword("password123");
            testUser.setFirstName("Test");
            testUser.setLastName("User");
            testUser.setRole(com.example.EventManagement.model.User.UserRole.USER);
            testUser.setIsActive(true);
            
            UserDto savedUser = userService.registerUser(testUser);
            
            response.put("success", true);
            response.put("message", "Test user created successfully");
            response.put("user", savedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create test user");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            // Log the full error for debugging
            System.err.println("Test user creation failed: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{userId}/events")
    public ResponseEntity<List<UserDto>> getUserEvents(@PathVariable Long userId) {
        // This would return events organized by the user
        return ResponseEntity.ok().build();
    }
}
