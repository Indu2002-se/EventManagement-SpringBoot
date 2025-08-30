package com.example.EventManagement.repository;

import com.example.EventManagement.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findAllByOrderByNameAsc();
    
    Category findByName(String name);
    
    boolean existsByName(String name);
}
