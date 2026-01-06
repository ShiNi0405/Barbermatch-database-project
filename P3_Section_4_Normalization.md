# Phase 3: Database Logical Design (Schema)
## Section 4.0 - Normalization Verification

**Project:** BarberMatch Database System  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 4.0 Normalization Verification

This section provides formal proof that all tables in the BarberMatch database comply with **Boyce-Codd Normal Form (BCNF)**, ensuring optimal database design.

### 4.1 Normalization Overview

**Normalization Levels:**
- ✅ **1NF (First Normal Form):** All attributes contain atomic values
- ✅ **2NF (Second Normal Form):** No partial dependencies
- ✅ **3NF (Third Normal Form):** No transitive dependencies
- ✅ **BCNF (Boyce-Codd Normal Form):** Every determinant is a candidate key

---

### 4.2 Table-by-Table Normalization Verification

#### 4.2.1 USERS Table

**Functional Dependencies:**
- user_id → email, password_hash, role, name, phone, location, profile_image_url, is_verified, is_active, created_at, updated_at, last_login
- email → user_id (via UNIQUE constraint)

**Determinants:**
- user_id (Primary Key - candidate key)
- email (Unique Key - candidate key)

**Verification:**
✅ **1NF:** All columns contain atomic values (no multi-valued attributes)  
✅ **2NF:** All non-key attributes fully depend on the primary key  
✅ **3NF:** No transitive dependencies (all attributes depend directly on user_id)  
✅ **BCNF:** Both determinants (user_id, email) are candidate keys

**Conclusion:** USERS table is in BCNF ✅

---

#### 4.2.2 BARBERS Table

**Functional Dependencies:**
- barber_id → user_id, salon_name, business_address, city, state, postal_code, latitude, longitude, business_phone, business_email, business_license, working_hours, bio, experience_years, average_rating, total_reviews, is_verified, is_active, created_at, updated_at
- user_id → barber_id (via 1:1 relationship)
- (salon_name, city) → barber_id (via UNIQUE constraint)

**Determinants:**
- barber_id (Primary Key - candidate key)
- user_id (Unique FK - candidate key)
- (salon_name, city) (Composite Unique Key - candidate key)

**Verification:**
✅ **1NF:** working_hours stored as JSON (single value, not multi-valued)  
✅ **2NF:** All non-key attributes depend on entire primary key (no partial dependencies)  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** All determinants are candidate keys

**Note:** average_rating and total_reviews are derived attributes maintained for performance, calculated via triggers.

**Conclusion:** BARBERS table is in BCNF ✅

---

#### 4.2.3 SERVICES Table

**Functional Dependencies:**
- service_id → barber_id, service_name, description, category, price, duration_minutes, is_active, created_at, updated_at

**Determinants:**
- service_id (Primary Key - candidate key)

**Verification:**
✅ **1NF:** All attributes are atomic  
✅ **2NF:** No composite primary key, hence no partial dependencies  
✅ **3NF:** No transitive dependencies (all attributes depend directly on service_id)  
✅ **BCNF:** Only determinant is the primary key

**Conclusion:** SERVICES table is in BCNF ✅

---

#### 4.2.4 APPOINTMENTS Table

**Functional Dependencies:**
- appointment_id → customer_id, barber_id, service_id, appointment_date, start_time, end_time, status, notes, total_price, created_at, updated_at, confirmed_at, completed_at
- (barber_id, appointment_date, start_time) → appointment_id (via UNIQUE constraint)

**Determinants:**
- appointment_id (Primary Key - candidate key)
- (barber_id, appointment_date, start_time) (Composite Unique Key - candidate key)

**Verification:**
✅ **1NF:** All attributes are atomic  
✅ **2NF:** All non-key attributes depend on entire primary key  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** All determinants are candidate keys

**Conclusion:** APPOINTMENTS table is in BCNF ✅

---

#### 4.2.5 REVIEWS Table

** Functional Dependencies:**
- review_id → appointment_id, customer_id, barber_id, rating, review_text, is_verified, created_at, updated_at
- appointment_id → review_id (via UNIQUE constraint)

**Determinants:**
- review_id (Primary Key - candidate key)
- appointment_id (Unique FK - candidate key)

**Verification:**
✅ **1NF:** All attributes are atomic  
✅ **2NF:** All non-key attributes depend on primary key  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** Both determinants are candidate keys

**Conclusion:** REVIEWS table is in BCNF ✅

---

#### 4.2.6 PORTFOLIO Table

**Functional Dependencies:**
- portfolio_id → barber_id, image_url, image_type, title, description, service_category, is_featured, created_at, updated_at

**Determinants:**
- portfolio_id (Primary Key - candidate key)

**Verification:**
✅ **1NF:** All attributes are atomic  
✅ **2NF:** All non-key attributes depend on primary key  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** Only determinant is primary key

**Conclusion:** PORTFOLIO table is in BCNF ✅

---

#### 4.2.7 FAVOURITES Table

**Functional Dependencies:**
- favourite_id → customer_id, barber_id, created_at
- (customer_id, barber_id) → favourite_id (via UNIQUE constraint)

**Determinants:**
- favourite_id (Primary Key - candidate key)
- (customer_id, barber_id) (Composite Unique Key - candidate key)

**Verification:**
✅ **1NF:** All attributes are atomic  
✅ **2NF:** All non-key attributes depend on primary key  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** All determinants are candidate keys

**Conclusion:** FAVOURITES table is in BCNF ✅

---

### 4.3 Overall Normalization Summary

| Table | 1NF | 2NF | 3NF | BCNF | Notes |
|-------|-----|-----|-----|------|-------|
| USERS | ✅ | ✅ | ✅ | ✅ | Two candidate keys: user_id, email |
| BARBERS | ✅ | ✅ | ✅ | ✅ | Three candidate keys |
| SERVICES | ✅ | ✅ | ✅ | ✅ | Single candidate key |
| APPOINTMENTS | ✅ | ✅ | ✅ | ✅ | Two candidate keys |
| REVIEWS | ✅ | ✅ | ✅ | ✅ | Two candidate keys |
| PORTFOLIO | ✅ | ✅ | ✅ | ✅ | Single candidate key |
| FAVOURITES | ✅ | ✅ | ✅ | ✅ | Two candidate keys (weak entity) |

**Overall Result:** All 7 tables are in BCNF ✅

---

### 4.4 Design Quality Metrics

**Normalization Quality:**
- ✅ No data redundancy
- ✅ No update anomalies
- ✅ No insertion anomalies
- ✅ No deletion anomalies
- ✅ Optimal data integrity

**Referential Integrity:**
- ✅ All foreign keys properly defined
- ✅ CASCADE/RESTRICT rules appropriately applied
- ✅ Orphaned records prevented

---

**Previous:** [Section 3.0 - Complete SQL Script](P3_Section_3_Complete_SQL.md)  
**Next:** [Section 5.0 - Summary](P3_Section_5_Summary.md)
