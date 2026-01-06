# Phase 2: Database Conceptual Design (ERD)
## Section 5.0 - Data Dictionary

**Project:** BarberMatch Database System  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 5.0 Data Dictionary

###5.1 Overview

The Data Dictionary provides comprehensive documentation of all database objects including tables, columns, data types, constraints, and relationships. This ensures consistent understanding and implementation of the database schema.

---

### 5.2 Table: USERS

**Purpose:** Central repository for all user accounts (customers and barbers)

**Primary Key:** user_id  
**Indexes:** email (unique), role

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| user_id | UUID | - | NO | Auto | PRIMARY KEY | Unique identifier for user |
| email | VARCHAR | 255 | NO | - | UNIQUE | User email address |
| password_hash | VARCHAR | 255 | NO | - | - | Hashed password (bcrypt) |
| role | ENUM | - | NO | - | ('customer', 'barber') | User role type |
| name | VARCHAR | 100 | NO | - | - | User full name |
| phone | VARCHAR | 20 | NO | - | - | Contact phone number |
| location | VARCHAR | 255 | NO | - | - | User location/city |
| profile_image_url | VARCHAR | 500 | YES | NULL | - | Profile picture URL |
| is_verified | BOOLEAN | - | NO | FALSE | - | Email verification status |
| is_active | BOOLEAN | NO | TRUE | - | Account active status |
| created_at | TIMESTAMP | - | NO | NOW() | - | Account creation time |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |
| last_login | TIMESTAMP | - | YES | NULL | - | Last login timestamp |

**Business Rules:** RULE-001, RULE-002, RULE-005, RULE-006, RULE-009

---

### 5.3 Table: BARBERS

**Purpose:** Store barber business profiles and operating information

**Primary Key:** barber_id  
**Foreign Keys:** user_id → USERS(user_id)  
**Unique Constraints:** (salon_name, city)  
**Indexes:** city, state, (latitude, longitude)

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| barber_id | UUID | - | NO | Auto | PRIMARY KEY | Unique barber identifier |
| user_id | UUID | - | NO | - | FOREIGN KEY, UNIQUE | Reference to USERS table |
| salon_name | VARCHAR | 100 | NO | - | - | Business/salon name |
| business_address | VARCHAR | 255 | NO | - | - | Street address |
| city | VARCHAR | 50 | NO | - | - | City name |
| state | VARCHAR | 50 | NO | - | - | State/province |
| postal_code | VARCHAR | 20 | NO | - | - | Postal/ZIP code |
| latitude | DECIMAL | 10,8 | YES | NULL | - | GPS latitude coordinate |
| longitude | DECIMAL | 11,8 | YES | NULL | - | GPS longitude coordinate |
| business_phone | VARCHAR | 20 | NO | - | - | Business contact phone |
| business_email | VARCHAR | 255 | YES | NULL | - | Business email address |
| business_license | VARCHAR | 100 | YES | NULL | - | License/registration number |
| working_hours | JSON | - | NO | - | Valid JSON | Operating hours by day |
| bio | TEXT | - | YES | NULL | - | Barber biography/description |
| experience_years | INTEGER | - | NO | 0 | >= 0 | Years of experience |
| average_rating | DECIMAL | 3,2 | NO | 0.00 | 0.00-5.00 | Calculated average rating |
| total_reviews | INTEGER | - | NO | 0 | >= 0 | Total number of reviews |
| is_verified | BOOLEAN | - | NO | FALSE | - | Business verification status |
| is_active | BOOLEAN | - | NO | TRUE | - | Profile active status |
| created_at | TIMESTAMP | - | NO | NOW() | - | Profile creation time |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |

**Business Rules:** RULE-007, RULE-010, RULE-011, RULE-012, RULE-014

**JSON Structure for working_hours:**
```json
{
  "monday": {"start": "09:00", "end": "18:00"},
  "tuesday": {"start": "09:00", "end": "18:00"},
  "wednesday": {"closed": true},
  "thursday": {"start": "09:00", "end": "18:00"},
  "friday": {"start": "09:00", "end": "20:00"},
  "saturday": {"start": "10:00", "end": "17:00"},
  "sunday": {"closed": true}
}
```

---

### 5.4 Table: SERVICES

**Purpose:** Catalog of services offered by each barber

**Primary Key:** service_id  
**Foreign Keys:** barber_id → BARBERS(barber_id)  
**Indexes:** barber_id, category, is_active

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| service_id | UUID | - | NO | Auto | PRIMARY KEY | Unique service identifier |
| barber_id | UUID | - | NO | - | FOREIGN KEY | Reference to BARBERS |
| service_name | VARCHAR | 100 | NO | - | - | Name of service |
| description | TEXT | - | YES | NULL | - | Detailed service description |
| category | VARCHAR | 50 | NO | - | - | Service category/type |
| price | DECIMAL | 10,2 | NO | - | > 0 | Service price |
| duration_minutes | INTEGER | - | NO | - | BETWEEN 15 AND 240 | Service duration |
| is_active | BOOLEAN | - | NO | TRUE | - | Service availability status |
| created_at | TIMESTAMP | - | NO | NOW() | - | Service creation time |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |

**Business Rules:** RULE-013, RULE-015, RULE-016, RULE-017, RULE-018, RULE-019

**Common Categories:** Haircut, Shave, Beard Trim, Hair Coloring, Styling, Treatment

---

### 5.5 Table: APPOINTMENTS

**Purpose:** Booking records and appointment scheduling management

**Primary Key:** appointment_id  
**Foreign Keys:**  
- customer_id → USERS(user_id)  
- barber_id → BARBERS(barber_id)  
- service_id → SERVICES(service_id)

**Unique Constraints:** (barber_id, appointment_date, start_time)  
**Indexes:** customer_id, barber_id, appointment_date, status

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| appointment_id | UUID | - | NO | Auto | PRIMARY KEY | Unique appointment identifier |
| customer_id | UUID | - | NO | - | FOREIGN KEY | Reference to customer (USERS) |
| barber_id | UUID | - | NO | - | FOREIGN KEY | Reference to BARBERS |
| service_id | UUID | - | NO | - | FOREIGN KEY | Reference to SERVICES |
| appointment_date | DATE | - | NO | - | - | Date of appointment |
| start_time | TIME | - | NO | - | - | Start time |
| end_time | TIME | - | NO | - | - | End time |
| status | ENUM | - | NO | 'requested' | Status values | Appointment status |
| notes | TEXT | - | YES | NULL | - | Customer notes/requests |
| total_price | DECIMAL | 10,2 | NO | - | >= 0 | Total appointment cost |
| created_at | TIMESTAMP | - | NO | NOW() | - | Booking creation time |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |
| confirmed_at | TIMESTAMP | - | YES | NULL | - | Confirmation timestamp |
| completed_at | TIMESTAMP | - | YES | NULL | - | Completion timestamp |

**Status Enum Values:**
- `requested` - Initial booking request
- `confirmed` - Barber confirmed appointment
- `rejected` - Barber declined appointment
- `cancelled` - Either party cancelled
- `completed` - Service completed

**Business Rules:** RULE-020 to RULE-034

---

### 5.6 Table: REVIEWS

**Purpose:** Customer feedback and rating system

**Primary Key:** review_id  
**Foreign Keys:**  
- appointment_id → APPOINTMENTS(appointment_id)  
- customer_id → USERS(user_id)  
- barber_id → BARBERS(barber_id)

**Unique Constraints:** appointment_id  
**Indexes:** barber_id, customer_id, rating

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| review_id | UUID | - | NO | Auto | PRIMARY KEY | Unique review identifier |
| appointment_id | UUID | - | NO | - | FOREIGN KEY, UNIQUE | Reference to APPOINTMENTS |
| customer_id | UUID | - | NO | - | FOREIGN KEY | Reference to customer (USERS) |
| barber_id | UUID | - | NO | - | FOREIGN KEY | Reference to BARBERS |
| rating | INTEGER | - | NO | - | BETWEEN 1 AND 5 | Star rating (1-5) |
| review_text | TEXT | - | YES | NULL | - | Written review content |
| is_verified | BOOLEAN | - | NO | TRUE | - | Verified purchase indicator |
| created_at | TIMESTAMP | - | NO | NOW() | - | Review submission time |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |

**Business Rules:** RULE-035 to RULE-043

---

### 5.7 Table: PORTFOLIO

**Purpose:** Barber work showcase and portfolio management

**Primary Key:** portfolio_id  
**Foreign Keys:** barber_id → BARBERS(barber_id)  
**Indexes:** barber_id, is_featured, service_category

| Column Name | Data Type | Size | Null | Default | Constraints | Description |
|------------|-----------|------|------|---------|-------------|-------------|
| portfolio_id | UUID | - | NO | Auto | PRIMARY KEY | Unique portfolio image identifier |
| barber_id | UUID | - | NO | - | FOREIGN KEY | Reference to BARBERS |
| image_url | VARCHAR | 500 | NO | - | - | Image storage URL |
| image_type | ENUM | - | NO | - | ('before', 'after', 'gallery') | Image category |
| title | VARCHAR | 100 | YES | NULL | - | Image title |
| description | TEXT | - | YES | NULL | - | Image description |
| service_category | VARCHAR | 50 | YES | NULL | - | Related service type |
| is_featured | BOOLEAN | - | NO | FALSE | - | Featured image flag |
| created_at | TIMESTAMP | - | NO | NOW() | - | Upload timestamp |
| updated_at | TIMESTAMP | - | NO | NOW() | ON UPDATE | Last modification time |

**Business Rules:** RULE-044 to RULE-048

---

### 5.8 Referential Integrity Constraints

| Constraint Name | From Table | From Column | To Table | To Column | On Delete | On Update |
|-----------------|------------|-------------|----------|-----------|-----------|-----------|
| FK_BARBERS_USER | BARBERS | user_id | USERS | user_id | CASCADE | CASCADE |
| FK_SERVICES_BARBER | SERVICES | barber_id | BARBERS | barber_id | CASCADE | CASCADE |
| FK_APPT_CUSTOMER | APPOINTMENTS | customer_id | USERS | user_id | RESTRICT | CASCADE |
| FK_APPT_BARBER | APPOINTMENTS | barber_id | BARBERS | barber_id | RESTRICT | CASCADE |
| FK_APPT_SERVICE | APPOINTMENTS | service_id | SERVICES | service_id | RESTRICT | CASCADE |
| FK_REVIEW_APPT | REVIEWS | appointment_id | APPOINTMENTS | appointment_id | CASCADE | CASCADE |
| FK_REVIEW_CUSTOMER | REVIEWS | customer_id | USERS | user_id | CASCADE | CASCADE |
| FK_REVIEW_BARBER | REVIEWS | barber_id | BARBERS | barber_id | CASCADE | CASCADE |
| FK_PORTFOLIO_BARBER | PORTFOLIO | barber_id | BARBERS | barber_id | CASCADE | CASCADE |

---

### 5.10 Domain Definitions

| Domain Name | Base Type | Allowed Values | Description |
|-------------|-----------|----------------|-------------|
| EmailAddress | VARCHAR(255) | Valid email format | Email addresses |
| PhoneNumber | VARCHAR(20) | 10+ digits | Phone numbers |
| UserRole | ENUM | 'customer', 'barber' | User type |
| AppointmentStatus | ENUM | 'requested', 'confirmed', 'rejected', 'cancelled', 'completed' | Appointment states |
| ImageType | ENUM | 'before', 'after', 'gallery' | Portfolio image categories |
| StarRating | INTEGER | 1, 2, 3, 4, 5 | Rating values |
| Money | DECIMAL(10,2) | >= 0 | Monetary values |
| Duration | INTEGER | 15-240 | Service duration in minutes |

---

### 5.11 Index Strategy

| Index Name | Table | Columns | Type | Purpose |
|------------|-------|---------|------|---------|
| IDX_USERS_EMAIL | USERS | email | UNIQUE | Fast email lookup for authentication |
| IDX_USERS_ROLE | USERS | role | B-TREE | Filter users by role |
| IDX_BARBERS_LOCATION | BARBERS | city, state | B-TREE | Location-based searches |
| IDX_BARBERS_COORDS | BARBERS | latitude, longitude | SPATIAL | Geographic proximity searches |
| IDX_SERVICES_BARBER | SERVICES | barber_id | B-TREE | Fetch barber's services |
| IDX_SERVICES_CATEGORY | SERVICES | category, is_active | B-TREE | Service filtering |
| IDX_APPT_CUSTOMER | APPOINTMENTS | customer_id, appointment_date | B-TREE | Customer appointment history |
| IDX_APPT_BARBER | APPOINTMENTS | barber_id, appointment_date | B-TREE | Barber schedule |
| IDX_APPT_STATUS | APPOINTMENTS | status, appointment_date | B-TREE | Status-based queries |
| IDX_APPT_NO_CONFLICT | APPOINTMENTS | barber_id, appointment_date, start_time | UNIQUE | Prevent double-booking |
| IDX_REVIEWS_BARBER | REVIEWS | barber_id, rating | B-TREE | Rating calculations |
| IDX_PORTFOLIO_BARBER | PORTFOLIO | barber_id, is_featured | B-TREE | Portfolio display |

---

**Previous:** [Section 4.0 - Database Conceptual Design](P2_Section_4_ERD.md)  
**Next:** [Section 6.0 - Summary](P2_Section_6_Summary.md)
