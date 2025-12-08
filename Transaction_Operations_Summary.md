# Transaction Operations Summary for BarberMatch

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## 📋 **Transaction Operations Organized by Category**

---

## 1. DATA ENTRY OPERATIONS (CREATE)

### 1.1 Booking

**TXN-004: CREATE_APPOINTMENT** ✅ *Create booking*
- **Purpose:** Create new appointment booking
- **Frequency:** Very High
- **Who Can Do It:** Customers
- **Constraints:**
  - Must be at least 2 hours in advance
  - Must not be more than 30 days in advance
  - No double-booking allowed
  - Must be within working hours
- **Input:** customer_id, barber_id, service_id, appointment_date, start_time, end_time, notes, total_price
- **Output:** Appointment ID, status='requested'
- **Business Rules:** RULE-020, RULE-021, RULE-022, RULE-023, RULE-024, RULE-026, RULE-031, RULE-032

### 1.2 User Registration

**TXN-001: CREATE_USER** ✅ *Register user*
- **Purpose:** Create new user account
- **Frequency:** High
- **Who Can Do It:** New users
- **Constraints:**
  - Email must be unique
  - Password must meet strength requirements (8+ chars, 1+ number)
  - Role must be 'customer' or 'barber'
- **Input:** email, password_hash, name, phone, location, role
- **Output:** User ID, confirmation message
- **Business Rules:** RULE-001, RULE-002, RULE-005

**TXN-002: CREATE_BARBER_PROFILE** (For barber registration)
- **Purpose:** Create barber business profile
- **Frequency:** Medium
- **Who Can Do It:** Barbers during onboarding
- **Input:** salon_name, business_address, city, state, postal_code, latitude, longitude, business_phone, business_email, business_license, working_hours, bio
- **Output:** Barber ID, confirmation message
- **Business Rules:** RULE-007, RULE-010, RULE-011, RULE-012, RULE-013

### 1.3 Service Management

**TXN-003: ADD_SERVICE** ✅ *Add service*
- **Purpose:** Add new service offering for barber
- **Frequency:** Medium
- **Who Can Do It:** Barbers
- **Constraints:**
  - Price must be greater than 0
  - Duration must be 15-240 minutes
  - Maximum 20 active services per barber
- **Input:** barber_id, category_id, service_name, description, category, price, duration_minutes
- **Output:** Service ID, confirmation message
- **Business Rules:** RULE-015, RULE-016, RULE-017, RULE-018

**TXN-008: BULK_INSERT_SERVICES**
- **Purpose:** Add multiple services for a barber
- **Frequency:** Low - Initial barber setup
- **Who Can Do It:** Barbers
- **Input:** Array of service data
- **Output:** Array of service IDs
- **Business Rules:** RULE-015, RULE-016, RULE-017, RULE-018

### 1.4 Portfolio

**TXN-006: UPLOAD_PORTFOLIO** ✅ *Add portfolio item*
- **Purpose:** Upload barber portfolio image
- **Frequency:** Low
- **Who Can Do It:** Barbers
- **Constraints:**
  - Maximum 20 images per barber
  - File formats: JPG, PNG, WebP
  - Maximum 5MB per image
- **Input:** barber_id, image_url, image_type, title, description, service_category, is_featured
- **Output:** Portfolio ID, confirmation message
- **Business Rules:** RULE-044, RULE-045, RULE-046, RULE-047, RULE-048

### 1.5 Reviews

**TXN-005: CREATE_REVIEW** ✅ *Submit review*
- **Purpose:** Submit customer review after completed appointment
- **Frequency:** Medium
- **Who Can Do It:** Customers (who completed appointments)
- **Constraints:**
  - Only for completed appointments
  - One review per appointment
  - Must be within 7 days of completion
  - Rating must be 1-5 stars
- **Input:** appointment_id, customer_id, barber_id, rating, review_text
- **Output:** Review ID, confirmation message
- **Business Rules:** RULE-035, RULE-036, RULE-037, RULE-038, RULE-039

### 1.6 Additional

**TXN-007: ADD_FAVORITE**
- **Purpose:** Add barber to customer favorites
- **Who Can Do It:** Customers
- **Input:** customer_id, barber_id
- **Output:** Favorite ID, confirmation message

---

## 2. DATA UPDATE/DELETE OPERATIONS

### 2.1 Appointment Rescheduling

**TXN-014: CANCEL_APPOINTMENT_CUSTOMER** ✅ *Reschedule booking (via cancel + rebook)*
- **Purpose:** Customer cancels appointment
- **Frequency:** Medium
- **Who Can Do It:** Customers
- **Constraints:**
  - Must be at least 2 hours before appointment
  - Cannot cancel completed appointments
- **Input:** appointment_id, cancellation_reason (optional)
- **Output:** Status='cancelled', notification sent
- **Business Rules:** RULE-028, RULE-030

**Note:** Rescheduling is typically done by cancelling the existing appointment and creating a new one with different time.

**TXN-015: CANCEL_APPOINTMENT_BARBER**
- **Purpose:** Barber cancels appointment
- **Frequency:** Low
- **Who Can Do It:** Barbers
- **Constraints:**
  - Must be at least 1 hour before appointment
  - Cannot cancel completed appointments
- **Business Rules:** RULE-029, RULE-030

### 2.2 Profile Modifications

**TXN-009: UPDATE_USER_PROFILE** ✅ *Modify profile*
- **Purpose:** Update user profile information
- **Frequency:** Medium
- **Who Can Do It:** Users (own profile only)
- **Constraints:**
  - Users can only update own profile
  - Email cannot be changed
  - Role cannot be changed
- **Input:** user_id, name, phone, location, profile_image_url
- **Output:** Updated profile data
- **Business Rules:** RULE-008, RULE-009

**TXN-010: UPDATE_BARBER_PROFILE**
- **Purpose:** Update barber business information
- **Frequency:** Medium
- **Who Can Do It:** Barbers
- **Constraints:**
  - Cannot delete profile with pending appointments
  - Salon name must remain unique per city
- **Input:** barber_id, salon_name, business_address, city, state, postal_code, business_phone, bio
- **Output:** Updated barber profile
- **Business Rules:** RULE-007, RULE-011, RULE-014

### 2.3 Service Updates

**TXN-011: UPDATE_SERVICE** ✅ *Update services*
- **Purpose:** Update service details
- **Frequency:** Medium
- **Who Can Do It:** Barbers
- **Constraints:**
  - Cannot delete if has future appointments
  - Price must remain positive
- **Input:** service_id, service_name, description, category, price, duration_minutes, is_active
- **Output:** Updated service data
- **Business Rules:** RULE-015, RULE-016, RULE-017, RULE-019

**TXN-019: ACTIVATE_DEACTIVATE_SERVICE**
- **Purpose:** Toggle service availability
- **Frequency:** Medium
- **Who Can Do It:** Barbers
- **Constraints:**
  - Cannot deactivate service with future appointments
- **Input:** service_id, is_active flag
- **Output:** Updated service status
- **Business Rules:** RULE-019

### 2.4 Review Modifications

**Note:** ⚠️ Reviews are **append-only** per Business Rule RULE-040
- Customers CANNOT edit reviews after submission
- Reviews CANNOT be deleted by customers
- Only administrators can remove flagged reviews (RULE-043)

**However, there is NO direct transaction for editing reviews** because:
- **RULE-040:** Reviews cannot be edited after submission
- **RULE-041:** Reviews cannot be deleted by customers
- Reviews are meant to be permanent for data integrity

**Admin-Only Operation:**
- **TXN-025:** DELETE_REVIEW (Moderate inappropriate content)
- **Frequency:** Low
- **Who Can Do It:** Administrators only
- **Business Rule:** RULE-043

### 2.5 Delete Operations

**TXN-021: SOFT_DELETE_USER**
- **Purpose:** Mark user account as inactive
- **Frequency:** Low
- **Who Can Do It:** Administrators
- **Business Rules:** RULE-057

**TXN-022: SOFT_DELETE_BARBER**
- **Purpose:** Mark barber profile as inactive
- **Frequency:** Low
- **Who Can Do It:** Administrators
- **Business Rules:** RULE-014, RULE-057

**TXN-023: SOFT_DELETE_SERVICE**
- **Purpose:** Mark service as inactive
- **Frequency:** Medium
- **Who Can Do It:** Barbers
- **Business Rules:** RULE-019, RULE-057

**TXN-024: DELETE_FAVORITE**
- **Purpose:** Remove barber from favorites
- **Who Can Do It:** Customers

**TXN-025: DELETE_PORTFOLIO_IMAGE**
- **Purpose:** Delete portfolio image
- **Who Can Do It:** Barbers (own images only)

---

## 3. DATA RETRIEVAL OPERATIONS (SELECT)

### 3.1 Barber Search

**TXN-031: SEARCH_BARBERS_BY_LOCATION** ✅ *Search barbers*
- **Purpose:** Find barbers near customer location
- **Frequency:** Very High
- **Who Can Use:** All users
- **Output Data:** barber_id, salon_name, city, state, distance, average_rating, total_reviews
- **Performance:** < 200ms
- **Business Rules:** RULE-052

**TXN-032: FILTER_BARBERS_BY_RATING**
- **Purpose:** Filter barbers by minimum rating
- **Frequency:** High
- **Output Data:** Barber list with ratings >= minimum_rating
- **Performance:** < 150ms

**TXN-033: FILTER_BARBERS_BY_SERVICE**
- **Purpose:** Find barbers offering specific services
- **Frequency:** High
- **Output Data:** Barber list with matching services
- **Performance:** < 200ms

**TXN-051: SEARCH_BARBERS**
- **Purpose:** Full-text search across barber profiles
- **Frequency:** High
- **Output Data:** Barber list matching search term
- **Performance:** < 200ms

**TXN-034: GET_BARBER_PROFILE**
- **Purpose:** Retrieve complete barber profile
- **Frequency:** High
- **Output Data:** All barber fields + services + portfolio + reviews
- **Performance:** < 300ms

### 3.2 Availability and Scheduling

**TXN-042: CHECK_APPOINTMENT_AVAILABILITY** ✅ *View available slots*
- **Purpose:** Verify time slot availability
- **Frequency:** Very High - Before booking
- **Who Can Use:** All users
- **Constraints:**
  - Check for conflicts with existing appointments
  - Check against barber's working hours
- **Output Data:** Available time slots or conflict message
- **Performance:** < 50ms
- **Business Rules:** RULE-024, RULE-031, RULE-032

**TXN-041: GET_APPOINTMENTS_BY_DATE**
- **Purpose:** Retrieve appointments for specific date
- **Frequency:** High
- **Output Data:** Appointments for date with time slots
- **Performance:** < 100ms

**TXN-040: GET_APPOINTMENTS_BY_STATUS**
- **Purpose:** Filter appointments by status
- **Frequency:** High
- **Output Data:** Appointment list filtered by status
- **Performance:** < 100ms

### 3.3 Reports and Analytics

**TXN-045: GET_BARBER_STATISTICS** ✅ *Generate reports*
- **Purpose:** Calculate barber performance metrics
- **Frequency:** Medium
- **Who Can Use:** Barbers, Administrators
- **Output Data:** Total bookings, completion rate, revenue, average rating, popular services
- **Performance:** < 500ms
- **Includes:** Revenue, bookings, ratings, service popularity

**TXN-046: GET_REVENUE_REPORT**
- **Purpose:** Generate revenue reports
- **Frequency:** Low
- **Who Can Use:** Administrators, Barbers
- **Output Data:** Revenue by date, service, customer segment
- **Performance:** < 2000ms

**TXN-044: CALCULATE_AVERAGE_RATING**
- **Purpose:** Compute barber's average rating from reviews
- **Frequency:** Medium
- **Output Data:** average_rating, total_reviews
- **Performance:** < 200ms

**TXN-047: GET_CUSTOMER_ANALYTICS**
- **Purpose:** Analyze customer behavior
- **Frequency:** Low
- **Output Data:** Booking frequency, lifetime value, preferred services
- **Performance:** < 2000ms

**TXN-048: GET_POPULAR_SERVICES**
- **Purpose:** Identify most requested services
- **Frequency:** Low
- **Output Data:** Service ranking by booking count, revenue
- **Performance:** < 1000ms

**TXN-049: GET_RATING_TRENDS**
- **Purpose:** Track rating changes over time
- **Frequency:** Low
- **Output Data:** Rating trends over time period
- **Performance:** < 2000ms

**TXN-050: COUNT_APPOINTMENTS**
- **Purpose:** Count appointments by criteria
- **Frequency:** High
- **Output Data:** Count by status, date range, barber
- **Performance:** < 100ms

### 3.4 Booking History

**TXN-038: GET_CUSTOMER_APPOINTMENTS** ✅ *List completed bookings*
- **Purpose:** Retrieve customer's appointment history
- **Frequency:** Very High
- **Who Can Use:** Customers
- **Output Data:** Appointments with barber details, service details
- **Performance:** < 200ms
- **Includes:** Past and future bookings, completed appointments
- **Business Rules:** RULE-051

**TXN-039: GET_BARBER_APPOINTMENTS**
- **Purpose:** Retrieve barber's appointment schedule
- **Frequency:** Very High
- **Who Can Use:** Barbers
- **Output Data:** Appointments with customer details, service details
- **Performance:** < 200ms
- **Includes:** Complete schedule history
- **Business Rules:** RULE-050

**TXN-043: GET_UPCOMING_APPOINTMENTS**
- **Purpose:** Retrieve future appointments
- **Frequency:** High
- **Output Data:** Future appointments list with details
- **Performance:** < 150ms

### 3.5 Service Information

**TXN-035: GET_BARBER_SERVICES**
- **Purpose:** Retrieve all services for a barber
- **Frequency:** High
- **Output Data:** Service list for barber_id (active only)
- **Performance:** < 100ms

**TXN-036: GET_BARBER_PORTFOLIO**
- **Purpose:** Retrieve barber's portfolio images
- **Frequency:** High
- **Output Data:** Portfolio images array (max 20)
- **Performance:** < 200ms

**TXN-037: GET_BARBER_REVIEWS**
- **Purpose:** Retrieve barber's reviews and ratings
- **Frequency:** High
- **Output Data:** Reviews array with ratings, ordered by date
- **Performance:** < 200ms

---

## 📊 **Summary Table**

| Operation Type | Your Requested Operation | Transaction Code | Frequency | User Role |
|----------------|-------------------------|------------------|-----------|-----------|
| **Data Entry** | Create booking | TXN-004: CREATE_APPOINTMENT | Very High | Customer |
| **Data Entry** | Register user | TXN-001: CREATE_USER | High | All |
| **Data Entry** | Add service | TXN-003: ADD_SERVICE | Medium | Barber |
| **Data Entry** | Add portfolio item | TXN-006: UPLOAD_PORTFOLIO | Low | Barber |
| **Data Entry** | Submit review | TXN-005: CREATE_REVIEW | Medium | Customer |
| **Data Update** | Reschedule booking | TXN-014: CANCEL + TXN-004 | Medium | Customer |
| **Data Update** | Modify profile | TXN-009: UPDATE_USER_PROFILE | Medium | User |
| **Data Update** | Update services | TXN-011: UPDATE_SERVICE | Medium | Barber |
| **Data Update** | Edit reviews | ❌ **NOT ALLOWED** | - | - |
| **Data Retrieval** | Search barbers | TXN-031: SEARCH_BARBERS_BY_LOCATION | Very High | All |
| **Data Retrieval** | View available slots | TXN-042: CHECK_APPOINTMENT_AVAILABILITY | Very High | All |
| **Data Retrieval** | Generate reports | TXN-045: GET_BARBER_STATISTICS | Medium | Barber/Admin |
| **Data Retrieval** | List completed bookings | TXN-038: GET_CUSTOMER_APPOINTMENTS | Very High | Customer |

---

## ⚠️ **Important Notes**

### **Reviews Cannot Be Edited**
- **RULE-040:** Reviews cannot be edited after submission
- **RULE-041:** Reviews cannot be deleted by customers
- Reviews are designed to be permanent for data integrity
- Only administrators can remove flagged/inappropriate reviews (RULE-043)

### **Rescheduling Process**
- There is no direct "reschedule" transaction
- Instead: Customer cancels old appointment (TXN-014) + creates new appointment (TXN-004)
- System maintains complete history of changes

### **Profile Updates Are Restricted**
- Users can only modify their own profiles (RULE-009)
- Email and role cannot be changed after registration (RULE-001, RULE-004)

### **High-Frequency Transactions**
The most frequently used transactions are:
1. **TXN-042:** CHECK_APPOINTMENT_AVAILABILITY (< 50ms)
2. **TXN-004:** CREATE_APPOINTMENT
3. **TXN-031:** SEARCH_BARBERS_BY_LOCATION
4. **TXN-038:** GET_CUSTOMER_APPOINTMENTS
5. **TXN-039:** GET_BARBER_APPOINTMENTS

These require optimal performance and caching strategies.

---

*This summary extracts the specific transactions you requested from the complete Section 9 document.*

