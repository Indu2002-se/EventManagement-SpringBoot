package com.example.EventManagement.config;

import com.example.EventManagement.model.Category;
import com.example.EventManagement.model.User;
import com.example.EventManagement.repository.CategoryRepository;
import com.example.EventManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Initialize categories if they don't exist
        if (categoryRepository.count() == 0) {
            initializeCategories();
        }
        
        // Initialize admin user if it doesn't exist
        if (userRepository.count() == 0) {
            initializeAdminUser();
        }
    }
    
    private void initializeCategories() {
        Category[] categories = {
            createCategory("Technology", "Technology and IT related events", "💻", "#3B82F6"),
            createCategory("Business", "Business and entrepreneurship events", "💼", "#10B981"),
            createCategory("Education", "Educational and learning events", "📚", "#F59E0B"),
            createCategory("Entertainment", "Entertainment and leisure events", "🎭", "#EF4444"),
            createCategory("Sports", "Sports and fitness events", "⚽", "#8B5CF6"),
            createCategory("Music", "Music and performance events", "🎵", "#EC4899"),
            createCategory("Food", "Food and culinary events", "🍕", "#F97316"),
            createCategory("Health", "Health and wellness events", "🏥", "#06B6D4")
        };
        
        for (Category category : categories) {
            categoryRepository.save(category);
        }
    }
    
    private Category createCategory(String name, String description, String icon, String color) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIcon(icon);
        category.setColor(color);
        return category;
    }
    
    private void initializeAdminUser() {
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setEmail("admin@eventmanagement.com");
        adminUser.setPassword("admin123"); // In production, this should be encrypted
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setRole(User.UserRole.ADMIN);
        adminUser.setIsActive(true);
        
        userRepository.save(adminUser);
    }
}
