package com.example.EventManagement.service;

import com.example.EventManagement.dto.UserDto;
import com.example.EventManagement.model.User;
import com.example.EventManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new UserDto(user);
    }

    @Transactional
    public UserDto registerUser(UserDto userDto) {
        try {
            // Validate input
            if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
                throw new RuntimeException("Username cannot be null or empty");
            }
            
            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email cannot be null or empty");
            }
            
            if (userDto.getFirstName() == null || userDto.getFirstName().trim().isEmpty()) {
                throw new RuntimeException("First name cannot be null or empty");
            }
            
            if (userDto.getLastName() == null || userDto.getLastName().trim().isEmpty()) {
                throw new RuntimeException("Last name cannot be null or empty");
            }
            
            if (userDto.getRole() == null) {
                throw new RuntimeException("User role cannot be null");
            }

            // Check if username already exists
            if (userRepository.existsByUsername(userDto.getUsername().trim())) {
                throw new RuntimeException("Username '" + userDto.getUsername() + "' already exists");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(userDto.getEmail().trim())) {
                throw new RuntimeException("Email '" + userDto.getEmail() + "' already exists");
            }

            User user = new User();
            user.setUsername(userDto.getUsername().trim());
            user.setEmail(userDto.getEmail().trim());
            user.setPassword(userDto.getPassword() != null ? userDto.getPassword().trim() : "defaultPassword"); // Note: should be encrypted
            user.setFirstName(userDto.getFirstName().trim());
            user.setLastName(userDto.getLastName().trim());
            user.setPhoneNumber(userDto.getPhoneNumber() != null ? userDto.getPhoneNumber().trim() : null);
            user.setRole(userDto.getRole());
            user.setIsActive(userDto.getIsActive() != null ? userDto.getIsActive() : true);
            user.setProfileImageUrl(userDto.getProfileImageUrl());

            User savedUser = userRepository.save(user);
            return new UserDto(savedUser);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);
        }
    }

    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Validate input
            if (userDto.getUsername() == null || userDto.getUsername().trim().isEmpty()) {
                throw new RuntimeException("Username cannot be null or empty");
            }
            
            if (userDto.getEmail() == null || userDto.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email cannot be null or empty");
            }
            
            if (userDto.getFirstName() == null || userDto.getFirstName().trim().isEmpty()) {
                throw new RuntimeException("First name cannot be null or empty");
            }
            
            if (userDto.getLastName() == null || userDto.getLastName().trim().isEmpty()) {
                throw new RuntimeException("Last name cannot be null or empty");
            }

            // Check if new username conflicts with existing users
            if (!user.getUsername().equals(userDto.getUsername().trim()) &&
                userRepository.existsByUsername(userDto.getUsername().trim())) {
                throw new RuntimeException("Username '" + userDto.getUsername() + "' already exists");
            }

            // Check if new email conflicts with existing users
            if (!user.getEmail().equals(userDto.getEmail().trim()) &&
                userRepository.existsByEmail(userDto.getEmail().trim())) {
                throw new RuntimeException("Email '" + userDto.getEmail() + "' already exists");
            }

            user.setUsername(userDto.getUsername().trim());
            user.setEmail(userDto.getEmail().trim());
            user.setFirstName(userDto.getFirstName().trim());
            user.setLastName(userDto.getLastName().trim());
            user.setPhoneNumber(userDto.getPhoneNumber() != null ? userDto.getPhoneNumber().trim() : null);
            user.setRole(userDto.getRole() != null ? userDto.getRole() : user.getRole());
            user.setIsActive(userDto.getIsActive() != null ? userDto.getIsActive() : user.getIsActive());
            user.setProfileImageUrl(userDto.getProfileImageUrl());

            User updatedUser = userRepository.save(user);
            return new UserDto(updatedUser);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
            userRepository.delete(user);
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public List<UserDto> getUsersByRole(User.UserRole role) {
        try {
            List<User> users = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == role)
                    .collect(Collectors.toList());
            return users.stream().map(UserDto::new).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to get users by role: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
            return new UserDto(user);
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user by username: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return new UserDto(user);
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to get user by email: " + e.getMessage(), e);
        }
    }
}
