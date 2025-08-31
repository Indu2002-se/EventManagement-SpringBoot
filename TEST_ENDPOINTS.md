# Test Endpoints Guide - Debug 400 Errors

## Overview
This guide will help you test and debug the HTTP 400 (Bad Request) errors you're experiencing with user and event creation.

## Prerequisites
1. Make sure your Spring Boot application is running: `mvn spring-boot:run`
2. Ensure MySQL is running and accessible
3. Check that the database "EventM" exists and has the required tables

## 1. Test Health Endpoint First
```bash
curl http://localhost:8081/api/health
```
**Expected Response:** JSON with status "UP" and database information

## 2. Test Category Endpoints
```bash
# Get all categories
curl http://localhost:8081/api/categories

# Test category creation
curl -X POST http://localhost:8081/api/categories/test
```

## 3. Test User Endpoints
```bash
# Test user creation with test endpoint
curl -X POST http://localhost:8081/api/users/test

# Test manual user creation
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User2",
    "role": "USER",
    "isActive": true
  }'

# Get all users
curl http://localhost:8081/api/users
```

## 4. Test Event Endpoints
```bash
# Test event creation with test endpoint
curl -X POST http://localhost:8081/api/events/test

# Test manual event creation
curl -X POST http://localhost:8081/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "This is a test event for debugging purposes",
    "startDate": "2024-12-25T10:00:00",
    "endDate": "2024-12-25T12:00:00",
    "location": "Test Location",
    "maxCapacity": 100,
    "ticketPrice": 25.0,
    "categoryId": 1
  }' \
  -G -d "organizerId=1"

# Get all events
curl http://localhost:8081/api/events/all
```

## 5. Common 400 Error Causes and Solutions

### User Creation 400 Errors:
1. **Missing Required Fields:**
   - Username, email, password, firstName, lastName, role are required
   - Check that all required fields are provided in the request

2. **Validation Errors:**
   - Username: 3-50 characters
   - Email: Must be valid email format
   - Password: Minimum 6 characters
   - First/Last name: 2-50 characters

3. **Duplicate Data:**
   - Username or email already exists
   - Check database for existing users

### Event Creation 400 Errors:
1. **Missing Required Fields:**
   - Title, description, startDate, endDate, location, maxCapacity, ticketPrice, categoryId
   - organizerId query parameter is required

2. **Validation Errors:**
   - Title: 3-100 characters
   - Description: 10-1000 characters
   - Dates: Must be in the future
   - Capacity: 1-10000
   - Price: Non-negative

3. **Reference Errors:**
   - Category ID must exist
   - Organizer ID must exist

## 6. Debug Steps

### Step 1: Check Application Logs
Look for detailed error messages in your console where you started the application.

### Step 2: Verify Database State
```sql
USE EventM;

-- Check if tables exist
SHOW TABLES;

-- Check if categories exist
SELECT * FROM categories;

-- Check if users exist
SELECT * FROM users;

-- Check if events exist
SELECT * FROM events;
```

### Step 3: Test with Minimal Data
Start with the test endpoints that use hardcoded data, then gradually add complexity.

### Step 4: Check Request Format
Ensure your JSON is properly formatted and all required fields are present.

## 7. Expected Successful Responses

### User Creation Success:
```json
{
  "success": true,
  "message": "Test user created successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER",
    "isActive": true
  }
}
```

### Event Creation Success:
```json
{
  "success": true,
  "message": "Test event created successfully",
  "event": {
    "id": 1,
    "title": "Test Event",
    "description": "This is a test event for debugging purposes",
    "startDate": "2024-12-25T10:00:00",
    "endDate": "2024-12-25T12:00:00",
    "location": "Test Location",
    "maxCapacity": 100,
    "ticketPrice": 25.0,
    "status": "DRAFT"
  }
}
```

## 8. Troubleshooting Commands

```bash
# Check if application is running
curl http://localhost:8081/api/health

# Check if categories exist
curl http://localhost:8081/api/categories

# Check if users exist
curl http://localhost:8081/api/users

# Test user creation
curl -X POST http://localhost:8081/api/users/test

# Test event creation
curl -X POST http://localhost:8081/api/events/test

# Check application logs for errors
# Look in the console where you started mvn spring-boot:run
```

## 9. If Still Getting 400 Errors

1. **Check the exact error message** in the response body
2. **Verify all required fields** are present and valid
3. **Check database state** - ensure referenced entities exist
4. **Review application logs** for detailed error information
5. **Test with minimal data** using the test endpoints first

## 10. Common Issues

- **Date format**: Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
- **Category ID**: Must reference an existing category
- **Organizer ID**: Must reference an existing user
- **JSON syntax**: Ensure proper JSON formatting
- **Content-Type header**: Must be application/json
