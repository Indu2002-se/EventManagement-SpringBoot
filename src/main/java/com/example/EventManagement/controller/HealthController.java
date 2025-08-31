package com.example.EventManagement.controller;

import com.example.EventManagement.repository.CategoryRepository;
import com.example.EventManagement.repository.EventRepository;
import com.example.EventManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    
    private final CategoryRepository categoryRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());
        
        try {
            // Test database connection
            long categoryCount = categoryRepository.count();
            long eventCount = eventRepository.count();
            long userCount = userRepository.count();
            
            Map<String, Object> database = new HashMap<>();
            database.put("status", "UP");
            database.put("categories", categoryCount);
            database.put("events", eventCount);
            database.put("users", userCount);
            
            health.put("database", database);
        } catch (Exception e) {
            Map<String, Object> database = new HashMap<>();
            database.put("status", "DOWN");
            database.put("error", e.getMessage());
            health.put("database", database);
            health.put("status", "DOWN");
        }
        
        return ResponseEntity.ok(health);
    }
}
