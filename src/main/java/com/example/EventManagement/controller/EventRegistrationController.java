package com.example.EventManagement.controller;

import com.example.EventManagement.model.EventRegistration;
import com.example.EventManagement.service.EventRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
@Tag(name = "Registrations", description = "Manage event registrations")
public class EventRegistrationController {
    
    private final EventRegistrationService registrationService;
    
    @PostMapping
    @Operation(summary = "Register user for an event")
    public ResponseEntity<EventRegistration> registerForEvent(
            @RequestParam Long eventId,
            @RequestParam Long userId) {
        EventRegistration registration = registrationService.registerForEvent(eventId, userId);
        return new ResponseEntity<>(registration, HttpStatus.CREATED);
    }
    
    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get registrations for an event")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByEvent(@PathVariable Long eventId) {
        List<EventRegistration> registrations = registrationService.getRegistrationsByEvent(eventId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/user/{userId}")
    @Operation(summary = "Get registrations for a user")
    public ResponseEntity<List<EventRegistration>> getRegistrationsByUser(@PathVariable Long userId) {
        List<EventRegistration> registrations = registrationService.getRegistrationsByUser(userId);
        return ResponseEntity.ok(registrations);
    }
    
    @PatchMapping("/{registrationId}/confirm")
    @Operation(summary = "Confirm a registration")
    public ResponseEntity<EventRegistration> confirmRegistration(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.confirmRegistration(registrationId);
        return ResponseEntity.ok(registration);
    }
    
    @PatchMapping("/{registrationId}/cancel")
    @Operation(summary = "Cancel a registration")
    public ResponseEntity<EventRegistration> cancelRegistration(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.cancelRegistration(registrationId);
        return ResponseEntity.ok(registration);
    }
    
    @DeleteMapping("/{registrationId}")
    @Operation(summary = "Delete a registration")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long registrationId) {
        registrationService.deleteRegistration(registrationId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{registrationId}")
    @Operation(summary = "Get registration by id")
    public ResponseEntity<EventRegistration> getRegistrationById(@PathVariable Long registrationId) {
        EventRegistration registration = registrationService.getRegistrationById(registrationId);
        return ResponseEntity.ok(registration);
    }
}
