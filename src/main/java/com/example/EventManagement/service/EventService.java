package com.example.EventManagement.service;

import com.example.EventManagement.dto.CreateEventRequest;
import com.example.EventManagement.dto.EventDto;
import com.example.EventManagement.model.Category;
import com.example.EventManagement.model.Event;
import com.example.EventManagement.model.User;
import com.example.EventManagement.repository.CategoryRepository;
import com.example.EventManagement.repository.EventRepository;
import com.example.EventManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    
    @Transactional
    public EventDto createEvent(CreateEventRequest request, Long organizerId) {
        // Validate organizer exists
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        // Validate category exists
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Validate dates
        if (request.getStartDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Start date cannot be in the past");
        }
        
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        
        // Create event
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setLocation(request.getLocation());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setTicketPrice(request.getTicketPrice());
        event.setCategory(category);
        event.setOrganizer(organizer);
        event.setImageUrl(request.getImageUrl());
        event.setTags(request.getTags());
        event.setStatus(Event.EventStatus.DRAFT);
        
        Event savedEvent = eventRepository.save(event);
        return new EventDto(savedEvent);
    }
    
    @Transactional(readOnly = true)
    public EventDto getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return new EventDto(event);
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getAllEvents(Pageable pageable) {
        return eventRepository.findByStatus(Event.EventStatus.PUBLISHED, pageable)
                .map(EventDto::new);
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> searchEvents(String searchTerm, Pageable pageable) {
        return eventRepository.searchEvents(searchTerm, pageable)
                .map(EventDto::new);
    }
    
    @Transactional(readOnly = true)
    public List<EventDto> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now())
                .stream()
                .map(EventDto::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getEventsByCategory(Long categoryId, Pageable pageable) {
        return eventRepository.findByCategoryId(categoryId, pageable)
                .map(EventDto::new);
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getEventsByOrganizer(Long organizerId, Pageable pageable) {
        return eventRepository.findByOrganizerId(organizerId, pageable)
                .map(EventDto::new);
    }
    
    @Transactional
    public EventDto updateEvent(Long eventId, CreateEventRequest request, Long organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new RuntimeException("Only the organizer can update this event");
        }
        
        // Validate category exists
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Update event
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setLocation(request.getLocation());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setTicketPrice(request.getTicketPrice());
        event.setCategory(category);
        event.setImageUrl(request.getImageUrl());
        event.setTags(request.getTags());
        
        Event savedEvent = eventRepository.save(event);
        return new EventDto(savedEvent);
    }
    
    @Transactional
    public EventDto publishEvent(Long eventId, Long organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new RuntimeException("Only the organizer can publish this event");
        }
        
        event.setStatus(Event.EventStatus.PUBLISHED);
        Event savedEvent = eventRepository.save(event);
        return new EventDto(savedEvent);
    }
    
    @Transactional
    public EventDto cancelEvent(Long eventId, Long organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new RuntimeException("Only the organizer can cancel this event");
        }
        
        event.setStatus(Event.EventStatus.CANCELLED);
        Event savedEvent = eventRepository.save(event);
        return new EventDto(savedEvent);
    }
    
    @Transactional
    public void deleteEvent(Long eventId, Long organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the organizer
        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new RuntimeException("Only the organizer can delete this event");
        }
        
        eventRepository.delete(event);
    }
    
    @Transactional(readOnly = true)
    public List<EventDto> getEventsWithAvailableCapacity() {
        return eventRepository.findEventsWithAvailableCapacity()
                .stream()
                .map(EventDto::new)
                .collect(Collectors.toList());
    }
}
