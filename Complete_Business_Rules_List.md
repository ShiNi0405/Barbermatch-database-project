# Complete Business Rules List - BarberMatch

**Project:** BarberMatch MVP Booking Platform  
**Total Rules:** 57 Business Rules  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## 📋 **Complete List of All 57 Business Rules**

---

## **AUTHENTICATION & USER MANAGEMENT (9 Rules)**

### **User Registration Rules**

**RULE-001:** Each user must have a unique email address
- **Category:** Data Integrity
- **Enforcement:** Database unique constraint
- **Applies to:** User registration, email updates
- **Rationale:** Prevents account duplication and ensures unique identification

**RULE-002:** Users must select either 'customer' or 'barber' role during registration
- **Category:** Access Control
- **Enforcement:** Application validation
- **Applies to:** User registration
- **Rationale:** Determines user permissions and available features

**RULE-003:** Email verification is required before account activation
- **Category:** Security
- **Enforcement:** Application workflow
- **Applies to:** User registration
- **Rationale:** Prevents fake accounts and ensures valid contact information

**RULE-004:** Users cannot change their role after initial registration
- **Category:** Data Integrity
- **Enforcement:** Application restriction
- **Applies to:** Profile updates
- **Rationale:** Maintains business logic separation between customer and barber accounts

**RULE-005:** Minimum password length is 8 characters with at least one number
- **Category:** Security
- **Enforcement:** Application validation
- **Applies to:** Password creation, password updates
- **Rationale:** Ensures password strength and protects user accounts

### **User Profile Rules**

**RULE-006:** Customers must provide name, phone number, and location
- **Category:** Data Completeness
- **Enforcement:** Application validation
- **Applies to:** Customer registration, profile updates
- **Rationale:** Ensures essential customer contact information is available

**RULE-007:** Barbers must complete business profile with salon name, address, and contact information
- **Category:** Data Completeness
- **Enforcement:** Application validation
- **Applies to:** Barber profile creation, updates
- **Rationale:** Ensures barber businesses have complete operational information

**RULE-008:** Profile information cannot be deleted, only updated
- **Category:** Data Preservation
- **Enforcement:** Application restriction
- **Applies to:** Profile management
- **Rationale:** Maintains audit trail and prevents data loss

**RULE-009:** Users can only edit their own profile information
- **Category:** Access Control
- **Enforcement:** Application security
- **Applies to:** Profile updates
- **Rationale:** Prevents unauthorized profile modifications

---

## **BARBER MANAGEMENT (5 Rules)**

### **Barber Profile Rules**

**RULE-010:** Barbers must provide valid business license information
- **Category:** Business Verification
- **Enforcement:** Application validation (optional field)
- **Applies to:** Barber profile creation, updates
- **Rationale:** Ensures barbers operate legitimate businesses

**RULE-011:** Salon name must be unique within the same city
- **Category:** Data Integrity
- **Enforcement:** Database unique constraint
- **Applies to:** Barber profile creation, salon name updates
- **Rationale:** Prevents duplicate businesses in same location

**RULE-012:** Barbers must set their working hours and availability
- **Category:** Data Completeness
- **Enforcement:** Application validation
- **Applies to:** Barber profile creation, availability management
- **Rationale:** Ensures customers can book during barber's operating times

**RULE-013:** Barber profiles must include at least one service offering
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Barber profile activation
- **Rationale:** Ensures barbers can receive appointments

**RULE-014:** Barbers cannot delete their profile if they have pending appointments
- **Category:** Data Integrity
- **Enforcement:** Application validation
- **Applies to:** Profile deletion
- **Rationale:** Maintains appointment integrity and prevents orphaned bookings

---

## **SERVICE MANAGEMENT (5 Rules)**

### **Service Management Rules**

**RULE-015:** Each service must have a name, description, price, and duration
- **Category:** Data Completeness
- **Enforcement:** Application validation
- **Applies to:** Service creation, updates
- **Rationale:** Ensures complete service information for booking decisions

**RULE-016:** Service prices must be positive values (greater than 0)
- **Category:** Data Validation
- **Enforcement:** Database check constraint
- **Applies to:** Service creation, price updates
- **Rationale:** Prevents invalid pricing and ensures meaningful price data

**RULE-017:** Service duration must be between 15 minutes and 4 hours (240 minutes)
- **Category:** Data Validation
- **Enforcement:** Database check constraint + application validation
- **Applies to:** Service creation, duration updates
- **Rationale:** Ensures realistic service duration within reasonable bounds

**RULE-018:** Barbers can have maximum 20 active services
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Service creation
- **Rationale:** Prevents service clutter and maintains focused offerings

**RULE-019:** Services cannot be deleted if they have future appointments
- **Category:** Data Integrity
- **Enforcement:** Application validation
- **Applies to:** Service deletion
- **Rationale:** Maintains appointment integrity and preserves historical data

---

## **APPOINTMENT BOOKING (12 Rules)**

### **Booking Creation Rules**

**RULE-020:** Customers can only book appointments with active barbers
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Ensures customers only book with available barbers

**RULE-021:** Appointments must be scheduled at least 2 hours in advance
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Gives barbers adequate notice and prevents last-minute disruptions

**RULE-022:** Appointments cannot be scheduled more than 30 days in advance
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Maintains reasonable booking window and prevents over-planning

**RULE-023:** Each customer can only have one appointment per barber per time slot
- **Category:** Data Integrity
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Prevents duplicate bookings and scheduling conflicts

**RULE-024:** Appointments must be within barber's working hours
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Ensures appointments occur during business operations

**RULE-025:** Booking requests expire after 24 hours if not responded to by barber
- **Category:** Business Logic
- **Enforcement:** Automated system process
- **Applies to:** Appointment status management
- **Rationale:** Prevents hanging requests and frees up time slots for others

### **Appointment Status Rules**

**RULE-026:** New appointments start with 'requested' status
- **Category:** Business Process
- **Enforcement:** Application default
- **Applies to:** Appointment creation
- **Rationale:** Establishes clear workflow from request to confirmation

**RULE-027:** Only barbers can change appointment status from 'requested' to 'confirmed' or 'rejected'
- **Category:** Access Control
- **Enforcement:** Application authorization
- **Applies to:** Appointment status updates
- **Rationale:** Ensures barbers control their own schedule and bookings

**RULE-028:** Customers can cancel appointments up to 2 hours before scheduled time
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment cancellation
- **Rationale:** Gives barbers sufficient notice to fill the time slot

**RULE-029:** Barbers can cancel appointments up to 1 hour before scheduled time
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment cancellation
- **Rationale:** Allows barbers emergency cancellation with minimal notice

**RULE-030:** Completed appointments cannot be modified or deleted
- **Category:** Data Integrity
- **Enforcement:** Application restriction
- **Applies to:** Appointment history
- **Rationale:** Preserves historical records for accounting and reporting

### **Scheduling Rules**

**RULE-031:** No double booking allowed - each barber can only have one appointment per time slot
- **Category:** Data Integrity
- **Enforcement:** Application validation + database constraints
- **Applies to:** Appointment creation
- **Rationale:** Prevents scheduling conflicts and ensures appointment quality

**RULE-032:** Appointment duration must match the selected service duration
- **Category:** Data Integrity
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Ensures accurate scheduling and time allocation

**RULE-033:** Buffer time of 15 minutes required between consecutive appointments
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment creation
- **Rationale:** Provides transition time between appointments

**RULE-034:** Barbers must have at least 30 minutes break between appointments
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Appointment scheduling
- **Rationale:** Ensures barber well-being and service quality

---

## **REVIEW & RATING (9 Rules)**

### **Review Creation Rules**

**RULE-035:** Only customers who have completed appointments can leave reviews
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Review submission
- **Rationale:** Ensures reviews are based on actual service experience

**RULE-036:** Customers can only leave one review per completed appointment
- **Category:** Data Integrity
- **Enforcement:** Database unique constraint
- **Applies to:** Review submission
- **Rationale:** Prevents duplicate reviews and review manipulation

**RULE-037:** Reviews must be submitted within 7 days of appointment completion
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Review submission
- **Rationale:** Ensures reviews are based on recent memory and experience

**RULE-038:** Rating must be between 1 and 5 stars
- **Category:** Data Validation
- **Enforcement:** Database check constraint + application validation
- **Applies to:** Review submission
- **Rationale:** Standardizes rating scale for meaningful analytics

**RULE-039:** Review text is optional but rating is mandatory
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Review submission
- **Rationale:** Captures essential rating while allowing flexibility in feedback

### **Review Management Rules**

**RULE-040:** Reviews cannot be edited after submission
- **Category:** Data Integrity
- **Enforcement:** Application restriction
- **Applies to:** Review management
- **Rationale:** Maintains review authenticity and prevents manipulation

**RULE-041:** Reviews cannot be deleted by customers
- **Category:** Data Integrity
- **Enforcement:** Application authorization
- **Applies to:** Review deletion
- **Rationale:** Preserves review history and prevents deletion of negative reviews

**RULE-042:** Barbers cannot respond to reviews
- **Category:** Business Logic
- **Enforcement:** Application restriction
- **Applies to:** Review management
- **Rationale:** Maintains review objectivity and prevents conflicts

**RULE-043:** Inappropriate reviews can be flagged and removed by administrators
- **Category:** Content Moderation
- **Enforcement:** Application authorization
- **Applies to:** Review moderation
- **Rationale:** Maintains platform quality and removes abusive content

---

## **PORTFOLIO MANAGEMENT (5 Rules)**

### **Portfolio Upload Rules**

**RULE-044:** Only barbers can upload portfolio images
- **Category:** Access Control
- **Enforcement:** Application authorization
- **Applies to:** Portfolio uploads
- **Rationale:** Ensures portfolio content is barber-controlled

**RULE-045:** Maximum 20 images per barber portfolio
- **Category:** Business Logic
- **Enforcement:** Application validation
- **Applies to:** Portfolio uploads
- **Rationale:** Prevents portfolio clutter and ensures focused presentation

**RULE-046:** Images must be in JPG, PNG, or WebP format
- **Category:** Data Validation
- **Enforcement:** Application validation
- **Applies to:** Portfolio uploads
- **Rationale:** Ensures compatible image formats for web display

**RULE-047:** Maximum file size is 5MB per image
- **Category:** Performance
- **Enforcement:** Application validation
- **Applies to:** Portfolio uploads
- **Rationale:** Manages storage costs and ensures fast loading times

**RULE-048:** Images must be work-related (before/after haircuts)
- **Category:** Content Policy
- **Enforcement:** Content moderation (manual review)
- **Applies to:** Portfolio uploads
- **Rationale:** Ensures portfolio showcases professional work

---

## **DATA ACCESS & SECURITY (9 Rules)**

### **Data Access Rules**

**RULE-049:** Users can only access their own data
- **Category:** Security
- **Enforcement:** Row Level Security (RLS)
- **Applies to:** All data access
- **Rationale:** Protects user privacy and prevents unauthorized access

**RULE-050:** Barbers can view their own appointments and customer information for those appointments
- **Category:** Access Control
- **Enforcement:** Application authorization
- **Applies to:** Appointment viewing
- **Rationale:** Enables barbers to manage their bookings while respecting privacy

**RULE-051:** Customers can view their own appointments and barber information
- **Category:** Access Control
- **Enforcement:** Application authorization
- **Applies to:** Appointment viewing
- **Rationale:** Enables customers to manage their bookings

**RULE-052:** Public data includes barber profiles, services, and reviews
- **Category:** Data Classification
- **Enforcement:** Application logic
- **Applies to:** Data retrieval
- **Rationale:** Enables discovery and booking functionality

**RULE-053:** Administrators have read-only access to all data
- **Category:** Access Control
- **Enforcement:** Application authorization
- **Applies to:** Administrator operations
- **Rationale:** Allows monitoring without modification

### **Data Modification Rules**

**RULE-054:** Only authenticated users can modify data
- **Category:** Security
- **Enforcement:** Application authentication
- **Applies to:** All data modifications
- **Rationale:** Prevents anonymous changes and maintains audit trail

**RULE-055:** Data modifications are logged with timestamp and user ID
- **Category:** Audit Trail
- **Enforcement:** Database triggers
- **Applies to:** All data modifications
- **Rationale:** Enables tracking of changes for debugging and compliance

**RULE-056:** Critical data changes require confirmation
- **Category:** Security
- **Enforcement:** Application workflow
- **Applies to:** Critical operations (deletions, status changes)
- **Rationale:** Prevents accidental data loss or unauthorized changes

**RULE-057:** Deleted data is soft-deleted (marked as deleted, not physically removed)
- **Category:** Data Preservation
- **Enforcement:** Application logic
- **Applies to:** All deletions
- **Rationale:** Maintains historical data integrity and enables recovery

---

## 📊 **Summary by Category**

| Category | Rule Count | Rules |
|----------|------------|-------|
| **Authentication & User Management** | 9 | RULE-001 to RULE-009 |
| **Barber Management** | 5 | RULE-010 to RULE-014 |
| **Service Management** | 5 | RULE-015 to RULE-019 |
| **Appointment Booking** | 12 | RULE-020 to RULE-034 |
| **Review & Rating** | 9 | RULE-035 to RULE-043 |
| **Portfolio Management** | 5 | RULE-044 to RULE-048 |
| **Data Access & Security** | 9 | RULE-049 to RULE-057 |
| **TOTAL** | **57** | **RULE-001 to RULE-057** |

---

## 🔑 **Key Business Rule Types**

### **Data Integrity Rules (22)**
- Unique constraints (RULE-001, RULE-011, RULE-036)
- Referential integrity (RULE-014, RULE-019, RULE-030, RULE-031, RULE-040, RULE-041)
- Data preservation (RULE-008, RULE-057)

### **Business Logic Rules (18)**
- Workflow control (RULE-020, RULE-024, RULE-025, RULE-026, RULE-027)
- Time-based constraints (RULE-021, RULE-022, RULE-028, RULE-029, RULE-037)
- Scheduling logic (RULE-031, RULE-032, RULE-033, RULE-034)

### **Access Control Rules (10)**
- Role-based access (RULE-002, RULE-004, RULE-009, RULE-027, RULE-049, RULE-050, RULE-051, RULE-052, RULE-053)
- Authorization checks (RULE-044, RULE-054)

### **Data Validation Rules (7)**
- Format validation (RULE-016, RULE-017, RULE-038, RULE-046, RULE-047)
- Content validation (RULE-018, RULE-045)

### **Security Rules (4)**
- Authentication requirements (RULE-003, RULE-005, RULE-054)
- Data logging (RULE-055, RULE-056)

---

## 📝 **Application Throughout System**

### **Transaction Requirements (Section 9)**
All transactions reference specific business rules to ensure compliance.

### **Functional Requirements (Section 8)**
All functional requirements (FR-001 to FR-028) enforce relevant business rules.

### **Data Requirements (Data Requirements Checklist)**
All entities, attributes, and relationships are governed by these business rules.

### **CRUD Matrix (CRUD Matrix Document)**
All CRUD operations respect access control and business logic rules.

---

## ✅ **Compliance Checklist**

When implementing the system:

- [ ] **Authentication:** Verify RULE-001 to RULE-005
- [ ] **User Profiles:** Enforce RULE-006 to RULE-009
- [ ] **Barber Profiles:** Implement RULE-010 to RULE-014
- [ ] **Services:** Validate RULE-015 to RULE-019
- [ ] **Appointments:** Apply RULE-020 to RULE-034
- [ ] **Reviews:** Enforce RULE-035 to RULE-043
- [ ] **Portfolio:** Validate RULE-044 to RULE-048
- [ ] **Security:** Implement RULE-049 to RULE-057

---

*These 57 business rules provide comprehensive coverage of all operational requirements for the BarberMatch system, ensuring data integrity, security, and proper business logic enforcement.*



