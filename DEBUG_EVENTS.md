# Event Creation Debug Guide

## Current Issue
Users are working properly, but events are still giving HTTP 400 (Bad Request) errors.

## Debug Steps

### Step 1: Check Application Status
```bash
# Test health endpoint
curl http://localhost:8081/api/health
```

### Step 2: Check Available Data
```bash
# Check if categories exist
curl http://localhost:8081/api/categories

# Check if users exist
curl http://localhost:8081/api/users

# Check if any events exist (this will show published events only)
curl http://localhost:8081/api/events/all

# Check debug endpoint for events (shows all events regardless of status)
curl http://localhost:8081/api/events/debug
```

### Step 3: Test Event Creation Step by Step

#### 3.1 Test with Test Endpoint
```bash
# Use the test endpoint that creates a hardcoded event
curl -X POST http://localhost:8081/api/events/test
```

#### 3.2 Test Manual Event Creation
```bash
# Create an event manually with valid data
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
```

### Step 4: Check Application Logs
Look in your console where you started `mvn spring-boot:run` for:
- SQL queries being executed
- Validation errors
- Exception details
- Any error messages

### Step 5: Verify Database State
Connect to your MySQL database and check:

```sql
USE EventM;

-- Check if tables exist
SHOW TABLES;

-- Check categories
SELECT * FROM categories;

-- Check users
SELECT * FROM users;

-- Check events
SELECT * FROM events;

-- Check event_registrations
SELECT * FROM event_registrations;
```

## Common Issues and Solutions

### Issue 1: Missing Category
**Symptoms:** "Category not found with ID: X" error
**Solution:** Ensure categories exist in the database

### Issue 2: Missing User/Organizer
**Symptoms:** "Organizer not found with ID: X" error
**Solution:** Ensure users exist in the database

### Issue 3: Date Validation
**Symptoms:** "Start date cannot be in the past" error
**Solution:** Use future dates in ISO 8601 format

### Issue 4: Validation Constraints
**Symptoms:** Field validation errors
**Solution:** Check all required fields and constraints

## Expected Database State

### Categories Table
Should contain at least one category with ID 1:
```sql
INSERT INTO categories (name, description, icon, color) 
VALUES ('Test Category', 'Test Description', '🧪', '#FF0000');
```

### Users Table
Should contain at least one user with ID 1:
```sql
INSERT INTO users (username, email, password, first_name, last_name, role, is_active) 
VALUES ('testuser', 'test@example.com', 'password123', 'Test', 'User', 'USER', true);
```

## Test Data Setup

If you need to set up test data:

```sql
-- Insert test category
INSERT INTO categories (name, description, icon, color) 
VALUES ('Test Category', 'Test Description', '🧪', '#FF0000');

-- Insert test user
INSERT INTO users (username, email, password, first_name, last_name, role, is_active) 
VALUES ('testuser', 'test@example.com', 'password123', 'Test', 'User', 'USER', true);
```

## Debug Endpoints Available

1. **`/api/health`** - Overall application and database health
2. **`/api/categories`** - List all categories
3. **`/api/users`** - List all users
4. **`/api/events/all`** - List published events only
5. **`/api/events/debug`** - Debug information about events
6. **`/api/events/test`** - Test event creation with hardcoded data

## Next Steps

1. Run the debug endpoints to see what data exists
2. Check the application logs for specific error messages
3. Verify database state matches expected structure
4. Test with the test endpoint first
5. Then test with manual event creation

## If Still Getting 400 Errors

1. **Check the exact error message** in the response body
2. **Look at application logs** for detailed error information
3. **Verify all required data exists** (categories, users)
4. **Check validation constraints** (dates, field lengths, etc.)
5. **Test with minimal data** using the test endpoint

## Quick Test Commands

```bash
# 1. Health check
curl http://localhost:8081/api/health

# 2. Check categories
curl http://localhost:8081/api/categories

# 3. Check users
curl http://localhost:8081/api/users

# 4. Test event creation
curl -X POST http://localhost:8081/api/events/test

# 5. Check debug info
curl http://localhost:8081/api/events/debug
```

Run these commands in order and let me know what you see at each step!
