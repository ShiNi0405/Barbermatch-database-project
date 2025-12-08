# BarberMatch Database System
## Business Rules, Data Requirements & Transaction Requirements

---

## 📋 **Business Rules**

### **Authentication & User Management Rules**

#### **User Registration Rules**
- **RULE-001:** Each user must have a unique email address
- **RULE-002:** Users must select either 'customer' or 'barber' role during registration
- **RULE-003:** Email verification is required before account activation
- **RULE-004:** Users cannot change their role after initial registration
- **RULE-005:** Minimum password length is 8 characters with at least one number

#### **User Profile Rules**
- **RULE-006:** Customers must provide name, phone number, and location
- **RULE-007:** Barbers must complete business profile with salon name, address, and contact information
- **RULE-008:** Profile information cannot be deleted, only updated
- **RULE-009:** Users can only edit their own profile information

### **Barber Management Rules**

#### **Barber Profile Rules**
- **RULE-010:** Barbers must provide valid business license information
- **RULE-011:** Salon name must be unique within the same city
- **RULE-012:** Barbers must set their working hours and availability
- **RULE-013:** Barber profiles must include at least one service offering
- **RULE-014:** Barbers cannot delete their profile if they have pending appointments

#### **Service Management Rules**
- **RULE-015:** Each service must have a name, description, price, and duration
- **RULE-016:** Service prices must be positive values (greater than 0)
- **RULE-017:** Service duration must be between 15 minutes and 4 hours
- **RULE-018:** Barbers can have maximum 20 active services
- **RULE-019:** Services cannot be deleted if they have future appointments

### **Appointment Booking Rules**

#### **Booking Creation Rules**
- **RULE-020:** Customers can only book appointments with active barbers
- **RULE-021:** Appointments must be scheduled at least 2 hours in advance
- **RULE-022:** Appointments cannot be scheduled more than 30 days in advance
- **RULE-023:** Each customer can only have one appointment per barber per time slot
- **RULE-024:** Appointments must be within barber's working hours
- **RULE-025:** Booking requests expire after 24 hours if not responded to by barber

#### **Appointment Status Rules**
- **RULE-026:** New appointments start with 'requested' status
- **RULE-027:** Only barbers can change appointment status from 'requested' to 'confirmed' or 'rejected'
- **RULE-028:** Customers can cancel appointments up to 2 hours before scheduled time
- **RULE-029:** Barbers can cancel appointments up to 1 hour before scheduled time
- **RULE-030:** Completed appointments cannot be modified or deleted

#### **Scheduling Rules**
- **RULE-031:** No double booking allowed - each barber can only have one appointment per time slot
- **RULE-032:** Appointment duration must match the selected service duration
- **RULE-033:** Buffer time of 15 minutes required between consecutive appointments
- **RULE-034:** Barbers must have at least 30 minutes break between appointments

### **Review & Rating Rules**

#### **Review Creation Rules**
- **RULE-035:** Only customers who have completed appointments can leave reviews
- **RULE-036:** Customers can only leave one review per completed appointment
- **RULE-037:** Reviews must be submitted within 7 days of appointment completion
- **RULE-038:** Rating must be between 1 and 5 stars
- **RULE-039:** Review text is optional but rating is mandatory

#### **Review Management Rules**
- **RULE-040:** Reviews cannot be edited after submission
- **RULE-041:** Reviews cannot be deleted by customers
- **RULE-042:** Barbers cannot respond to reviews
- **RULE-043:** Inappropriate reviews can be flagged and removed by administrators

### **Portfolio Management Rules**

#### **Portfolio Upload Rules**
- **RULE-044:** Only barbers can upload portfolio images
- **RULE-045:** Maximum 20 images per barber portfolio
- **RULE-046:** Images must be in JPG, PNG, or WebP format
- **RULE-047:** Maximum file size is 5MB per image
- **RULE-048:** Images must be work-related (before/after haircuts)

### **Data Access & Security Rules**

#### **Data Access Rules**
- **RULE-049:** Users can only access their own data
- **RULE-050:** Barbers can view their own appointments and customer information for those appointments
- **RULE-051:** Customers can view their own appointments and barber information
- **RULE-052:** Public data includes barber profiles, services, and reviews
- **RULE-053:** Administrators have read-only access to all data

#### **Data Modification Rules**
- **RULE-054:** Only authenticated users can modify data
- **RULE-055:** Data modifications are logged with timestamp and user ID
- **RULE-056:** Critical data changes require confirmation
- **RULE-057:** Deleted data is soft-deleted (marked as deleted, not physically removed)

---

## 📊 **Data Requirements**

### **Entity Definitions**

#### **1. USERS Entity**
**Purpose:** Store user account information and authentication data

**Attributes:**
- `user_id` (Primary Key) - UUID, Auto-generated
- `email` - VARCHAR(255), Unique, Not Null
- `password_hash` - VARCHAR(255), Not Null
- `role` - ENUM('customer', 'barber'), Not Null
- `name` - VARCHAR(100), Not Null
- `phone` - VARCHAR(20), Not Null
- `location` - VARCHAR(255), Not Null
- `profile_image_url` - VARCHAR(500), Nullable
- `is_verified` - BOOLEAN, Default: false
- `is_active` - BOOLEAN, Default: true
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated
- `last_login` - TIMESTAMP, Nullable

#### **2. BARBERS Entity**
**Purpose:** Store barber business profile information

**Attributes:**
- `barber_id` (Primary Key) - UUID, Auto-generated
- `user_id` (Foreign Key) - UUID, References users.user_id
- `salon_name` - VARCHAR(100), Not Null
- `business_address` - VARCHAR(255), Not Null
- `city` - VARCHAR(50), Not Null
- `state` - VARCHAR(50), Not Null
- `postal_code` - VARCHAR(20), Not Null
- `latitude` - DECIMAL(10,8), Nullable
- `longitude` - DECIMAL(11,8), Nullable
- `business_phone` - VARCHAR(20), Not Null
- `business_email` - VARCHAR(255), Nullable
- `business_license` - VARCHAR(100), Nullable
- `working_hours` - JSON, Not Null
- `bio` - TEXT, Nullable
- `experience_years` - INTEGER, Default: 0
- `average_rating` - DECIMAL(3,2), Default: 0.00
- `total_reviews` - INTEGER, Default: 0
- `is_verified` - BOOLEAN, Default: false
- `is_active` - BOOLEAN, Default: true
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated

#### **3. SERVICES Entity**
**Purpose:** Store barber service offerings

**Attributes:**
- `service_id` (Primary Key) - UUID, Auto-generated
- `barber_id` (Foreign Key) - UUID, References barbers.barber_id
- `service_name` - VARCHAR(100), Not Null
- `description` - TEXT, Nullable
- `category` - VARCHAR(50), Not Null
- `price` - DECIMAL(10,2), Not Null
- `duration_minutes` - INTEGER, Not Null
- `is_active` - BOOLEAN, Default: true
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated

#### **4. APPOINTMENTS Entity**
**Purpose:** Store appointment booking information

**Attributes:**
- `appointment_id` (Primary Key) - UUID, Auto-generated
- `customer_id` (Foreign Key) - UUID, References users.user_id
- `barber_id` (Foreign Key) - UUID, References barbers.barber_id
- `service_id` (Foreign Key) - UUID, References services.service_id
- `appointment_date` - DATE, Not Null
- `start_time` - TIME, Not Null
- `end_time` - TIME, Not Null
- `status` - ENUM('requested', 'confirmed', 'rejected', 'cancelled', 'completed'), Default: 'requested'
- `notes` - TEXT, Nullable
- `total_price` - DECIMAL(10,2), Not Null
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated
- `confirmed_at` - TIMESTAMP, Nullable
- `completed_at` - TIMESTAMP, Nullable

#### **5. REVIEWS Entity**
**Purpose:** Store customer reviews and ratings

**Attributes:**
- `review_id` (Primary Key) - UUID, Auto-generated
- `appointment_id` (Foreign Key) - UUID, References appointments.appointment_id
- `customer_id` (Foreign Key) - UUID, References users.user_id
- `barber_id` (Foreign Key) - UUID, References barbers.barber_id
- `rating` - INTEGER, Not Null (1-5)
- `review_text` - TEXT, Nullable
- `is_verified` - BOOLEAN, Default: true
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated

#### **6. PORTFOLIO Entity**
**Purpose:** Store barber work portfolio images

**Attributes:**
- `portfolio_id` (Primary Key) - UUID, Auto-generated
- `barber_id` (Foreign Key) - UUID, References barbers.barber_id
- `image_url` - VARCHAR(500), Not Null
- `image_type` - ENUM('before', 'after', 'gallery'), Not Null
- `title` - VARCHAR(100), Nullable
- `description` - TEXT, Nullable
- `service_category` - VARCHAR(50), Nullable
- `is_featured` - BOOLEAN, Default: false
- `created_at` - TIMESTAMP, Auto-generated
- `updated_at` - TIMESTAMP, Auto-updated

#### **7. FAVOURITES Entity**
**Purpose:** Store customer's favorite barbers

**Attributes:**
- `favourite_id` (Primary Key) - UUID, Auto-generated
- `customer_id` (Foreign Key) - UUID, References users.user_id
- `barber_id` (Foreign Key) - UUID, References barbers.barber_id
- `created_at` - TIMESTAMP, Auto-generated

### **Data Relationships**

#### **Primary Relationships**
1. **Users → Barbers** (1:1)
   - One user can be one barber
   - One barber belongs to one user

2. **Barbers → Services** (1:Many)
   - One barber can have many services
   - One service belongs to one barber

3. **Users → Appointments** (1:Many)
   - One customer can have many appointments
   - One appointment belongs to one customer

4. **Barbers → Appointments** (1:Many)
   - One barber can have many appointments
   - One appointment belongs to one barber

5. **Services → Appointments** (1:Many)
   - One service can be booked in many appointments
   - One appointment uses one service

6. **Appointments → Reviews** (1:1)
   - One appointment can have one review
   - One review belongs to one appointment

7. **Barbers → Portfolio** (1:Many)
   - One barber can have many portfolio images
   - One portfolio image belongs to one barber

8. **Users → Favourites** (1:Many)
   - One customer can favorite many barbers
   - One favorite belongs to one customer

#### **Referential Integrity Constraints**
- All foreign keys must reference existing records
- Cascade delete rules for dependent records
- Unique constraints on composite keys where needed

---

## 🔄 **Transaction Requirements**

### **Data Entry Operations (INSERT)**

#### **User Management Operations**
- **INSERT_USER:** Create new user account
- **INSERT_BARBER_PROFILE:** Create barber business profile
- **INSERT_SERVICE:** Add new service offering
- **INSERT_APPOINTMENT:** Create new appointment booking
- **INSERT_REVIEW:** Submit customer review
- **INSERT_PORTFOLIO:** Upload portfolio image
- **INSERT_FAVOURITE:** Add barber to favorites

#### **Bulk Data Entry Operations**
- **BULK_INSERT_SERVICES:** Add multiple services for a barber
- **BULK_INSERT_PORTFOLIO:** Upload multiple portfolio images
- **BULK_INSERT_APPOINTMENTS:** Create recurring appointments

### **Data Update Operations (UPDATE)**

#### **Profile Management Operations**
- **UPDATE_USER_PROFILE:** Modify user information
- **UPDATE_BARBER_PROFILE:** Update barber business information
- **UPDATE_SERVICE:** Modify service details
- **UPDATE_APPOINTMENT_STATUS:** Change appointment status
- **UPDATE_WORKING_HOURS:** Modify barber availability
- **UPDATE_PORTFOLIO:** Edit portfolio image details

#### **Status Management Operations**
- **CONFIRM_APPOINTMENT:** Change status from requested to confirmed
- **REJECT_APPOINTMENT:** Change status from requested to rejected
- **CANCEL_APPOINTMENT:** Change status to cancelled
- **COMPLETE_APPOINTMENT:** Change status to completed
- **ACTIVATE_DEACTIVATE_SERVICE:** Toggle service availability

### **Data Delete Operations (DELETE)**

#### **Soft Delete Operations**
- **SOFT_DELETE_USER:** Mark user as inactive
- **SOFT_DELETE_BARBER:** Mark barber as inactive
- **SOFT_DELETE_SERVICE:** Mark service as inactive
- **SOFT_DELETE_APPOINTMENT:** Mark appointment as cancelled
- **SOFT_DELETE_PORTFOLIO:** Mark portfolio image as deleted

#### **Hard Delete Operations**
- **DELETE_FAVOURITE:** Remove barber from favorites
- **DELETE_DRAFT_APPOINTMENT:** Remove unconfirmed appointments older than 24 hours

### **Data Query Operations (SELECT)**

#### **Authentication Queries**
- **AUTHENTICATE_USER:** Verify user credentials
- **GET_USER_BY_EMAIL:** Retrieve user by email
- **GET_USER_PROFILE:** Retrieve complete user profile
- **CHECK_USER_ROLE:** Verify user role and permissions

#### **Barber Discovery Queries**
- **SEARCH_BARBERS_BY_LOCATION:** Find barbers near customer location
- **FILTER_BARBERS_BY_RATING:** Filter barbers by minimum rating
- **FILTER_BARBERS_BY_SERVICE:** Find barbers offering specific services
- **GET_BARBER_PROFILE:** Retrieve complete barber profile
- **GET_BARBER_SERVICES:** Retrieve all services for a barber
- **GET_BARBER_PORTFOLIO:** Retrieve barber's portfolio images
- **GET_BARBER_REVIEWS:** Retrieve barber's reviews and ratings

#### **Appointment Management Queries**
- **GET_CUSTOMER_APPOINTMENTS:** Retrieve customer's appointment history
- **GET_BARBER_APPOINTMENTS:** Retrieve barber's appointment schedule
- **GET_APPOINTMENTS_BY_STATUS:** Filter appointments by status
- **GET_APPOINTMENTS_BY_DATE:** Retrieve appointments for specific date
- **CHECK_APPOINTMENT_AVAILABILITY:** Verify time slot availability
- **GET_UPCOMING_APPOINTMENTS:** Retrieve future appointments

#### **Analytics & Reporting Queries**
- **GET_BARBER_STATISTICS:** Calculate barber performance metrics
- **GET_REVENUE_REPORT:** Generate revenue reports
- **GET_CUSTOMER_ANALYTICS:** Analyze customer behavior
- **GET_POPULAR_SERVICES:** Identify most requested services
- **GET_RATING_TRENDS:** Track rating changes over time

#### **Search & Filter Queries**
- **SEARCH_BARBERS:** Full-text search across barber profiles
- **SEARCH_SERVICES:** Search for specific services
- **FILTER_BY_PRICE_RANGE:** Filter services by price
- **FILTER_BY_DURATION:** Filter services by duration
- **FILTER_BY_CATEGORY:** Filter services by category

### **Complex Query Operations**

#### **Join Operations**
- **GET_APPOINTMENT_DETAILS:** Join appointments with customer, barber, and service data
- **GET_BARBER_WITH_STATS:** Join barber profile with statistics
- **GET_CUSTOMER_HISTORY:** Join customer with appointment and review history

#### **Aggregation Operations**
- **CALCULATE_AVERAGE_RATING:** Compute barber's average rating
- **COUNT_APPOINTMENTS:** Count appointments by status or date range
- **SUM_REVENUE:** Calculate total revenue for period
- **COUNT_REVIEWS:** Count reviews per barber

#### **Real-time Operations**
- **SUBSCRIBE_APPOINTMENT_UPDATES:** Real-time appointment status changes
- **SUBSCRIBE_BARBER_AVAILABILITY:** Real-time availability updates
- **SUBSCRIBE_NEW_REVIEWS:** Real-time review notifications

### **Performance Requirements**

#### **Response Time Requirements**
- **Simple Queries:** < 100ms response time
- **Complex Queries:** < 500ms response time
- **Bulk Operations:** < 2 seconds response time
- **Real-time Updates:** < 50ms latency

#### **Concurrency Requirements**
- **Concurrent Users:** Support 1000+ simultaneous users
- **Concurrent Bookings:** Handle 100+ simultaneous booking requests
- **Data Consistency:** Maintain ACID properties for critical operations

#### **Scalability Requirements**
- **Data Growth:** Handle 10x data growth without performance degradation
- **User Growth:** Scale to 100,000+ users
- **Geographic Distribution:** Support multiple regions with local data

---

*This comprehensive specification covers all business rules, data requirements, and transaction requirements for the BarberMatch database system, ensuring robust, scalable, and secure data management.*






