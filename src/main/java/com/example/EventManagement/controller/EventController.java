package com.example.EventManagement.controller;

import com.example.EventManagement.dto.CreateEventRequest;
import com.example.EventManagement.dto.EventDto;
import com.example.EventManagement.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    
    private final EventService eventService;
    
    @PostMapping
    public ResponseEntity<EventDto> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @RequestParam Long organizerId) {
        EventDto event = eventService.createEvent(request, organizerId);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }
    
    @GetMapping("/{eventId}")
    public ResponseEntity<EventDto> getEventById(@PathVariable Long eventId) {
        EventDto event = eventService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }
    
    @GetMapping
    public ResponseEntity<Page<EventDto>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<EventDto>> searchEvents(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.searchEvents(searchTerm, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> getUpcomingEvents() {
        List<EventDto> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<EventDto>> getEventsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getEventsByCategory(categoryId, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<Page<EventDto>> getEventsByOrganizer(
            @PathVariable Long organizerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getEventsByOrganizer(organizerId, pageable);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<EventDto>> getEventsWithAvailableCapacity() {
        List<EventDto> events = eventService.getEventsWithAvailableCapacity();
        return ResponseEntity.ok(events);
    }
    
    @PutMapping("/{eventId}")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateEventRequest request,
            @RequestParam Long organizerId) {
        EventDto event = eventService.updateEvent(eventId, request, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @PatchMapping("/{eventId}/publish")
    public ResponseEntity<EventDto> publishEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        EventDto event = eventService.publishEvent(eventId, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @PatchMapping("/{eventId}/cancel")
    public ResponseEntity<EventDto> cancelEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        EventDto event = eventService.cancelEvent(eventId, organizerId);
        return ResponseEntity.ok(event);
    }
    
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long eventId,
            @RequestParam Long organizerId) {
        eventService.deleteEvent(eventId, organizerId);
        return ResponseEntity.noContent().build();
    }
}
