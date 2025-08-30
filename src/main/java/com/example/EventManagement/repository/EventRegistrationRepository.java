package com.example.EventManagement.repository;

import com.example.EventManagement.model.EventRegistration;
import com.example.EventManagement.model.EventRegistration.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    List<EventRegistration> findByEventId(Long eventId);
    
    List<EventRegistration> findByUserId(Long userId);
    
    List<EventRegistration> findByEventIdAndStatus(Long eventId, RegistrationStatus status);
    
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.event.id = :eventId AND er.status = 'CONFIRMED'")
    Long countConfirmedRegistrationsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT er FROM EventRegistration er WHERE er.event.id = :eventId AND er.status = 'CONFIRMED'")
    List<EventRegistration> findConfirmedRegistrationsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT er FROM EventRegistration er WHERE er.user.id = :userId AND er.status = 'CONFIRMED'")
    List<EventRegistration> findConfirmedRegistrationsByUserId(@Param("userId") Long userId);
}
