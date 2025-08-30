package com.example.EventManagement.controller;

import com.example.EventManagement.model.EventRegistration;
import com.example.EventManagement.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class EventRegistrationController {
    
    private final EventRegistrationService registrationService;
    
    @PostMapping
    public ResponseEntity<EventRegistration> registerForEvent(
            @RequestParam Long eventId,
            @RequestParam Long userId) {
        EventRegistration registration = registrationService.registerForEvent(eventId, userId);
        return new ResponseEntity<>(registration, HttpStatus.CREATED);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByEvent(@PathVariable Long eventId) {
        List<EventRegistration> registrations = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByUser(@PathVariable Long userId) {
        List<EventRegistration> registrations = registrationService.getRegistrationsByUser(userId);
        return ResponseEntity.ok(registrations);
    }
    
    @PatchMapping("/{registrationId}/confirm")
    public ResponseEntity<EventRegistration> confirmRegistration(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.confirmRegistration(registrationId);
        return ResponseEntity.ok(registration);
    }
    
    @PatchMapping("/{registrationId}/cancel")
    public ResponseEntity<EventRegistration> cancelRegistration(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.cancelRegistration(registrationId);
        return ResponseEntity.ok(registration);
    }
    
    @DeleteMapping("/{registrationId}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long registrationId) {
        registrationService.deleteRegistration(registrationId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{registrationId}")
    public ResponseEntity<EventRegistration> getRegistrationById(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.getRegistrationById(registrationId);
        return ResponseEntity.ok(registration);
    }
}
