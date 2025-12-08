# BarberMatch - Data Requirements Checklist

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025  
**Task 4:** Comprehensive Data Requirements Documentation

---

## 📋 **1. Entities / Tables**

### **Main Entities in the System**

#### **1. USERS** 
**Purpose:** Stores user account information and authentication data  
**Auxiliary Role:** Central entity for all user types (customers and barbers)

#### **2. BARBERS**
**Purpose:** Stores barber business profile information  
**Auxiliary Note:** Each barber must have a corresponding user record

#### **3. SERVICES**
**Purpose:** Stores barber service offerings with pricing and duration  
**Auxiliary Note:** Each barber can have multiple services

#### **4. APPOINTMENTS**
**Purpose:** Stores appointment booking information  
**Auxiliary Note:** Links customers to barbers for specific services at specific times

#### **5. REVIEWS**
**Purpose:** Stores customer reviews and ratings for completed appointments  
**Auxiliary Note:** Links to both appointments and barbers

#### **6. PORTFOLIO**
**Purpose:** Stores barber work portfolio images (before/after shots)  
**Auxiliary Note:** Displayed in barber profiles to showcase work

#

#### **8. SERVICE_CATEGORIES** *(Auxiliary Entity)*
**Purpose:** Categorizes services for better organization and filtering  
**Auxiliary Note:** Can be barber-specific or global categories

---

## 📊 **2. Attributes / Columns**

### **USERS Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `user_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for user records |
| `email` | VARCHAR(255) | Unique, Not Null | User login identifier |
| `password_hash` | VARCHAR(255) | Not Null | Secure password storage |
| `role` | ENUM('customer', 'barber') | Not Null | User type: customer or barber |
| `name` | VARCHAR(100) | Not Null | User's full name |
| `phone` | VARCHAR(20) | Not Null | Contact phone number |
| `location` | VARCHAR(255) | Not Null | User's address/location |
| `profile_image_url` | VARCHAR(500) | Nullable | Profile picture URL |
| `is_verified` | BOOLEAN | Default: false | Email verification status |
| `is_active` | BOOLEAN | Default: true | Account activation status |
| `created_at` | TIMESTAMP | Auto-generated | Record creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |
| `last_login` | TIMESTAMP | Nullable | Last login date/time |

**Usage Notes:**
- `email`: Used for authentication and unique user identification
- `role`: Determines access level and available features
- `is_verified`: Blocks features until email verification
- `last_login`: Track user activity for security

### **BARBERS Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `barber_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for barber records |
| `user_id` (FK) | UUID | References users.user_id, Not Null | Links to user account |
| `salon_name` | VARCHAR(100) | Not Null | Business name |
| `business_address` | VARCHAR(255) | Not Null | Full business address |
| `city` | VARCHAR(50) | Not Null | City location |
| `state` | VARCHAR(50) | Not Null | State/region |
| `postal_code` | VARCHAR(20) | Not Null | Postal/ZIP code |
| `latitude` | DECIMAL(10,8) | Nullable | GPS latitude |
| `longitude` | DECIMAL(11,8) | Nullable | GPS longitude |
| `business_phone` | VARCHAR(20) | Not Null | Business contact number |
| `business_email` | VARCHAR(255) | Nullable | Business email |
| `business_license` | VARCHAR(100) | Nullable | License number |
| `working_hours` | JSON | Not Null | Operating hours (structured) |
| `bio` | TEXT | Nullable | Business description |
| `experience_years` | INTEGER | Default: 0 | Years of experience |
| `average_rating` | DECIMAL(3,2) | Default: 0.00 | Calculated rating (1-5) |
| `total_reviews` | INTEGER | Default: 0 | Count of reviews |
| `is_verified` | BOOLEAN | Default: false | Business verification status |
| `is_active` | BOOLEAN | Default: true | Business active status |
| `created_at` | TIMESTAMP | Auto-generated | Record creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |

**Usage Notes:**
- `salon_name + city`: Must be unique (business name per city)
- `latitude/longitude`: Used for location-based searches and maps
- `working_hours`: JSON structure for weekly schedule
- `average_rating`: System-calculated from reviews
- `is_verified`: Admin review for business authenticity

### **SERVICES Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `service_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for service records |
| `barber_id` (FK) | UUID | References barbers.barber_id, Not Null | Owner barber |
| `category_id` (FK) | UUID | References service_categories.id, Not Null | Service category |
| `service_name` | VARCHAR(100) | Not Null | Service title |
| `description` | TEXT | Nullable | Service details |
| `category` | VARCHAR(50) | Not Null | Service type |
| `price` | DECIMAL(10,2) | Not Null, > 0 | Service price |
| `duration_minutes` | INTEGER | Not Null, 15-240 | Duration in minutes |
| `is_active` | BOOLEAN | Default: true | Service availability |
| `created_at` | TIMESTAMP | Auto-generated | Record creation timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |

**Usage Notes:**
- `price`: Must be positive (business rule RULE-016)
- `duration_minutes`: Must be 15-240 minutes (business rule RULE-017)
- `is_active`: Soft delete mechanism for historical appointments
- `category`: Used for filtering and organization

### **APPOINTMENTS Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `appointment_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for appointment records |
| `customer_id` (FK) | UUID | References users.user_id, Not Null | Booking customer |
| `barber_id` (FK) | UUID | References barbers.barber_id, Not Null | Service provider |
| `service_id` (FK) | UUID | References services.service_id, Not Null | Service booked |
| `appointment_date` | DATE | Not Null | Booking date |
| `start_time` | TIME | Not Null | Booking start time |
| `end_time` | TIME | Not Null | Booking end time |
| `status` | ENUM | Not Null, Default: 'requested' | Appointment status |
| `notes` | TEXT | Nullable | Special instructions |
| `total_price` | DECIMAL(10,2) | Not Null | Total booking price |
| `created_at` | TIMESTAMP | Auto-generated | Request timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |
| `confirmed_at` | TIMESTAMP | Nullable | Confirmation timestamp |
| `completed_at` | TIMESTAMP | Nullable | Completion timestamp |

**Status Values:**
- `requested`: Initial booking (awaiting barber confirmation)
- `confirmed`: Barber accepted the booking
- `rejected`: Barber declined the booking
- `cancelled`: Customer or barber cancelled
- `completed`: Appointment finished successfully

**Usage Notes:**
- `start_time/end_time`: Used for scheduling and conflict detection
- `status`: Tracks appointment lifecycle
- `total_price`: Captured at booking time (price protection)
- `confirmed_at/completed_at`: Audit timestamps for workflow tracking

### **REVIEWS Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `review_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for review records |
| `appointment_id` (FK) | UUID | References appointments.appointment_id, Unique, Not Null | Related appointment |
| `customer_id` (FK) | UUID | References users.user_id, Not Null | Review author |
| `barber_id` (FK) | UUID | References barbers.barber_id, Not Null | Review recipient |
| `rating` | INTEGER | Not Null, 1-5 | Star rating |
| `review_text` | TEXT | Nullable | Review comments |
| `is_verified` | BOOLEAN | Default: true | Review authenticity |
| `created_at` | TIMESTAMP | Auto-generated | Review submission timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |

**Usage Notes:**
- `rating`: Must be 1-5 (business rule RULE-038)
- `appointment_id`: Unique constraint prevents duplicate reviews
- `is_verified`: Mark as verified purchase (completed appointment)
- `review_text`: Optional but encouraged for detailed feedback

### **PORTFOLIO Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `portfolio_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for portfolio records |
| `barber_id` (FK) | UUID | References barbers.barber_id, Not Null | Owner barber |
| `image_url` | VARCHAR(500) | Not Null | Image storage URL |
| `image_type` | ENUM | Not Null | Image category |
| `title` | VARCHAR(100) | Nullable | Image title |
| `description` | TEXT | Nullable | Image description |
| `service_category` | VARCHAR(50) | Nullable | Related service type |
| `is_featured` | BOOLEAN | Default: false | Featured image |
| `created_at` | TIMESTAMP | Auto-generated | Upload timestamp |
| `updated_at` | TIMESTAMP | Auto-updated | Last modification timestamp |

**Image Type Values:**
- `before`: Before treatment image
- `after`: After treatment image
- `gallery`: General portfolio image

**Usage Notes:**
- `image_url`: Must be JPG, PNG, or WebP (max 5MB - business rule RULE-047)
- `is_featured`: Displayed prominently in barber profile
- `service_category`: Used to organize portfolio by service type
- Maximum 20 images per barber (business rule RULE-045)

### **FAVOURITES Entity**

| Attribute | Data Type | Constraints | Purpose |
|-----------|-----------|-------------|---------|
| `favourite_id` (PK) | UUID | Auto-generated, Unique, Not Null | Primary key for favorite records |
| `customer_id` (FK) | UUID | References users.user_id, Not Null | Customer who favorited |
| `barber_id` (FK) | UUID | References barbers.barber_id, Not Null | Favorited barber |
| `created_at` | TIMESTAMP | Auto-generated | Favorite timestamp |

**Usage Notes:**
- Unique constraint on `(customer_id, barber_id)` prevents duplicates
- Used for quick access to preferred barbers
- Implement cascade delete on customer deletion

---

## 🔗 **3. Relationships**

### **Primary Relationships**

| Relationship | Cardinality | Description | Foreign Key |
|--------------|-------------|-------------|-------------|
| **USERS ↔ BARBERS** | 1:1 | One user can be one barber (optional) | `barbers.user_id → users.user_id` |
| **BARBERS ↔ SERVICES** | 1:Many | One barber offers many services | `services.barber_id → barbers.barber_id` |
| **USERS ↔ APPOINTMENTS** | 1:Many | One customer books many appointments | `appointments.customer_id → users.user_id` |
| **BARBERS ↔ APPOINTMENTS** | 1:Many | One barber receives many appointments | `appointments.barber_id → barbers.barber_id` |
| **SERVICES ↔ APPOINTMENTS** | 1:Many | One service booked in many appointments | `appointments.service_id → services.service_id` |
| **APPOINTMENTS ↔ REVIEWS** | 1:1 | One appointment can have one review | `reviews.appointment_id → appointments.appointment_id` |
| **BARBERS ↔ PORTFOLIO** | 1:Many | One barber has many portfolio images | `portfolio.barber_id → barbers.barber_id` |
| **USERS ↔ FAVOURITES** | 1:Many | One customer favorites many barbers | `favourites.customer_id → users.user_id` |
| **BARBERS ↔ FAVOURITES** | 1:Many | One barber favorited by many customers | `favourites.barber_id → barbers.barber_id` |

### **Relationship Details**

#### **1. USERS → BARBERS (1:1)**
- **Type:** One-to-One (optional)
- **Constraint:** Users with `role='barber'` should have a barber profile
- **Business Rule:** RULE-006 (customers must have name, phone, location), RULE-007 (barbers must complete business profile)
- **Cascade:** Soft delete on user sets barber inactive

#### **2. BARBERS → SERVICES (1:Many)**
- **Type:** One-to-Many
- **Constraint:** Barbers must have at least one service (RULE-013)
- **Business Rule:** Maximum 20 active services per barber (RULE-018)
- **Cascade:** Cannot delete service if it has future appointments (RULE-019)

#### **3. USERS → APPOINTMENTS (1:Many)**
- **Type:** One-to-Many
- **Constraint:** Only customers can book appointments
- **Business Rule:** Customers can only book with active barbers (RULE-020)
- **Cascade:** Soft delete on user preserves appointment history

#### **4. BARBERS → APPOINTMENTS (1:Many)**
- **Type:** One-to-Many
- **Constraint:** Appointments must be with active barbers
- **Business Rule:** No double booking allowed (RULE-031)
- **Cascade:** Cannot delete barber with pending appointments (RULE-014)

#### **5. SERVICES → APPOINTMENTS (1:Many)**
- **Type:** One-to-Many
- **Constraint:** Appointments must reference active services
- **Business Rule:** Appointment duration matches service duration (RULE-032)
- **Cascade:** Service price captured at booking (price protection)

#### **6. APPOINTMENTS → REVIEWS (1:1)**
- **Type:** One-to-One (optional)
- **Constraint:** Only completed appointments can have reviews
- **Business Rule:** One review per completed appointment (RULE-036)
- **Cascade:** Reviews cannot be edited (RULE-040)

#### **7. BARBERS → PORTFOLIO (1:Many)**
- **Type:** One-to-Many
- **Constraint:** Portfolio images must be work-related
- **Business Rule:** Maximum 20 images per barber (RULE-045)
- **Cascade:** Portfolio images can be deleted by barber

#### **8. USERS ↔ FAVOURITES (Many-to-Many)**
- **Type:** Many-to-Many (via junction table)
- **Constraint:** Unique `(customer_id, barber_id)` combination
- **Business Rule:** Only customers can have favorite barbers
- **Cascade:** Delete favorites when user deletes account

#### **9. SERVICES → SERVICE_CATEGORIES (Many-to-One)**
- **Type:** Many-to-One
- **Constraint:** Each service must have a category
- **Business Rule:** Categories can be barber-specific or global
- **Cascade:** Category deletion sets service category to default

---

## 🔒 **4. Constraints / Rules**

### **Unique Constraints**

| Field | Constraint | Business Rule |
|-------|------------|---------------|
| `users.email` | UNIQUE | RULE-001: Each user must have a unique email |
| `barbers.salon_name + barbers.city` | UNIQUE | RULE-011: Salon name unique per city |
| `favourites.customer_id + favourites.barber_id` | UNIQUE | Prevent duplicate favorites |
| `reviews.appointment_id` | UNIQUE | RULE-036: One review per appointment |

### **Required Fields (NOT NULL)**

| Entity | Required Fields | Purpose |
|--------|----------------|---------|
| **USERS** | email, password_hash, role, name, phone, location | Core user data |
| **BARBERS** | user_id, salon_name, business_address, city, state, postal_code, business_phone, working_hours | Complete business profile |
| **SERVICES** | barber_id, category_id, service_name, category, price, duration_minutes | Complete service definition |
| **APPOINTMENTS** | customer_id, barber_id, service_id, appointment_date, start_time, end_time, status, total_price | Complete booking information |
| **REVIEWS** | appointment_id, customer_id, barber_id, rating | Core review data |

### **Check Constraints (Validation Rules)**

#### **Rating Validation**
- **Rule:** `reviews.rating` must be between 1 and 5
- **Business Rule:** RULE-038
- **Implementation:** CHECK constraint in database

#### **Price Validation**
- **Rule:** `services.price` must be greater than 0
- **Business Rule:** RULE-016
- **Implementation:** CHECK constraint in database

#### **Duration Validation**
- **Rule:** `services.duration_minutes` must be between 15 and 240
- **Business Rule:** RULE-017
- **Implementation:** CHECK constraint in database

#### **Role Validation**
- **Rule:** `users.role` must be 'customer' or 'barber'
- **Business Rule:** RULE-002
- **Implementation:** ENUM type in database

### **Timing Constraints**

#### **Booking Time Window**
- **Rule:** Appointments must be at least 2 hours in advance (RULE-021)
- **Rule:** Appointments cannot be more than 30 days in advance (RULE-022)
- **Implementation:** Application-level validation

#### **Double Booking Prevention**
- **Rule:** No barber can have overlapping appointments (RULE-031)
- **Constraint:** Database-level conflict detection
- **Implementation:** Check overlaps using start_time/end_time comparison

#### **Cancellation Time Limits**
- **Customer Rule:** Can cancel up to 2 hours before appointment (RULE-028)
- **Barber Rule:** Can cancel up to 1 hour before appointment (RULE-029)
- **Implementation:** Application-level business logic

### **Reference Integrity Constraints**

| Constraint Type | Affected Entities | Rule |
|----------------|-------------------|------|
| Foreign Key | All | Must reference existing records |
| Cascade Delete | Favourites | Delete when customer deletes account |
| Cascade Delete | Reviews | Prevent cascade, preserve review history |
| Restrict Delete | Services | Cannot delete if has future appointments (RULE-019) |
| Restrict Delete | Barbers | Cannot delete if has pending appointments (RULE-014) |
| Soft Delete | Users | Mark as inactive instead of deleting |
| Soft Delete | Barbers | Mark as inactive instead of deleting |
| Soft Delete | Services | Mark as inactive instead of deleting |

---

## 🔄 **5. CRUD Operations by User Role**

### **Customer Role CRUD Matrix**

| Entity | Create | Read | Update | Delete | Restrictions |
|--------|--------|------|--------|--------|--------------|
| **Own Profile** | ✅ Register | ✅ Own profile only | ✅ Own info | ❌ | Cannot change role |
| **Other Profiles** | ❌ | ✅ Public profiles only | ❌ | ❌ | Read-only |
| **Barbers** | ❌ | ✅ All barbers | ❌ | ❌ | Can view barber listings |
| **Services** | ❌ | ✅ All active services | ❌ | ❌ | Browse available services |
| **Appointments** | ✅ Own bookings | ✅ Own appointments | ✅ Reschedule/Cancel | ❌ | Limited by time constraints |
| **Reviews** | ✅ Submit (post-completion) | ✅ All reviews | ✅ Edit own review | ❌ | Cannot delete reviews |
| **Portfolio** | ❌ | ✅ Public portfolio | ❌ | ❌ | View work samples |
| **Favourites** | ✅ Add to favorites | ✅ Own favorites | ❌ | ✅ Remove favorites | - |

### **Barber Role CRUD Matrix**

| Entity | Create | Read | Update | Delete | Restrictions |
|--------|--------|------|--------|--------|--------------|
| **Own Profile** | ✅ Create profile | ✅ Own profile | ✅ Own profile | ❌ | Cannot delete active profile |
| **Services** | ✅ Add services | ✅ Own services | ✅ Own services | ✅ Own services | Max 20 services (RULE-018) |
| **Availability** | ✅ Set hours | ✅ Own schedule | ✅ Own schedule | ✅ Block times | Within business constraints |
| **Appointments** | ❌ | ✅ Own appointments | ✅ Confirm/Reject/Cancel | ❌ | Cannot create for customers |
| **Reviews** | ❌ | ✅ Own reviews | ❌ | ❌ | Cannot edit reviews |
| **Portfolio** | ✅ Upload images | ✅ Own portfolio | ✅ Own portfolio | ✅ Own images | Max 20 images (RULE-045) |
| **Customers** | ❌ | ✅ Appointment customers only | ❌ | ❌ | Limited access |

### **Admin Role CRUD Matrix**

| Entity | Create | Read | Update | Delete | Restrictions |
|--------|--------|------|--------|--------|--------------|
| **Users** | ❌ | ✅ All users | ❌ | ✅ Soft delete only | Cannot modify credentials |
| **Barbers** | ❌ | ✅ All barbers | ❌ | ✅ Soft delete only | Cannot modify business data |
| **Services** | ❌ | ✅ All services | ❌ | ❌ | Read-only |
| **Appointments** | ❌ | ✅ All appointments | ❌ | ✅ Delete expired | Cannot modify active bookings |
| **Reviews** | ❌ | ✅ All reviews | ❌ | ✅ Remove flagged | Only for moderation |
| **Portfolio** | ❌ | ✅ All portfolio | ❌ | ✅ Remove inappropriate | Only for moderation |
| **Favourites** | ❌ | ✅ All favorites | ❌ | ❌ | Read-only |

### **System Role CRUD Matrix**

| Entity | Create | Read | Update | Delete | Automation |
|--------|--------|------|--------|--------|------------|
| **Users** | ✅ Auto-create | ✅ All users | ✅ Timestamps | ❌ | Handle registration flow |
| **Barbers** | ❌ | ✅ All barbers | ✅ Statistics | ❌ | Auto-calculate ratings |
| **Services** | ❌ | ✅ All services | ✅ Status | ❌ | Auto-update availability |
| **Appointments** | ✅ Validated bookings | ✅ All appointments | ✅ Status | ✅ Expired cleanup | Auto-expire requests |
| **Reviews** | ❌ | ✅ All reviews | ❌ | ❌ | Verify reviews |
| **Portfolio** | ❌ | ✅ All portfolio | ❌ | ❌ | Handle image uploads |
| **Statistics** | ✅ Calculate | ✅ Read metrics | ✅ Update | ❌ | Auto-aggregate data |

### **Special CRUD Restrictions**

#### **Append-Only Operations**
- **Reviews:** Customers can add reviews but not edit after submission (RULE-040, RULE-042)
- **Appointment History:** Completed appointments cannot be modified (RULE-030)

#### **Time-Based Restrictions**
- **Customer Appointments:** Can cancel up to 2 hours before (RULE-028)
- **Barber Appointments:** Can cancel up to 1 hour before (RULE-029)
- **Booking Requests:** Expire after 24 hours if not confirmed (RULE-025)

#### **Data Protection Rules**
- **Price Protection:** Appointment price captured at booking time
- **Review Integrity:** Reviews linked to verified completed appointments only
- **Profile Deletion:** Cannot delete profile if has pending appointments (RULE-014)

---

## ⚠️ **6. Gaps / Issues**

### **Data Handling Issues**

#### **1. Double Booking Risk**
- **Issue:** Race conditions when multiple customers book same time slot
- **Risk Level:** High
- **Impact:** Customer dissatisfaction, barber conflict
- **Current Mitigation:** Application-level conflict checking
- **Recommended Solution:** Database-level locking mechanism or transaction isolation

#### **2. Data Inconsistency**
- **Issue:** Service prices/durations can change after booking
- **Current Behavior:** Price captured at booking (`appointments.total_price`)
- **Gap:** What if service is deleted after booking?
- **Impact:** Historical accuracy
- **Recommended Solution:** Mark services as inactive, preserve in appointments

#### **3. Soft Deletion Implementation**
- **Issue:** Need to preserve history for reporting
- **Current Approach:** Using `is_active` flags
- **Gap:** No audit trail for soft deletions
- **Impact:** Cannot track who deleted or when
- **Recommended Solution:** Add `deleted_at` and `deleted_by` columns

#### **4. Rating Calculation Accuracy**
- **Issue:** Barbers can delete reviews to manipulate rating
- **Current Behavior:** Reviews cannot be deleted by customers
- **Gap:** Admin deletion of flagged reviews affects rating
- **Impact:** Rating accuracy
- **Recommended Solution:** Recalculate ratings after any review deletion

#### **5. Availability Management**
- **Issue:** Working hours stored as JSON without validation
- **Risk Level:** Medium
- **Impact:** Data integrity issues
- **Current Mitigation:** Application-level validation
- **Recommended Solution:** Normalize working hours into separate table

### **Reporting / Analytics Limitations**

#### **1. MVP Reporting Gaps**
- **Issue:** No structured analytics data
- **Missing Metrics:** Revenue trends, booking patterns, popular services
- **Impact:** Cannot make data-driven decisions
- **Recommended Solution:** Implement analytics view/table for reporting

#### **2. Geographic Analysis Limitations**
- **Issue:** Location data not properly indexed
- **Impact:** Slow location-based searches
- **Current State:** Basic latitude/longitude storage
- **Recommended Solution:** Implement PostGIS extension for geographic queries

#### **3. Historical Data Preservation**
- **Issue:** Complete appointments history for past years
- **Impact:** Database growth without archiving strategy
- **Current State:** All appointments kept indefinitely
- **Recommended Solution:** Implement data archiving strategy

#### **4. Real-Time Availability**
- **Issue:** Availability checked on-demand
- **Impact:** Potential overbooking during high traffic
- **Current State:** Optimistic locking
- **Recommended Solution:** Implement pessimistic locking or queue system

### **Data Quality Issues**

#### **1. Incomplete Profiles**
- **Issue:** Barbers can operate with minimal profile information
- **Impact:** Poor customer experience
- **Current State:** Only essential fields required
- **Recommended Solution:** Implement profile completion tracking

#### **2. Missing Audit Trail**
- **Issue:** No comprehensive logging of data changes
- **Impact:** Cannot trace data modifications
- **Current State:** Only `updated_at` timestamps
- **Recommended Solution:** Implement trigger-based audit logging

#### **3. Data Validation Gaps**
- **Issue:** JSON fields (working_hours) have no schema validation
- **Impact:** Invalid data can be stored
- **Current State:** Basic application validation
- **Recommended Solution:** Database-level JSON schema validation

---

## 📝 **7. Usage Notes**

### **Entity Usage in Application**

#### **USERS Entity**
- **Authentication:** `email` and `password_hash` used for login
- **Authorization:** `role` determines access to barber/customer features
- **Profile Display:** `name`, `profile_image_url` shown in UI
- **Verification:** `is_verified` blocks sensitive operations until email confirmed
- **Activity Tracking:** `last_login` used for session management

#### **BARBERS Entity**
- **Discovery:** `city`, `state`, `latitude`, `longitude` used for location-based searches
- **Profile Display:** `salon_name`, `bio`, `portfolio`, `average_rating` shown to customers
- **Filtering:** `is_active`, `is_verified`, `average_rating` filter results
- **Business Hours:** `working_hours` JSON controls available booking times
- **Analytics:** `total_reviews`, `average_rating` used in barber rankings

#### **SERVICES Entity**
- **Booking:** Service details shown during appointment booking
- **Pricing:** `price` and `duration_minutes` used in booking calculations
- **Filtering:** `category` and `is_active` filters available services
- **Display:** `service_name`, `description` shown in barber profiles
- **Search:** Used in "find barbers by service" functionality

#### **APPOINTMENTS Entity**
- **Scheduling:** `appointment_date`, `start_time`, `end_time` manage calendar
- **Workflow:** `status` tracks request → confirmed → completed lifecycle
- **Conflict Detection:** Start/end times prevent double bookings
- **History:** Preserves complete booking history for customers and barbers
- **Revenue:** `total_price` captures revenue at booking time (price protection)
- **Notifications:** Timestamps trigger reminder notifications

#### **REVIEWS Entity**
- **Display:** `rating` and `review_text` shown in barber profiles
- **Statistics:** Used to calculate `barbers.average_rating`
- **Verification:** `is_verified` ensures only completed appointments reviewed
- **Analytics:** Reviews identify popular/improving barbers
- **Trust:** Reviews build customer confidence in barbers

#### **PORTFOLIO Entity**
- **Gallery:** `image_url` displayed in barber profile gallery
- **Showcase:** `is_featured` highlights best work
- **Categorization:** `service_category` organizes by service type
- **Before/After:** `image_type` creates transformation displays
- **Inspiration:** Used by customers to choose barbers

#### **FAVOURITES Entity**
- **Quick Access:** Customer's favorite barbers for easy rebooking
- **Personalization:** Creates personalized experience
- **Analytics:** Tracks popular barbers among customers

### **Usage in Reports**

#### **Booking Reports**
- **Data Source:** APPOINTMENTS table
- **Metrics:** Total bookings, revenue, booking trends
- **Dimensions:** Date range, barber, service, status
- **Usage:** Admin dashboard, barber analytics

#### **Rating Reports**
- **Data Source:** REVIEWS + BARBERS tables
- **Metrics:** Average rating, rating distribution, rating trends
- **Dimensions:** Barber, time period, service category
- **Usage:** Performance tracking, ranking barbers

#### **Service Popularity Reports**
- **Data Source:** APPOINTMENTS + SERVICES tables
- **Metrics:** Booking count, revenue per service, service trends
- **Dimensions:** Service category, time period, barber
- **Usage:** Service optimization, inventory planning

#### **Customer Analytics Reports**
- **Data Source:** APPOINTMENTS + USERS tables
- **Metrics:** Customer retention, booking frequency, lifetime value
- **Dimensions:** Customer segment, barber, time period
- **Usage:** Customer segmentation, marketing strategy

#### **Geographic Reports**
- **Data Source:** BARBERS table (latitude/longitude)
- **Metrics:** Barber density, booking concentration, market coverage
- **Dimensions:** City, state, postal code
- **Usage:** Market expansion, location optimization

### **Cross-Entity Usage Patterns**

#### **Barber Discovery Flow**
1. Customer searches by location (`barbers.city`, `barbers.latitude/longitude`)
2. Filter by rating (`barbers.average_rating`)
3. View services (`services` linked to barber)
4. View portfolio (`portfolio` linked to barber)
5. Read reviews (`reviews` linked to barber)
6. Book appointment (creates `appointments` record)

#### **Appointment Management Flow**
1. Customer creates booking (`appointments.status = 'requested'`)
2. Barber receives notification (read `appointments` by barber_id)
3. Barber confirms (`appointments.status = 'confirmed'`, `confirmed_at` timestamp)
4. Appointment completed (`appointments.status = 'completed'`, `completed_at` timestamp)
5. System allows review submission (creates `reviews` record)

#### **Profile Management Flow**
1. User registers (creates `users` record)
2. If barber, create profile (creates `barbers` record)
3. Add services (creates `services` records)
4. Upload portfolio (creates `portfolio` records)
5. Set availability (updates `barbers.working_hours` JSON)

### **Performance Considerations**

#### **Optimization Opportunities**
- **Indexing:** Add indexes on frequently queried columns
  - `appointments.start_time` for schedule queries
  - `reviews.barber_id` for rating calculations
  - `barbers.city` for location searches
- **Caching:** Cache barber profiles and services for faster loading
- **Pagination:** Implement for large result sets (appointments, reviews)
- **Denormalization:** Consider caching `barbers.average_rating` (currently maintained)

#### **Query Optimization**
- Use JOINs efficiently to combine user + barber + service data
- Index foreign key columns for faster JOINs
- Use partial indexes for active records only (`is_active = true`)

---

## 📊 **Summary**

This checklist covers all 8 main entities with their 70+ attributes, 9 primary relationships, constraints, and CRUD operations for 4 user roles. The system is designed to support a barber booking platform with proper data integrity, security, and performance considerations.

### **Key Statistics**
- **Entities:** 8 main entities
- **Attributes:** 70+ total attributes
- **Relationships:** 9 primary relationships
- **User Roles:** 4 roles (Customer, Barber, Admin, System)
- **CRUD Operations:** 50+ distinct operations
- **Business Rules:** 57 implemented rules

### **Important Notes**
1. **Data Protection:** Price and historical data are protected through timestamps and capture at booking
2. **Audit Trail:** Created/updated timestamps on all entities support audit requirements
3. **Soft Delete:** Use of `is_active` flags preserves data history
4. **Referential Integrity:** All foreign keys maintained through constraints
5. **Scalability:** Design supports growth with proper indexing strategy

---

*This comprehensive data requirements checklist ensures robust, scalable, and secure data management for the BarberMatch MVP system.*

