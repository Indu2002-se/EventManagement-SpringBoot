package com.example.EventManagement.service;

import com.example.EventManagement.model.Event;
import com.example.EventManagement.model.EventRegistration;
import com.example.EventManagement.model.User;
import com.example.EventManagement.repository.EventRegistrationRepository;
import com.example.EventManagement.repository.EventRepository;
import com.example.EventManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventRegistrationService {
    
    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    public EventRegistration registerForEvent(Long eventId, Long userId) {
        // Check if event exists and is published
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (event.getStatus() != Event.EventStatus.PUBLISHED) {
            throw new RuntimeException("Event is not published for registration");
        }
        
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is already registered
        if (registrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new RuntimeException("User is already registered for this event");
        }
        
        // Check if event has available capacity
        if (eventRepository.isEventFull(eventId)) {
            throw new RuntimeException("Event is full");
        }
        
        // Create registration
        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        registration.setAmountPaid(event.getTicketPrice());
        registration.setStatus(EventRegistration.RegistrationStatus.PENDING);
        
        return registrationRepository.save(registration);
    }
    
    public List<EventRegistration> getRegistrationsByEvent(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
    
    public List<EventRegistration> getRegistrationsByUser(Long userId) {
        return registrationRepository.findByUserId(userId);
    }
    
    public EventRegistration confirmRegistration(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        registration.setStatus(EventRegistration.RegistrationStatus.CONFIRMED);
        return registrationRepository.save(registration);
    }
    
    public EventRegistration cancelRegistration(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        registration.setStatus(EventRegistration.RegistrationStatus.CANCELLED);
        return registrationRepository.save(registration);
    }
    
    public void deleteRegistration(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        registrationRepository.delete(registration);
    }
    
    public EventRegistration getRegistrationById(Long registrationId) {
        return registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
    }
    
    public Long getConfirmedRegistrationsCount(Long eventId) {
        return registrationRepository.countConfirmedRegistrationsByEventId(eventId);
    }
    
    public List<EventRegistration> getConfirmedRegistrationsByEvent(Long eventId) {
        return registrationRepository.findConfirmedRegistrationsByEventId(eventId);
    }
    
    public List<EventRegistration> getConfirmedRegistrationsByUser(Long userId) {
        return registrationRepository.findConfirmedRegistrationsByUserId(userId);
    }
}
