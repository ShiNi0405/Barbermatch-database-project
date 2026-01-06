# Phase 3: Database Logical Design (Schema)
## Section 2.0 - Database Schema Design

**Project:** BarberMatch Database System  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 2.0 Database Schema Design

### 2.1 SQL DDL Scripts

This section provides the complete SQL Data Definition Language (DDL) scripts for creating the BarberMatch database schema.

#### 2.1.1 Database Creation

```sql
-- Create Database
CREATE DATABASE IF NOT EXISTS barbermatch
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barbermatch;

-- Enable UUID functions
SET GLOBAL log_bin_trust_function_creators = 1;
```

---

#### 2.1.2 Table 1: USERS

```sql
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'barber') NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(500) NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Central repository for all user accounts';
```

**Column Descriptions:**
- `user_id`: Unique identifier (UUID format)
- `email`: User email address (must be unique)
- `password_hash`: Bcrypt hashed password (255 chars for bcrypt)
- `role`: User type (customer or barber)
- `name`: Full name of user
- `phone`: Contact phone number
- `location`: User's city/location
- `profile_image_url`: Optional profile photo
- `is_verified`: Email verification status
- `is_active`: Account status (soft delete flag)
- `created_at`: Account creation timestamp
- `updated_at`: Last modification timestamp
- `last_login`: Last successful login

---

#### 2.1.3 Table 2: BARBERS

```sql
CREATE TABLE barbers (
    barber_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    salon_name VARCHAR(100) NOT NULL,
    business_address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    business_phone VARCHAR(20) NOT NULL,
    business_email VARCHAR(255) NULL,
    business_license VARCHAR(100) NULL,
    working_hours JSON NOT NULL,
    bio TEXT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    average_rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    total_reviews INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_barbers_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_experience_years
        CHECK (experience_years >= 0),
    
    CONSTRAINT chk_average_rating
        CHECK (average_rating >= 0.00 AND average_rating <= 5.00),
    
    CONSTRAINT chk_total_reviews
        CHECK (total_reviews >= 0),
    
    CONSTRAINT uk_salon_name_city
        UNIQUE (salon_name, city),
    
    -- Indexes
    INDEX idx_barbers_location (city, state),
    INDEX idx_barbers_coords (latitude, longitude),
    INDEX idx_barbers_rating (average_rating DESC),
    INDEX idx_barbers_active (is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Barber business profiles and operating information';
```

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

#### 2.1.4 Table 3: SERVICES

```sql
CREATE TABLE services (
    service_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    barber_id CHAR(36) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_services_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(barber_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_price
        CHECK (price > 0),
    
    CONSTRAINT chk_duration
        CHECK (duration_minutes BETWEEN 15 AND 240),
    
    -- Indexes
    INDEX idx_services_barber (barber_id),
    INDEX idx_services_category (category, is_active),
    INDEX idx_services_price (price),
    INDEX idx_services_active (is_active)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Catalog of services offered by barbers';
```

**Common Service Categories:**
- Haircut
- Shave
- Beard Trim
- Hair Coloring
- Styling
- Treatment

---

#### 2.1.5 Table 4: APPOINTMENTS

```sql
CREATE TABLE appointments (
    appointment_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL,
    barber_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('requested', 'confirmed', 'rejected', 'cancelled', 'completed') NOT NULL DEFAULT 'requested',
    notes TEXT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- Constraints
    CONSTRAINT fk_appointments_customer
        FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_appointments_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(barber_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_appointments_service
        FOREIGN KEY (service_id) REFERENCES services(service_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_total_price
        CHECK (total_price >= 0),
    
    CONSTRAINT chk_time_order
        CHECK (end_time > start_time),
    
    -- Unique constraint to prevent double-booking
    CONSTRAINT uk_no_double_booking
        UNIQUE (barber_id, appointment_date, start_time),
    
    -- Indexes
    INDEX idx_appointments_customer (customer_id, appointment_date DESC),
    INDEX idx_appointments_barber (barber_id, appointment_date ASC),
    INDEX idx_appointments_status (status, appointment_date),
    INDEX idx_appointments_date (appointment_date)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Booking records and appointment scheduling';
```

---

#### 2.1.6 Table 5: REVIEWS

```sql
CREATE TABLE reviews (
    review_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    appointment_id CHAR(36) NOT NULL UNIQUE,
    customer_id CHAR(36) NOT NULL,
    barber_id CHAR(36) NOT NULL,
    rating INT NOT NULL,
    review_text TEXT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_reviews_appointment
        FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_reviews_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(barber_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),
    
    -- Indexes
    INDEX idx_reviews_barber (barber_id, rating),
    INDEX idx_reviews_customer (customer_id),
    INDEX idx_reviews_created (created_at DESC)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Customer feedback and barber ratings';
```

---

#### 2.1.7 Table 6: PORTFOLIO

```sql
CREATE TABLE portfolio (
    portfolio_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    barber_id CHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_type ENUM('before', 'after', 'gallery') NOT NULL,
    title VARCHAR(100) NULL,
    description TEXT NULL,
    service_category VARCHAR(50) NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_portfolio_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(barber_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Indexes
    INDEX idx_portfolio_barber (barber_id, is_featured DESC),
    INDEX idx_portfolio_category (service_category),
    INDEX idx_portfolio_type (image_type)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Barber work showcase and portfolio management';
```

---

#### 2.1.8 Table 7: FAVOURITES

```sql
CREATE TABLE favourites (
    favourite_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL,
    barber_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_favourites_customer
        FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_favourites_barber
        FOREIGN KEY (barber_id) REFERENCES barbers(barber_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    CONSTRAINT uk_customer_barber
        UNIQUE (customer_id, barber_id),
    
    -- Indexes
    INDEX idx_favourites_customer (customer_id),
    INDEX idx_favourites_barber (barber_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Customer favorite barber lists (weak entity)';
```

---

### 2.2 Schema Summary

| Table | Columns | Primary Key | Foreign Keys | Unique Constraints | Check Constraints | Indexes |
|-------|---------|-------------|--------------|-------------------|-------------------|---------|
| **users** | 13 | user_id | 0 | email | 0 | 3 |
| **barbers** | 21 | barber_id | 1 (user_id) | salon_name+city | 3 | 4 |
| **services** | 10 | service_id | 1 (barber_id) | 0 | 2 | 4 |
| **appointments** | 14 | appointment_id | 3 | barber_id+date+time | 2 | 4 |
| **reviews** | 9 | review_id | 3 | appointment_id | 1 | 3 |
| **portfolio** | 10 | portfolio_id | 1 (barber_id) | 0 | 0 | 3 |
| **favourites** | 4 | favourite_id | 2 | customer_id+barber_id | 0 | 2 |
| **TOTAL** | **81** | **7** | **11** | **5** | **8** | **23** |

---

**Previous:** [Section 1.0 - Introduction](P3_Section_1_Introduction.md)  
**Next:** [Section 3.0 - SQL DDL Complete Script](P3_Section_3_Complete_SQL.md)
