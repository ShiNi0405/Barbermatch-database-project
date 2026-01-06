# Phase 3: Database Logical Design (Schema)
## Section 3.0 - Complete SQL Script

**Project:** BarberMatch Database System  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 3.0 Complete Executable SQL DDL Script

This section provides a single, ready-to-execute SQL script that creates the entire BarberMatch database schema.

### 3.1 Full Database Creation Script

```sql
-- ============================================
-- BarberMatch Database - Complete DDL Script
-- Version: 1.0
-- Author: Shi Ni Lai
-- Date: January 2026
-- ============================================

-- Drop existing database if needed (WARNING: DATA LOSS)
-- DROP DATABASE IF EXISTS barbermatch;

-- Create Database
CREATE DATABASE IF NOT EXISTS barbermatch
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE barbermatch;

-- ============================================
-- Table 1: USERS
-- Purpose: Central user account management
-- ============================================

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
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB;

-- ============================================
-- Table 2: BARBERS
-- Purpose: Barber business profiles
-- ============================================

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
    CONSTRAINT fk_barbers_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_experience CHECK (experience_years >= 0),
    CONSTRAINT chk_avg_rating CHECK (average_rating >= 0.00 AND average_rating <= 5.00),
    CONSTRAINT chk_total_reviews CHECK (total_reviews >= 0),
    CONSTRAINT uk_salon_city UNIQUE (salon_name, city),
    INDEX idx_barbers_location (city, state),
    INDEX idx_barbers_coords (latitude, longitude),
    INDEX idx_barbers_rating (average_rating DESC)
) ENGINE=InnoDB;

-- ============================================
-- Table 3: SERVICES
-- Purpose: Service catalog
-- ============================================

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
    CONSTRAINT fk_services_barber FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_price CHECK (price > 0),
    CONSTRAINT chk_duration CHECK (duration_minutes BETWEEN 15 AND 240),
    INDEX idx_services_barber (barber_id),
    INDEX idx_services_category (category, is_active)
) ENGINE=InnoDB;

-- ============================================
-- Table 4: APPOINTMENTS
-- Purpose: Booking and scheduling
-- ============================================

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
    CONSTRAINT fk_appt_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appt_barber FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_total_price CHECK (total_price >= 0),
    CONSTRAINT chk_time_order CHECK (end_time > start_time),
    CONSTRAINT uk_no_double_booking UNIQUE (barber_id, appointment_date, start_time),
    INDEX idx_appt_customer (customer_id, appointment_date DESC),
    INDEX idx_appt_barber (barber_id, appointment_date ASC),
    INDEX idx_appt_status (status, appointment_date)
) ENGINE=InnoDB;

-- ============================================
-- Table 5: REVIEWS
-- Purpose: Customer feedback system
-- ============================================

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
    CONSTRAINT fk_reviews_appt FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_barber FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    INDEX idx_reviews_barber (barber_id, rating)
) ENGINE=InnoDB;

-- ============================================
-- Table 6: PORTFOLIO
-- Purpose: Barber work showcase
-- ============================================

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
    CONSTRAINT fk_portfolio_barber FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_portfolio_barber (barber_id, is_featured DESC)
) ENGINE=InnoDB;

-- ============================================
-- Table 7: FAVOURITES
-- Purpose: Customer favorite lists
-- ============================================

CREATE TABLE favourites (
    favourite_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL,
    barber_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fav_customer FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_fav_barber FOREIGN KEY (barber_id) REFERENCES barbers(barber_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT uk_customer_barber UNIQUE (customer_id, barber_id),
    INDEX idx_fav_customer (customer_id)
) ENGINE=InnoDB;

-- ============================================
-- Verification Query
-- ============================================

SELECT 
    'Database schema created successfully!' AS status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'barbermatch') AS total_tables;

```

### 3.2 Sample Data Insertion Scripts

```sql
-- ============================================
-- Sample Data for Testing
-- ============================================

-- Sample Users (Customers)
INSERT INTO users (user_id, email, password_hash, role, name, phone, location, is_verified)
VALUES
    (UUID(), 'john.doe@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'customer', 'John Doe', '0123456789', 'Kuala Lumpur', TRUE),
    (UUID(), 'jane.smith@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'customer', 'Jane Smith', '0123456790', 'Petaling Jaya', TRUE);

-- Sample Users (Barbers)
INSERT INTO users (user_id, email, password_hash, role, name, phone, location, is_verified)
VALUES
    (UUID(), 'barber1@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'barber', 'Ahmad Hassan', '0123456791', 'Kuala Lumpur', TRUE),
    (UUID(), 'barber2@email.com', '$2y$10$abcdefghijklmnopqrstuvwxyz', 'barber', 'Lee Wei Ming', '0123456792', 'Subang Jaya', TRUE);

-- Sample Barber Profiles
INSERT INTO barbers (barber_id, user_id, salon_name, business_address, city, state, postal_code, latitude, longitude, business_phone, working_hours, bio, experience_years, is_verified)
SELECT 
    UUID(),
    user_id,
    'Classic Cuts Barber Shop',
    '123 Jalan Bukit Bintang',
    'Kuala Lumpur',
    'Wilayah Persekutuan',
    '50200',
    3.1478,
    101.7089,
    '0312345678',
    '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"09:00","end":"18:00"},"friday":{"start":"09:00","end":"20:00"},"saturday":{"start":"10:00","end":"17:00"},"sunday":{"closed":true}}',
    'Professional barber with 10 years experience',
    10,
    TRUE
FROM users WHERE email = 'barber1@email.com';

-- Repeat for other sample data...
```

---

**Previous:** [Section 2.0 - Schema Design](P3_Section_2_Schema_Design.md)  
**Next:** [Section 4.0 - Normalization Verification](P3_Section_4_Normalization.md)
