# Phase 2: Database Conceptual Design (ERD)
## Section 3.0 - Data & Transaction Requirements

**Project:** BarberMatch Database System  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 3.0 Data & Transaction Requirements

### 3.1 Proposed Business Rules

This section documents the **28 core business rules** that govern the BarberMatch MVP database system. These rules ensure data integrity, enforce business logic, and maintain system security.

#### 3.1.1 Authentication & User Management (6 Rules)

**RULE-001:** Each user must have a unique email address
- **Enforcement:** Database UNIQUE constraint on `users.email`
- **Impact:** Prevents account duplication

**RULE-002:** Users must select either 'customer' or 'barber' role during registration
- **Enforcement:** ENUM data type and application validation
- **Impact:** Determines user permissions and features

**RULE-003:** Customers must provide name, phone number, and location
- **Enforcement:** NOT NULL constraints on required fields
- **Impact:** Ensures contact information availability

**RULE-004:** Barbers must complete business profile with salon name, address, and contact information
- **Enforcement:** Application validation and NOT NULL constraints
- **Impact:** Ensures complete operational information

**RULE-005:** Users can only edit their own profile information
- **Enforcement:** Row Level Security (RLS) and application authorization
- **Impact:** Prevents unauthorized modifications

**RULE-006:** Only authenticated users can modify data
- **Enforcement:** Authentication requirement on all INSERT/UPDATE/DELETE
- **Impact:** Prevents anonymous changes

#### 3.1.2 Barber Management (3 Rules)

**RULE-007:** Salon name must be unique within the same city
- **Enforcement:** UNIQUE constraint on (`salon_name`, `city`)
- **Impact:** Prevents duplicate businesses in same location

**RULE-008:** Barbers must set their working hours and availability
- **Enforcement:** NOT NULL constraint on `working_hours` JSON field
- **Impact:** Enables appointment scheduling

**RULE-009:** Barber profiles must include at least one service offering
- **Enforcement:** Application validation before profile activation
- **Impact:** Ensures barbers can receive appointments

#### 3.1.3 Service Management (3 Rules)

**RULE-010:** Each service must have a name, description, price, and duration
- **Enforcement:** NOT NULL constraints on required fields
- **Impact:** Ensures complete service information

**RULE-011:** Service prices must be positive values (greater than 0)
- **Enforcement:** CHECK constraint `price > 0`
- **Impact:** Prevents invalid pricing

**RULE-012:** Service duration must be between 15 minutes and 4 hours (240 minutes)
- **Enforcement:** CHECK constraint `duration_minutes BETWEEN 15 AND 240`
- **Impact:** Ensures realistic service durations

#### 3.1.4 Appointment Booking (8 Rules)

**RULE-013:** Customers can only book appointments with active barbers
- **Enforcement:** Application validation checking `is_active` flag
- **Impact:** Ensures bookings with available barbers

**RULE-014:** Appointments must be scheduled at least 2 hours in advance
- **Enforcement:** Application validation `appointment_datetime > NOW() + 2 hours`
- **Impact:** Gives barbers adequate notice

**RULE-015:** Appointments must be within barber's working hours
- **Enforcement:** Application validation against `working_hours` JSON
- **Impact:** Ensures appointments during business hours

**RULE-016:** New appointments start with 'requested' status
- **Enforcement:** DEFAULT value on `status` column
- **Impact:** Establishes confirmation workflow

**RULE-017:** Only barbers can change appointment status from 'requested' to 'confirmed' or 'rejected'
- **Enforcement:** Application authorization checking user role
- **Impact:** Ensures barbers control their schedule

**RULE-018:** Completed appointments cannot be modified or deleted
- **Enforcement:** Application restriction on UPDATE/DELETE for completed status
- **Impact:** Preserves historical records

**RULE-019:** No double booking allowed - each barber can only have one appointment per time slot
- **Enforcement:** Application validation + UNIQUE constraint on (`barber_id`, `appointment_date`, `start_time`)
- **Impact:** Prevents scheduling conflicts

**RULE-020:** Appointment duration must match the selected service duration
- **Enforcement:** Application validation calculating end_time from service duration
- **Impact:** Ensures accurate scheduling

#### 3.1.5 Review & Rating (4 Rules)

**RULE-021:** Only customers who have completed appointments can leave reviews
- **Enforcement:** Application validation checking appointment status
- **Impact:** Ensures reviews based on actual experience

**RULE-022:** Customers can only leave one review per completed appointment
- **Enforcement:** UNIQUE constraint on `appointment_id`
- **Impact:** Prevents duplicate reviews

**RULE-023:** Rating must be between 1 and 5 stars
- **Enforcement:** CHECK constraint `rating BETWEEN 1 AND 5`
- **Impact:** Standardizes rating scale

**RULE-024:** Review text is optional but rating is mandatory
- **Enforcement:** NOT NULL on `rating`, NULL allowed on `review_text`
- **Impact:** Captures essential rating

#### 3.1.6 Portfolio Management (2 Rules)

**RULE-025:** Only barbers can upload portfolio images
- **Enforcement:** Application authorization checking user role
- **Impact:** Ensures barber-controlled content

**RULE-026:** Maximum 20 images per barber portfolio
- **Enforcement:** Application validation counting existing images
- **Impact:** Prevents portfolio clutter

#### 3.1.7 Data Access & Security (2 Rules)

**RULE-027:** Users can only access their own data
- **Enforcement:** Row Level Security (RLS) policies
- **Impact:** Protects user privacy

**RULE-028:** Public data includes barber profiles, services, and reviews
- **Enforcement:** Public read permissions on specific tables
- **Impact:** Enables discovery functionality

---

### 3.2 Proposed Data & Transactional Requirements

This section defines the **29 core transaction operations** that the database must support to fulfill MVP business processes.

**Transaction Summary:**
- Data Entry (INSERT): 6 transactions
- Data Update (UPDATE): 10 transactions
- Data Query (SELECT): 9 transactions
- Analytics Queries: 2 transactions
- **Total: 27 transactions**

#### 3.2.1 Data Entry Transactions (INSERT)

| Transaction ID | Name | Description | Frequency | Tables Affected |
|----------------|------|-------------|-----------|-----------------|
| **TXN-001** | CREATE_USER | Create new user account | High | USERS |
| **TXN-002** | CREATE_BARBER_PROFILE | Create barber business profile | Medium | BARBERS |
| **TXN-003** | ADD_SERVICE | Add new service offering | Medium | SERVICES |
| **TXN-004** | CREATE_APPOINTMENT | Create new appointment booking | High | APPOINTMENTS |
| **TXN-005** | CREATE_REVIEW | Submit customer review | Medium | REVIEWS |
| **TXN-006** | UPLOAD_PORTFOLIO | Upload barber portfolio image | Low | PORTFOLIO |

#### 3.2.2 Data Update Transactions (UPDATE)

| Transaction ID | Name | Description | Frequency | Tables Affected |
|----------------|------|-------------|-----------|-----------------|
| **TXN-009** | UPDATE_USER_PROFILE | Update user profile information | Medium | USERS |
| **TXN-010** | UPDATE_BARBER_PROFILE | Update barber business info | Medium | BARBERS |
| **TXN-011** | UPDATE_SERVICE | Update service details | Medium | SERVICES |
| **TXN-012** | CONFIRM_APPOINTMENT | Barber confirms appointment | High | APPOINTMENTS |
| **TXN-013** | REJECT_APPOINTMENT | Barber rejects appointment | Medium | APPOINTMENTS |
| **TXN-014** | CANCEL_APPOINTMENT_CUSTOMER | Customer cancels appointment | Medium | APPOINTMENTS |
| **TXN-015** | CANCEL_APPOINTMENT_BARBER | Barber cancels appointment | Low | APPOINTMENTS |
| **TXN-016** | COMPLETE_APPOINTMENT | Mark appointment as completed | High | APPOINTMENTS |
| **TXN-017** | UPDATE_WORKING_HOURS | Modify barber availability | Medium | BARBERS |
| **TXN-018** | ACTIVATE_DEACTIVATE_SERVICE | Toggle service availability | Medium | SERVICES |

#### 3.2.3 Data Query Transactions (SELECT)

| Transaction ID | Name | Description | Performance Target | Tables Queried |
|----------------|------|-------------|--------------------|----------------|
| **TXN-027** | AUTHENTICATE_USER | Verify login credentials | < 50ms | USERS |
| **TXN-028** | GET_USER_BY_EMAIL | Retrieve user by email | < 50ms | USERS |
| **TXN-029** | GET_USER_PROFILE | Get complete user profile | < 100ms | USERS, BARBERS |
| **TXN-031** | SEARCH_BARBERS_BY_LOCATION | Find barbers near location | < 200ms | BARBERS |
| **TXN-034** | GET_BARBER_PROFILE | Get complete barber profile | < 300ms | BARBERS, SERVICES, REVIEWS, PORTFOLIO |
| **TXN-038** | GET_CUSTOMER_APPOINTMENTS | Get customer appointment history | < 200ms | APPOINTMENTS, USERS, BARBERS, SERVICES |
| **TXN-039** | GET_BARBER_APPOINTMENTS | Get barber appointment schedule | < 200ms | APPOINTMENTS, USERS, SERVICES |
| **TXN-042** | CHECK_APPOINTMENT_AVAILABILITY | Verify time slot availability | < 50ms | APPOINTMENTS, BARBERS |
| **TXN-044** | CALCULATE_AVERAGE_RATING | Compute barber average rating | < 200ms | REVIEWS |

#### 3.2.4 Complex Analytical Queries

| Transaction ID | Name | Description | Performance Target | Purpose |
|----------------|------|------------|--------------------|---------|
| **TXN-019** | GET_BARBER_STATISTICS | Performance metrics | < 500ms | Analytics dashboard |
| **TXN-020** | GET_POPULAR_SERVICES | Most requested services | < 1000ms | Service optimization |

---

**Previous:** [Section 2.0 - Data Flow Diagram](P2_Section_2_DFD.md)  
**Next:** [Section 4.0 - Database Conceptual Design](P2_Section_4_ERD.md)
