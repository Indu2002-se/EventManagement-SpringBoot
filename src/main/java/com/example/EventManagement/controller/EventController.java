package com.example.EventManagement.controller;

import com.example.EventManagement.dto.CreateEventRequest;
import com.example.EventManagement.dto.EventDto;
import com.example.EventManagement.service.EventService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Manage events lifecycle")
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    @Operation(summary = "Create a new event")
    public ResponseEntity<EventDto> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @RequestParam Long organizerId) {
        try {
            EventDto event = eventService.createEvent(request, organizerId);
            return new ResponseEntity<>(event, HttpStatus.CREATED);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating event: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @PostMapping("/test")
    @Operation(summary = "Create a sample event (debug)")
    public ResponseEntity<Map<String, Object>> testEventCreation() {
        Map<String, Object> response = new java.util.HashMap<>();
        
        try {
            // First, let's check if we have the required data
            response.put("debug", "Starting event creation test");
            
            // Test with a simple event - use dates that are definitely in the future
            CreateEventRequest testEvent = new CreateEventRequest();
            testEvent.setTitle("Test Event");
            testEvent.setDescription("This is a test event for debugging purposes");
            
            // Use dates that are definitely in the future
            LocalDateTime now = LocalDateTime.now();
            testEvent.setStartDate(now.plusDays(1).withHour(10).withMinute(0).withSecond(0));
            testEvent.setEndDate(now.plusDays(1).withHour(12).withMinute(0).withSecond(0));
            
            testEvent.setLocation("Test Location");
            testEvent.setMaxCapacity(100);
            testEvent.setTicketPrice(25.0);
            testEvent.setCategoryId(1L); // Assuming category with ID 1 exists
            
            response.put("debug", "Test event data prepared");
            response.put("testEventData", testEvent);
            
            // Try to create the event
            EventDto savedEvent = eventService.createEvent(testEvent, 1L); // Assuming user with ID 1 exists
            
            response.put("success", true);
            response.put("message", "Test event created successfully");
            response.put("event", savedEvent);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create test event");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            response.put("errorDetails", e.toString());
            
            // Log the full error for debugging
            System.err.println("Test event creation failed: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/debug")
    @Operation(summary = "Collect debug info for events")
    public ResponseEntity<Map<String, Object>> debugEventCreation() {
        Map<String, Object> response = new java.util.HashMap<>();
        
        try {
            // Check what data we have available
            response.put("debug", "Checking available data for event creation");
            
            // Get all events regardless of status
            List<EventDto> allEvents = eventService.getAllEventsRegardlessOfStatus(PageRequest.of(0, 1000)).getContent();
            response.put("totalEvents", allEvents.size());
            
            // Check if we have any events
            if (!allEvents.isEmpty()) {
                response.put("sampleEvent", allEvents.get(0));
            }
            
            response.put("message", "Debug information collected");
            response.put("timestamp", LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to collect debug information");
            response.put("error", e.getMessage());
            response.put("errorType", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/all")
    @Operation(summary = "List all events (no pagination)")
    public ResponseEntity<List<EventDto>> getAllEventsSimple() {
        try {
            // Get all events without pagination for testing
            Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 events
            Page<EventDto> eventsPage = eventService.getAllEventsRegardlessOfStatus(pageable);
            return ResponseEntity.ok(eventsPage.getContent());
        } catch (Exception e) {
            System.err.println("Error getting all events: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search events by term")
    public ResponseEntity<Page<EventDto>> searchEvents(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.searchEvents(searchTerm, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/upcoming")
    @Operation(summary = "List upcoming events")
    public ResponseEntity<List<EventDto>> getUpcomingEvents() {
        List<EventDto> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "List events by category")
    public ResponseEntity<Page<EventDto>> getEventsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getEventsByCategory(categoryId, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/organizer/{organizerId}")
    @Operation(summary = "List events by organizer")
    public ResponseEntity<Page<EventDto>> getEventsByOrganizer(
            @PathVariable Long organizerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getEventsByOrganizer(organizerId, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/available")
    @Operation(summary = "List events with available seats")
    public ResponseEntity<List<EventDto>> getEventsWithAvailableCapacity() {
        List<EventDto> events = eventService.getEventsWithAvailableCapacity();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping
    @Operation(summary = "List events (paginated)")
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{eventId}")
    @Operation(summary = "Get event by id")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long eventId) {
        EventDto event = eventService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }
    
    @PutMapping("/{eventId}")
    @Operation(summary = "Update an event")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateEventRequest request,
            @RequestParam Long organizerId) {
        EventDto event = eventService.updateEvent(eventId, request, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @PatchMapping("/{eventId}/publish")
    @Operation(summary = "Publish an event")
    public ResponseEntity<EventDto> publishEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        EventDto event = eventService.publishEvent(eventId, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @PatchMapping("/{eventId}/cancel")
    @Operation(summary = "Cancel an event")
    public ResponseEntity<EventDto> cancelEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        EventDto event = eventService.cancelEvent(eventId, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @DeleteMapping("/{eventId}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        eventService.deleteEvent(eventId, organizerId);
        return ResponseEntity.noContent().build();
    }
}
