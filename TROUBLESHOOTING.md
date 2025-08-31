# Event Management Application Troubleshooting Guide

## Issues After Restart

If you're experiencing problems creating new events and categories after restarting your Spring Boot application, follow these troubleshooting steps:

## 1. Check Database Connection

First, verify that your MySQL database is running and accessible:

```bash
# Check if MySQL is running
mysql -u root -p -h localhost -P 3306

# Or try connecting with your credentials
mysql -u root -pIhara12# -h localhost -P 3306
```

## 2. Test Health Endpoint

Start your application and test the health endpoint:

```bash
# Start your Spring Boot application
mvn spring-boot:run

# Test the health endpoint
curl http://localhost:8081/api/health
```

This will show you:
- Application status
- Database connection status
- Current record counts

## 3. Test Category Creation

Test creating a category using the test endpoint:

```bash
# Test category creation
curl -X POST http://localhost:8081/api/categories/test
```

## 4. Test Event Creation

Test creating an event using the test endpoint:

```bash
# Test event creation
curl -X POST http://localhost:8081/api/events/test
```

## 5. Test Event Fetching

Test fetching events using the new endpoints:

```bash
# Get all events (simple, no pagination)
curl http://localhost:8081/api/events/all

# Get events with pagination
curl http://localhost:8081/api/events?page=0&size=10

# Get a specific event by ID
curl http://localhost:8081/api/events/1
```

## 6. Check Application Logs

Look for error messages in your application logs. The enhanced logging configuration will show:
- SQL queries being executed
- Database connection details
- Validation errors
- Exception details

## 7. Common Issues and Solutions

### Issue: Database Connection Failed
**Symptoms:** Health endpoint shows database status as "DOWN"
**Solutions:**
- Ensure MySQL is running
- Check if the database "EventM" exists
- Verify username/password
- Check if port 3306 is accessible

### Issue: Validation Errors
**Symptoms:** Error messages about required fields or invalid data
**Solutions:**
- Check that all required fields are provided
- Ensure dates are in the future
- Verify category and organizer IDs exist

### Issue: Database Schema Issues
**Symptoms:** Hibernate errors or table not found
**Solutions:**
- Check if tables were created properly
- Verify `spring.jpa.hibernate.ddl-auto=update` is working
- Look for any migration errors

### Issue: LazyInitializationException
**Symptoms:** Errors when trying to fetch events with related data
**Solutions:**
- This has been fixed in the updated code
- The EventDto now safely handles lazy-loaded collections
- Entities use proper @ToString.Exclude annotations

### Issue: Circular Reference Issues
**Symptoms:** Stack overflow errors or infinite loops
**Solutions:**
- This has been fixed in the updated code
- Entities now use @ToString.Exclude and @EqualsAndHashCode.Exclude

## 8. Manual Database Check

Connect to your database and verify the schema:

```sql
USE EventM;

-- Check if tables exist
SHOW TABLES;

-- Check table structure
DESCRIBE categories;
DESCRIBE events;
DESCRIBE users;
DESCRIBE event_registrations;

-- Check if data exists
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM event_registrations;

-- Check if there are any events
SELECT id, title, status FROM events LIMIT 5;
```

## 9. Reset Database (If Needed)

If you need to start fresh:

```sql
-- Drop and recreate database
DROP DATABASE EventM;
CREATE DATABASE EventM;
```

Then restart your application - it will recreate the schema and initialize data.

## 10. Test with Frontend

If the backend endpoints work, test with your React frontend:

1. Ensure your frontend is pointing to `http://localhost:8081`
2. Check browser console for errors
3. Verify CORS configuration is working

## 11. Debug Information

The enhanced application now includes:
- Detailed error logging
- Test endpoints for debugging
- Better validation messages
- Database connection health checks
- Fixed lazy loading issues
- Fixed circular reference issues

## 12. Event-Specific Testing

If events are still not working, test these specific scenarios:

```bash
# 1. Check if categories exist
curl http://localhost:8081/api/categories

# 2. Check if users exist (you'll need to implement this endpoint)
# or check the database directly

# 3. Try creating an event with valid data
curl -X POST http://localhost:8081/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "description": "Test Description",
    "startDate": "2024-12-25T10:00:00",
    "endDate": "2024-12-25T12:00:00",
    "location": "Test Location",
    "maxCapacity": 100,
    "ticketPrice": 25.0,
    "categoryId": 1
  }' \
  -G -d "organizerId=1"

# 4. Check if the event was created
curl http://localhost:8081/api/events/all
```

## Getting Help

If you're still experiencing issues:
1. Check the application logs for specific error messages
2. Test the health endpoint to identify the problem area
3. Use the test endpoints to isolate the issue
4. Verify your MySQL installation and configuration
5. Check if the specific error is related to events or general database issues

## Quick Commands

```bash
# Start application
mvn spring-boot:run

# Test health
curl http://localhost:8081/api/health

# Test category creation
curl -X POST http://localhost:8081/api/categories/test

# Test event creation
curl -X POST http://localhost:8081/api/events/test

# Test event fetching
curl http://localhost:8081/api/events/all

# Check logs (look for ERROR or WARN messages)
# The logs will be in your console where you started the application
```
