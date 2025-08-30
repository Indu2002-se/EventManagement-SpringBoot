package com.example.EventManagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public String health() {
        return "Event Management Backend is running!";
    }
    
    @GetMapping("/api/health")
    public String apiHealth() {
        return "Event Management API is running!";
    }
}
