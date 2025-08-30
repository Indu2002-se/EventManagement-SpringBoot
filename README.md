# 🎯 Event Management System

A full-stack web application for managing events, users, categories, and registrations built with Spring Boot (Backend) and React (Frontend).

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Spring Boot    │    │   MySQL Database│
│   (Port 5177)   │◄──►│   (Port 8081)   │◄──►│   (Port 3306)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### Backend Features
- **Event Management**: CRUD operations for events with status tracking
- **User Management**: User registration, authentication, and role-based access
- **Category Management**: Event categorization with custom properties
- **Registration System**: Event registration and confirmation
- **RESTful API**: Comprehensive REST endpoints with proper validation
- **Transaction Management**: @Transactional annotations for data consistency
- **CORS Configuration**: Cross-origin resource sharing enabled

### Frontend Features
- **Dashboard Layout**: Modern, responsive dashboard interface
- **Event Management**: Create, view, edit, and delete events
- **User Management**: User registration and management interface
- **Category Management**: Category creation and management
- **Real-time Updates**: Live data synchronization with backend
- **Responsive Design**: Mobile-friendly interface with plain CSS

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **Validation**: Jakarta Validation
- **Documentation**: Spring Boot Actuator

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Plain CSS (No external libraries)

## 📁 Project Structure

```
EventManagement/
├── src/main/java/com/example/EventManagement/
│   ├── config/
│   │   ├── CorsConfig.java              # CORS configuration
│   │   └── DataInitializer.java         # Database initialization
│   ├── controller/
│   │   ├── EventController.java         # Event REST endpoints
│   │   ├── UserController.java          # User REST endpoints
│   │   ├── CategoryController.java      # Category REST endpoints
│   │   ├── EventRegistrationController.java # Registration endpoints
│   │   └── HealthController.java        # Health check endpoints
│   ├── dto/
│   │   ├── EventDto.java                # Event data transfer object
│   │   ├── CreateEventRequest.java      # Event creation request
│   │   ├── UserDto.java                 # User data transfer object
│   │   └── CategoryDto.java             # Category data transfer object
│   ├── exception/
│   │   ├── EventNotFoundException.java  # Custom exception
│   │   ├── UnauthorizedException.java   # Custom exception
│   │   └── GlobalExceptionHandler.java  # Global exception handler
│   ├── model/
│   │   ├── Event.java                   # Event entity
│   │   ├── User.java                    # User entity
│   │   ├── Category.java                # Category entity
│   │   └── EventRegistration.java       # Registration entity
│   ├── repository/
│   │   ├── EventRepository.java         # Event data access
│   │   ├── UserRepository.java          # User data access
│   │   └── CategoryRepository.java      # Category data access
│   ├── service/
│   │   ├── EventService.java            # Event business logic
│   │   ├── UserService.java             # User business logic
│   │   └── CategoryService.java         # Category business logic
│   └── EventManagementApplication.java  # Main application class
├── src/main/resources/
│   └── application.properties           # Application configuration
├── frontend/EventManagement/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx      # Main dashboard layout
│   │   │   ├── DashboardOverview.jsx    # Dashboard overview
│   │   │   ├── EventsManagement.jsx     # Events management
│   │   │   ├── UsersManagement.jsx      # Users management
│   │   │   └── CategoriesManagement.jsx # Categories management
│   │   ├── services/
│   │   │   └── api.js                   # API service layer
│   │   ├── utils/
│   │   │   └── helpers.js               # Utility functions
│   │   ├── App.jsx                      # Main React component
│   │   ├── App.css                      # Main stylesheet
│   │   └── main.jsx                     # React entry point
│   ├── package.json                     # Frontend dependencies
│   └── vite.config.js                   # Vite configuration
└── README.md                            # This file
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+ and npm
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventManagement
   ```

2. **Configure Database**
   - Start MySQL service
   - Create database (optional, will be auto-created)
   - Update `src/main/resources/application.properties` if needed

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   - Backend will start on `http://localhost:8081`
   - Database will be automatically initialized with sample data

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/EventManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend will start on `http://localhost:5177`

## 🗄️ Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password`: Encrypted password
- `firstName`, `lastName`: User names
- `role`: USER, ORGANIZER, or ADMIN
- `isActive`: Account status
- `createdAt`, `updatedAt`: Timestamps

### Categories Table
- `id`: Primary key
- `name`: Category name
- `description`: Category description
- `icon`: Category icon (emoji)
- `color`: Category color (hex)
- `createdAt`, `updatedAt`: Timestamps

### Events Table
- `id`: Primary key
- `title`: Event title
- `description`: Event description
- `startDate`, `endDate`: Event timing
- `location`: Event location
- `maxCapacity`: Maximum attendees
- `ticketPrice`: Ticket cost
- `status`: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- `category_id`: Foreign key to categories
- `organizer_id`: Foreign key to users
- `createdAt`, `updatedAt`: Timestamps

### Event Registrations Table
- `id`: Primary key
- `event_id`: Foreign key to events
- `user_id`: Foreign key to users
- `status`: PENDING, CONFIRMED, CANCELLED
- `registrationDate`: Registration timestamp

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events (paginated)
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `PATCH /api/events/{id}/publish` - Publish event
- `PATCH /api/events/{id}/cancel` - Cancel event

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users/register` - Register new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/event/{eventId}` - Get event registrations
- `GET /api/registrations/user/{userId}` - Get user registrations
- `PATCH /api/registrations/{id}/confirm` - Confirm registration
- `PATCH /api/registrations/{id}/cancel` - Cancel registration

## 🎨 Frontend Components

### Dashboard Layout
- **Sidebar Navigation**: Easy access to all sections
- **Header**: User information and navigation
- **Content Area**: Dynamic content based on route

### Dashboard Overview
- **Statistics Cards**: Event counts, user counts, category counts
- **Recent Activity**: Latest events and registrations
- **Quick Actions**: Common tasks and shortcuts

### Events Management
- **Event List**: Paginated table of all events
- **Event Creation**: Form for creating new events
- **Event Actions**: Edit, delete, publish, cancel
- **Search & Filter**: Find events by various criteria

### Users Management
- **User List**: Table of all registered users
- **User Registration**: Form for adding new users
- **User Actions**: Edit and delete users
- **Role Management**: Assign user roles

### Categories Management
- **Category List**: All available categories
- **Category Creation**: Add new categories
- **Visual Elements**: Icons and colors for categories
- **Category Actions**: Edit and delete categories

## 🔧 Configuration

### Backend Configuration
```properties
# Server Configuration
server.port=8081
spring.application.name=EventManagement

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/EventM?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Frontend Configuration
```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:8081/api';

// Development Server
// Port: 5177 (Vite default)
// Hot reload enabled
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file: `mvn clean package`
2. Run the JAR: `java -jar target/EventManagement-0.0.1-SNAPSHOT.jar`
3. Configure production database
4. Set environment variables for production

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure reverse proxy for API calls
4. Update API base URL for production

## 🧪 Testing

### Backend Testing
- Unit tests for services and controllers
- Integration tests for repositories
- API endpoint testing with Postman or similar tools

### Frontend Testing
- Component testing with React Testing Library
- API integration testing
- User interface testing

## 🔒 Security Features

- **Input Validation**: Jakarta Validation annotations
- **SQL Injection Protection**: JPA with parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Exception Handling**: Global exception handler
- **Transaction Management**: Data consistency with @Transactional

## 📊 Performance Features

- **Database Indexing**: Optimized queries
- **Pagination**: Large dataset handling
- **Lazy Loading**: Efficient entity relationships
- **Connection Pooling**: Database connection management

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8081
   - Check CORS configuration in CorsConfig.java
   - Verify frontend is making requests to correct URL

2. **Database Connection Issues**
   - Verify MySQL service is running
   - Check database credentials in application.properties
   - Ensure database exists or auto-creation is enabled

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **API Endpoint Issues**
   - Check backend logs for errors
   - Verify endpoint mappings in controllers
   - Test endpoints with Postman or similar tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🔄 Version History

- **v1.0.0**: Initial release with basic CRUD operations
- **v1.1.0**: Added user management and authentication
- **v1.2.0**: Enhanced frontend with dashboard and management interfaces
- **v1.3.0**: Added transaction management and CORS configuration

---

**Built with ❤️ using Spring Boot and React**
