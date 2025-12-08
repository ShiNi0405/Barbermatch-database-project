# Section 9: Transaction Requirements

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## 9.0 Transaction Requirements

Transaction requirements define all data operations the system must support, including data entry, updates, deletions, and queries. These operations ensure the database can handle all business processes defined in the business rules.

---

## 9.1 Data Entry Operations (INSERT)

### 9.1.1 User Management Data Entry

#### **TXN-001: CREATE_USER**
**Description:** Create new user account  
**Frequency:** High - Every new user registration  
**Constraints:** 
- Email must be unique (RULE-001)
- Password must meet strength requirements (RULE-005)
- Role must be 'customer' or 'barber' (RULE-002)
**Input Data:**
- Email, password_hash, name, phone, location, role
**Output:** User ID, confirmation message  
**Business Rule:** RULE-001, RULE-002, RULE-005

#### **TXN-002: CREATE_BARBER_PROFILE**
**Description:** Create barber business profile  
**Frequency:** Medium - When barber completes onboarding  
**Constraints:**
- Salon name must be unique per city (RULE-011)
- Must provide address, phone, working hours (RULE-007)
**Input Data:**
- salon_name, business_address, city, state, postal_code, latitude, longitude, business_phone, business_email, business_license, working_hours, bio, experience_years
**Output:** Barber ID, confirmation message  
**Business Rule:** RULE-007, RULE-010, RULE-011, RULE-012, RULE-013

#### **TXN-003: ADD_SERVICE**
**Description:** Add new service offering for barber  
**Frequency:** Medium - When barber adds new services  
**Constraints:**
- Price must be greater than 0 (RULE-016)
- Duration must be 15-240 minutes (RULE-017)
- Maximum 20 active services (RULE-018)
**Input Data:**
- barber_id, category_id, service_name, description, category, price, duration_minutes
**Output:** Service ID, confirmation message  
**Business Rule:** RULE-015, RULE-016, RULE-017, RULE-018

### 9.1.2 Appointment Management Data Entry

#### **TXN-004: CREATE_APPOINTMENT**
**Description:** Create new appointment booking  
**Frequency:** High - Every booking request  
**Constraints:**
- Must be at least 2 hours in advance (RULE-021)
- Must not be more than 30 days in advance (RULE-022)
- No double-booking allowed (RULE-031)
- Must be within working hours (RULE-024)
**Input Data:**
- customer_id, barber_id, service_id, appointment_date, start_time, end_time, notes, total_price
**Output:** Appointment ID, status='requested', confirmation message  
**Business Rule:** RULE-020, RULE-021, RULE-022, RULE-023, RULE-024, RULE-026, RULE-031, RULE-032

#### **TXN-005: CREATE_REVIEW**
**Description:** Submit customer review after completed appointment  
**Frequency:** Medium - After completed appointments  
**Constraints:**
- Only for completed appointments (RULE-035)
- One review per appointment (RULE-036)
- Must be within 7 days of completion (RULE-037)
- Rating must be 1-5 (RULE-038)
**Input Data:**
- appointment_id, customer_id, barber_id, rating, review_text
**Output:** Review ID, confirmation message  
**Business Rule:** RULE-035, RULE-036, RULE-037, RULE-038, RULE-039

### 9.1.3 Content Management Data Entry

#### **TXN-006: UPLOAD_PORTFOLIO**
**Description:** Upload barber portfolio image  
**Frequency:** Low - When barber adds portfolio images  
**Constraints:**
- Maximum 20 images (RULE-045)
- File formats: JPG, PNG, WebP (RULE-046)
- Maximum 5MB per image (RULE-047)
**Input Data:**
- barber_id, image_url, image_type, title, description, service_category, is_featured
**Output:** Portfolio ID, confirmation message  
**Business Rule:** RULE-044, RULE-045, RULE-046, RULE-047, RULE-048

#### **TXN-007: ADD_FAVORITE**
**Description:** Add barber to customer favorites  
**Frequency:** Medium - When customer favorites a barber  
**Constraints:**
- Unique (customer_id, barber_id) combination
**Input Data:**
- customer_id, barber_id
**Output:** Favorite ID, confirmation message  
**Business Rule:** (Data integrity constraint)

#### **TXN-008: BULK_INSERT_SERVICES**
**Description:** Add multiple services for a barber  
**Frequency:** Low - Initial barber setup  
**Constraints:**
- Same as ADD_SERVICE
- Transaction rollback if any service fails validation
**Input Data:**
- Array of service data (barber_id, service_name, description, category, price, duration_minutes)
**Output:** Array of service IDs, success/failure status  
**Business Rule:** RULE-015, RULE-016, RULE-017, RULE-018

---

## 9.2 Data Update Operations (UPDATE)

### 9.2.1 Profile Management Updates

#### **TXN-009: UPDATE_USER_PROFILE**
**Description:** Update user profile information  
**Frequency:** Medium - When user updates their profile  
**Constraints:**
- Users can only update own profile (RULE-009)
- Email cannot be changed (RULE-001)
- Role cannot be changed (RULE-004)
**Input Data:**
- user_id, name, phone, location, profile_image_url
**Output:** Updated profile data, confirmation message  
**Business Rule:** RULE-008, RULE-009

#### **TXN-010: UPDATE_BARBER_PROFILE**
**Description:** Update barber business information  
**Frequency:** Medium - When barber updates business info  
**Constraints:**
- Cannot delete profile with pending appointments (RULE-014)
- Salon name must remain unique per city
**Input Data:**
- barber_id, salon_name, business_address, city, state, postal_code, latitude, longitude, business_phone, bio, experience_years
**Output:** Updated barber profile, confirmation message  
**Business Rule:** RULE-007, RULE-011, RULE-014

#### **TXN-011: UPDATE_SERVICE**
**Description:** Update service details  
**Frequency:** Medium - When barber changes service info  
**Constraints:**
- Cannot delete if has future appointments (RULE-019)
- Price must remain positive (RULE-016)
**Input Data:**
- service_id, service_name, description, category, price, duration_minutes, is_active
**Output:** Updated service data, confirmation message  
**Business Rule:** RULE-015, RULE-016, RULE-017, RULE-019

### 9.2.2 Appointment Status Updates

#### **TXN-012: CONFIRM_APPOINTMENT**
**Description:** Barber confirms appointment request  
**Frequency:** High - Barber response to booking  
**Constraints:**
- Only barbers can confirm (RULE-027)
- Must check for conflicts
**Input Data:**
- appointment_id
**Output:** Status='confirmed', confirmed_at timestamp, notification sent  
**Business Rule:** RULE-027

#### **TXN-013: REJECT_APPOINTMENT**
**Description:** Barber rejects appointment request  
**Frequency:** Medium - Barber declines booking  
**Constraints:**
- Only barbers can reject (RULE-027)
**Input Data:**
- appointment_id, rejection_reason (optional)
**Output:** Status='rejected', notification sent  
**Business Rule:** RULE-027

#### **TXN-014: CANCEL_APPOINTMENT_CUSTOMER**
**Description:** Customer cancels appointment  
**Frequency:** Medium - Customer cancellation  
**Constraints:**
- Must be at least 2 hours before appointment (RULE-028)
- Cannot cancel completed appointments (RULE-030)
**Input Data:**
- appointment_id, cancellation_reason (optional)
**Output:** Status='cancelled', notification sent  
**Business Rule:** RULE-028, RULE-030

#### **TXN-015: CANCEL_APPOINTMENT_BARBER**
**Description:** Barber cancels appointment  
**Frequency:** Low - Barber cancellation  
**Constraints:**
- Must be at least 1 hour before appointment (RULE-029)
- Cannot cancel completed appointments (RULE-030)
**Input Data:**
- appointment_id, cancellation_reason (optional)
**Output:** Status='cancelled', notification sent  
**Business Rule:** RULE-029, RULE-030

#### **TXN-016: COMPLETE_APPOINTMENT**
**Description:** Mark appointment as completed  
**Frequency:** High - After service completion  
**Constraints:**
- Only barber can complete (RULE-035)
- Records completion timestamp
- Enables review submission
**Input Data:**
- appointment_id
**Output:** Status='completed', completed_at timestamp, notification sent  
**Business Rule:** RULE-030, RULE-035

### 9.2.3 Availability Management Updates

#### **TXN-017: UPDATE_WORKING_HOURS**
**Description:** Modify barber availability  
**Frequency:** Medium - When barber changes schedule  
**Constraints:**
- Must not conflict with existing confirmed appointments
- Must be valid JSON structure
**Input Data:**
- barber_id, working_hours (JSON)
**Output:** Updated working hours, confirmation message  
**Business Rule:** RULE-012

#### **TXN-018: BLOCK_TIME_SLOT**
**Description:** Mark time slot as unavailable  
**Frequency:** Low - When barber needs to block time  
**Constraints:**
- Cannot block time with confirmed appointments
**Input Data:**
- barber_id, start_time, end_time, reason
**Output:** Blocked time slot, confirmation message  
**Business Rule:** RULE-012

### 9.2.4 Status Updates

#### **TXN-019: ACTIVATE_DEACTIVATE_SERVICE**
**Description:** Toggle service availability  
**Frequency:** Medium - When barber disables/enables services  
**Constraints:**
- Cannot deactivate service with future appointments
**Input Data:**
- service_id, is_active flag
**Output:** Updated service status, confirmation message  
**Business Rule:** RULE-019

#### **TXN-020: EXPIRE_APPOINTMENT_REQUEST**
**Description:** Auto-expire booking requests after 24 hours  
**Frequency:** Low - Automated background process  
**Constraints:**
- Must be exactly 24 hours old
- Status must be 'requested'
**Input Data:**
- Current timestamp
**Output:** Status='expired', notification sent  
**Business Rule:** RULE-025

---

## 9.3 Data Delete Operations (DELETE)

### 9.3.1 Soft Delete Operations (Preserve History)

#### **TXN-021: SOFT_DELETE_USER**
**Description:** Mark user account as inactive  
**Frequency:** Low - Account deactivation  
**Constraints:**
- Cannot delete if has pending appointments
- Preserves all historical data
**Input Data:**
- user_id
**Output:** is_active=false, confirmation message  
**Business Rule:** RULE-057

#### **TXN-022: SOFT_DELETE_BARBER**
**Description:** Mark barber profile as inactive  
**Frequency:** Low - Barber account closure  
**Constraints:**
- Cannot delete with pending appointments (RULE-014)
**Input Data:**
- barber_id
**Output:** is_active=false, confirmation message  
**Business Rule:** RULE-014, RULE-057

#### **TXN-023: SOFT_DELETE_SERVICE**
**Description:** Mark service as inactive  
**Frequency:** Medium - When barber discontinues service  
**Constraints:**
- Cannot delete if has future appointments (RULE-019)
**Input Data:**
- service_id
**Output:** is_active=false, confirmation message  
**Business Rule:** RULE-019, RULE-057

### 9.3.2 Hard Delete Operations (Remove Data)

#### **TXN-024: DELETE_FAVORITE**
**Description:** Remove barber from favorites  
**Frequency:** Medium - Customer removes favorite  
**Constraints:**
- Must be authenticated customer
**Input Data:**
- favorite_id OR customer_id + barber_id
**Output:** Confirmation message  
**Business Rule:** (No specific rule)

#### **TXN-025: DELETE_PORTFOLIO_IMAGE**
**Description:** Delete portfolio image  
**Frequency:** Low - Barber removes image  
**Constraints:**
- Can only delete own images
**Input Data:**
- portfolio_id
**Output:** Confirmation message  
**Business Rule:** RULE-044

#### **TXN-026: DELETE_DRAFT_APPOINTMENT**
**Description:** Delete unconfirmed/expired appointments  
**Frequency:** Low - Cleanup old draft appointments  
**Constraints:**
- Must be older than 30 days
- Status must be 'requested', 'expired', or 'cancelled'
**Input Data:**
- Older_than_date
**Output:** Number of deleted records, confirmation  
**Business Rule:** RULE-025

---

## 9.4 Data Query Operations (SELECT)

### 9.4.1 Authentication Queries

#### **TXN-027: AUTHENTICATE_USER**
**Description:** Verify user login credentials  
**Frequency:** Very High - Every login attempt  
**Output Data:**
- user_id, role, is_verified, is_active
**Performance:** Must complete in < 50ms  
**Business Rule:** RULE-003

#### **TXN-028: GET_USER_BY_EMAIL**
**Description:** Retrieve user by email address  
**Frequency:** High - Login, password recovery  
**Output Data:**
- All user profile fields
**Performance:** Must complete in < 50ms  
**Business Rule:** RULE-001

#### **TXN-029: GET_USER_PROFILE**
**Description:** Retrieve complete user profile  
**Frequency:** High - Profile display  
**Output Data:**
- User fields + related barber profile (if applicable)
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-006

#### **TXN-030: CHECK_USER_ROLE**
**Description:** Verify user role for access control  
**Frequency:** High - Authorization checks  
**Output Data:**
- role, permissions
**Performance:** Must complete in < 10ms  
**Business Rule:** RULE-002, RULE-049

### 9.4.2 Barber Discovery Queries

#### **TXN-031: SEARCH_BARBERS_BY_LOCATION**
**Description:** Find barbers near customer location  
**Frequency:** Very High - Search functionality  
**Output Data:**
- barber_id, salon_name, city, state, distance, average_rating, total_reviews
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-052

#### **TXN-032: FILTER_BARBERS_BY_RATING**
**Description:** Filter barbers by minimum rating  
**Frequency:** High - Search filtering  
**Output Data:**
- Barber list with ratings >= minimum_rating
**Performance:** Must complete in < 150ms  
**Business Rule:** RULE-052

#### **TXN-033: FILTER_BARBERS_BY_SERVICE**
**Description:** Find barbers offering specific services  
**Frequency:** High - Service-based search  
**Output Data:**
- Barber list with matching services
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-052

#### **TXN-034: GET_BARBER_PROFILE**
**Description:** Retrieve complete barber profile  
**Frequency:** High - Profile display  
**Output Data:**
- All barber fields + services + portfolio + reviews
**Performance:** Must complete in < 300ms  
**Business Rule:** RULE-052

#### **TXN-035: GET_BARBER_SERVICES**
**Description:** Retrieve all services for a barber  
**Frequency:** High - Service listing  
**Output Data:**
- Service list for barber_id (active only)
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-052

#### **TXN-036: GET_BARBER_PORTFOLIO**
**Description:** Retrieve barber's portfolio images  
**Frequency:** High - Portfolio gallery  
**Output Data:**
- Portfolio images array (max 20)
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-052

#### **TXN-037: GET_BARBER_REVIEWS**
**Description:** Retrieve barber's reviews and ratings  
**Frequency:** High - Review display  
**Output Data:**
- Reviews array with ratings, ordered by date
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-052

### 9.4.3 Appointment Management Queries

#### **TXN-038: GET_CUSTOMER_APPOINTMENTS**
**Description:** Retrieve customer's appointment history  
**Frequency:** Very High - Appointment listing  
**Output Data:**
- Appointments with barber details, service details
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-051

#### **TXN-039: GET_BARBER_APPOINTMENTS**
**Description:** Retrieve barber's appointment schedule  
**Frequency:** Very High - Schedule management  
**Output Data:**
- Appointments with customer details, service details
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-050

#### **TXN-040: GET_APPOINTMENTS_BY_STATUS**
**Description:** Filter appointments by status  
**Frequency:** High - Status filtering  
**Output Data:**
- Appointment list filtered by status
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-049, RULE-050

#### **TXN-041: GET_APPOINTMENTS_BY_DATE**
**Description:** Retrieve appointments for specific date  
**Frequency:** High - Daily schedule view  
**Output Data:**
- Appointments for date with time slots
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-050

#### **TXN-042: CHECK_APPOINTMENT_AVAILABILITY**
**Description:** Verify time slot availability  
**Frequency:** Very High - Before booking  
**Constraints:**
- Check for conflicts with existing appointments
- Check against barber's working hours
**Output Data:**
- Available time slots or conflict message
**Performance:** Must complete in < 50ms  
**Business Rule:** RULE-024, RULE-031, RULE-032

#### **TXN-043: GET_UPCOMING_APPOINTMENTS**
**Description:** Retrieve future appointments  
**Frequency:** High - Calendar and notifications  
**Output Data:**
- Future appointments list with details
**Performance:** Must complete in < 150ms  
**Business Rule:** RULE-049, RULE-050

### 9.4.4 Analytics & Reporting Queries

#### **TXN-044: CALCULATE_AVERAGE_RATING**
**Description:** Compute barber's average rating from reviews  
**Frequency:** Medium - Rating updates  
**Output Data:**
- average_rating, total_reviews
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-038

#### **TXN-045: GET_BARBER_STATISTICS**
**Description:** Calculate barber performance metrics  
**Frequency:** Medium - Analytics dashboard  
**Output Data:**
- Total bookings, completion rate, revenue, average rating, popular services
**Performance:** Must complete in < 500ms  
**Business Rule:** (Derived metrics)

#### **TXN-046: GET_REVENUE_REPORT**
**Description:** Generate revenue reports  
**Frequency:** Low - Monthly reporting  
**Output Data:**
- Revenue by date, service, customer segment
**Performance:** Must complete in < 2000ms  
**Business Rule:** (Reporting requirement)

#### **TXN-047: GET_CUSTOMER_ANALYTICS**
**Description:** Analyze customer behavior  
**Frequency:** Low - Customer analytics  
**Output Data:**
- Booking frequency, lifetime value, preferred services
**Performance:** Must complete in < 2000ms  
**Business Rule:** (Analytics requirement)

#### **TXN-048: GET_POPULAR_SERVICES**
**Description:** Identify most requested services  
**Frequency:** Low - Service analytics  
**Output Data:**
- Service ranking by booking count, revenue
**Performance:** Must complete in < 1000ms  
**Business Rule:** (Analytics requirement)

#### **TXN-049: GET_RATING_TRENDS**
**Description:** Track rating changes over time  
**Frequency:** Low - Rating analytics  
**Output Data:**
- Rating trends over time period
**Performance:** Must complete in < 2000ms  
**Business Rule:** (Analytics requirement)

#### **TXN-050: COUNT_APPOINTMENTS**
**Description:** Count appointments by criteria  
**Frequency:** High - Dashboard statistics  
**Output Data:**
- Count by status, date range, barber
**Performance:** Must complete in < 100ms  
**Business Rule:** (Statistics requirement)

### 9.4.5 Search & Filter Queries

#### **TXN-051: SEARCH_BARBERS**
**Description:** Full-text search across barber profiles  
**Frequency:** High - Search functionality  
**Output Data:**
- Barber list matching search term
**Performance:** Must complete in < 200ms  
**Business Rule:** RULE-052

#### **TXN-052: SEARCH_SERVICES**
**Description:** Search for specific services  
**Frequency:** Medium - Service search  
**Output Data:**
- Service list matching search term
**Performance:** Must complete in < 150ms  
**Business Rule:** RULE-052

#### **TXN-053: FILTER_BY_PRICE_RANGE**
**Description:** Filter services by price  
**Frequency:** Medium - Filter functionality  
**Output Data:**
- Services within price range
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-052

#### **TXN-054: FILTER_BY_DURATION**
**Description:** Filter services by duration  
**Frequency:** Medium - Filter functionality  
**Output Data:**
- Services within duration range
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-052

#### **TXN-055: FILTER_BY_CATEGORY**
**Description:** Filter services by category  
**Frequency:** Medium - Filter functionality  
**Output Data:**
- Services in category
**Performance:** Must complete in < 100ms  
**Business Rule:** RULE-052

### 9.4.6 Complex Query Operations

#### **TXN-056: GET_APPOINTMENT_DETAILS**
**Description:** Join appointments with customer, barber, and service data  
**Frequency:** High - Detailed appointment view  
**Output Data:**
- Complete appointment with all related data
**Performance:** Must complete in < 200ms  
**Join Complexity:** 4 tables (appointments, users, barbers, services)  
**Business Rule:** RULE-050, RULE-051

#### **TXN-057: GET_BARBER_WITH_STATS**
**Description:** Join barber profile with statistics  
**Frequency:** High - Barber profile page  
**Output Data:**
- Barber profile + aggregated statistics
**Performance:** Must complete in < 300ms  
**Join Complexity:** 3 tables + aggregations

#### **TXN-058: GET_CUSTOMER_HISTORY**
**Description:** Join customer with appointment and review history  
**Frequency:** Medium - Customer profile  
**Output Data:**
- Customer + all appointments + reviews
**Performance:** Must complete in < 400ms  
**Join Complexity:** 3 tables with date ordering

---

## 9.5 Performance Requirements for Transactions

### 9.5.1 Response Time Targets

| Transaction Type | Target Response Time | Priority |
|------------------|---------------------|----------|
| Authentication | < 50ms | High |
| Simple Queries | < 100ms | High |
| Complex Queries | < 300ms | High |
| Write Operations | < 200ms | High |
| Analytics Queries | < 2000ms | Medium |
| Bulk Operations | < 2000ms | Medium |

### 9.5.2 Concurrency Requirements

| Transaction Type | Concurrent Users | Notes |
|------------------|-----------------|-------|
| READ Operations | 1000+ | Query-only, highly scalable |
| WRITE Operations | 100+ | Requires conflict handling |
| Authentication | 500+ | Stateless operations |
| Booking Operations | 100+ | Requires locking mechanism |

### 9.5.3 Transaction Isolation Levels

| Transaction Type | Isolation Level | Reason |
|-----------------|----------------|--------|
| Booking Creation | SERIALIZABLE | Prevent double-booking |
| Status Updates | READ COMMITTED | Balance consistency and performance |
| Query Operations | READ UNCOMMITTED | Read-only, fast performance |
| Analytics | READ UNCOMMITTED | Historical data, less strict |

---

## 9.6 Summary

This transaction requirements specification defines **59 distinct transaction operations** across all database operations:

- **8 INSERT operations** for data entry
- **16 UPDATE operations** for data modifications  
- **6 DELETE operations** for data removal
- **29 SELECT operations** for data retrieval

These transactions ensure:
- **Data Integrity** through constraint enforcement
- **Business Rule Compliance** across all 57 defined rules
- **Performance** through optimized query design
- **Security** through access control on all operations
- **Scalability** through efficient data access patterns

All transactions map directly to business processes and user requirements, ensuring the database system fully supports the BarberMatch platform's operational needs.



