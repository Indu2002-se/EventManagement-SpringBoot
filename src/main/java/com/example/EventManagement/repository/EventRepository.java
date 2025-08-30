package com.example.EventManagement.repository;

import com.example.EventManagement.model.Event;
import com.example.EventManagement.model.Event.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find events by status
    List<Event> findByStatus(EventStatus status);
    
    // Find events by category
    Page<Event> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Find events by organizer
    Page<Event> findByOrganizerId(Long organizerId, Pageable pageable);
    
    // Find published events
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    
    // Find events by location
    List<Event> findByLocationContainingIgnoreCase(String location);
    
    // Find events by title or description (search)
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Event> searchEvents(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find upcoming events
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.startDate > :now ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);
    
    // Find events within date range
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND " +
           "e.startDate BETWEEN :startDate AND :endDate ORDER BY e.startDate ASC")
    List<Event> findEventsInDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    // Find events with available capacity
    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND " +
           "e.maxCapacity > (SELECT COUNT(er) FROM EventRegistration er WHERE er.event = e AND er.status = 'CONFIRMED')")
    List<Event> findEventsWithAvailableCapacity();
    
    // Check if event is full
    @Query("SELECT CASE WHEN e.maxCapacity <= " +
           "(SELECT COUNT(er) FROM EventRegistration er WHERE er.event = e AND er.status = 'CONFIRMED') " +
           "THEN true ELSE false END FROM Event e WHERE e.id = :eventId")
    Boolean isEventFull(@Param("eventId") Long eventId);
}
