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
        try {
            // Validate organizer exists
            User organizer = userRepository.findById(organizerId)
                    .orElseThrow(() -> new RuntimeException("Organizer not found with ID: " + organizerId));
            
            // Validate category exists
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));
            
            // Validate dates
            LocalDateTime now = LocalDateTime.now();
            if (request.getStartDate().isBefore(now)) {
                throw new RuntimeException("Start date cannot be in the past. Current time: " + now);
            }
            
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new RuntimeException("End date cannot be before start date. Start: " + request.getStartDate() + ", End: " + request.getEndDate());
            }
            
            // Validate capacity
            if (request.getMaxCapacity() <= 0) {
                throw new RuntimeException("Maximum capacity must be greater than 0");
            }
            
            // Validate ticket price
            if (request.getTicketPrice() < 0) {
                throw new RuntimeException("Ticket price cannot be negative");
            }
            
            // Create event
            Event event = new Event();
            event.setTitle(request.getTitle().trim());
            event.setDescription(request.getDescription().trim());
            event.setStartDate(request.getStartDate());
            event.setEndDate(request.getEndDate());
            event.setLocation(request.getLocation().trim());
            event.setMaxCapacity(request.getMaxCapacity());
            event.setTicketPrice(request.getTicketPrice());
            event.setCategory(category);
            event.setOrganizer(organizer);
            event.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
            event.setTags(request.getTags() != null ? request.getTags().trim() : null);
            event.setStatus(Event.EventStatus.DRAFT);
            
            Event savedEvent = eventRepository.save(event);
            
            // Return DTO with proper data
            return new EventDto(savedEvent);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to create event: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public EventDto getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        return new EventDto(event);
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getAllEvents(Pageable pageable) {
        try {
            return eventRepository.findByStatus(Event.EventStatus.PUBLISHED, pageable)
                    .map(EventDto::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve events: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getAllEventsRegardlessOfStatus(Pageable pageable) {
        try {
            return eventRepository.findAll(pageable)
                    .map(EventDto::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve all events: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> searchEvents(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new RuntimeException("Search term cannot be empty");
        }
        
        try {
            return eventRepository.searchEvents(searchTerm.trim(), pageable)
                    .map(EventDto::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to search events: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<EventDto> getUpcomingEvents() {
        try {
            return eventRepository.findUpcomingEvents(LocalDateTime.now())
                    .stream()
                    .map(EventDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve upcoming events: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getEventsByCategory(Long categoryId, Pageable pageable) {
        // Validate category exists
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Category not found with ID: " + categoryId);
        }
        
        try {
            return eventRepository.findByCategoryId(categoryId, pageable)
                    .map(EventDto::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve events by category: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public Page<EventDto> getEventsByOrganizer(Long organizerId, Pageable pageable) {
        // Validate organizer exists
        if (!userRepository.existsById(organizerId)) {
            throw new RuntimeException("Organizer not found with ID: " + organizerId);
        }
        
        try {
            return eventRepository.findByOrganizerId(organizerId, pageable)
                    .map(EventDto::new);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve events by organizer: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public EventDto updateEvent(Long eventId, CreateEventRequest request, Long organizerId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
            
            // Check if user is the organizer
            if (!event.getOrganizer().getId().equals(organizerId)) {
                throw new RuntimeException("Only the organizer can update this event. Organizer ID: " + event.getOrganizer().getId() + ", Requested ID: " + organizerId);
            }
            
            // Validate category exists
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));
            
            // Validate dates
            LocalDateTime now = LocalDateTime.now();
            if (request.getStartDate().isBefore(now)) {
                throw new RuntimeException("Start date cannot be in the past. Current time: " + now);
            }
            
            if (request.getEndDate().isBefore(request.getStartDate())) {
                throw new RuntimeException("End date cannot be before start date. Start: " + request.getStartDate() + ", End: " + request.getEndDate());
            }
            
            // Update event
            event.setTitle(request.getTitle().trim());
            event.setDescription(request.getDescription().trim());
            event.setStartDate(request.getStartDate());
            event.setEndDate(request.getEndDate());
            event.setLocation(request.getLocation().trim());
            event.setMaxCapacity(request.getMaxCapacity());
            event.setTicketPrice(request.getTicketPrice());
            event.setCategory(category);
            event.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);
            event.setTags(request.getTags() != null ? request.getTags().trim() : null);
            
            Event savedEvent = eventRepository.save(event);
            return new EventDto(savedEvent);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to update event: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public EventDto publishEvent(Long eventId, Long organizerId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
            
            // Check if user is the organizer
            if (!event.getOrganizer().getId().equals(organizerId)) {
                throw new RuntimeException("Only the organizer can publish this event. Organizer ID: " + event.getOrganizer().getId() + ", Requested ID: " + organizerId);
            }
            
            event.setStatus(Event.EventStatus.PUBLISHED);
            Event savedEvent = eventRepository.save(event);
            return new EventDto(savedEvent);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to publish event: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public EventDto cancelEvent(Long eventId, Long organizerId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
            
            // Check if user is the organizer
            if (!event.getOrganizer().getId().equals(organizerId)) {
                throw new RuntimeException("Only the organizer can cancel this event. Organizer ID: " + event.getOrganizer().getId() + ", Requested ID: " + organizerId);
            }
            
            event.setStatus(Event.EventStatus.CANCELLED);
            Event savedEvent = eventRepository.save(event);
            return new EventDto(savedEvent);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to cancel event: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public void deleteEvent(Long eventId, Long organizerId) {
        try {
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
            
            // Check if user is the organizer
            if (!event.getOrganizer().getId().equals(organizerId)) {
                throw new RuntimeException("Only the organizer can delete this event. Organizer ID: " + event.getOrganizer().getId() + ", Requested ID: " + organizerId);
            }
            
            eventRepository.delete(event);
            
        } catch (RuntimeException e) {
            throw e; // Re-throw validation errors
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete event: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<EventDto> getEventsWithAvailableCapacity() {
        try {
            return eventRepository.findEventsWithAvailableCapacity()
                    .stream()
                    .map(EventDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve events with available capacity: " + e.getMessage(), e);
        }
    }
}
