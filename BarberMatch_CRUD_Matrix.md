# BarberMatch Database System - CRUD Matrix

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## **CRUD Matrix Overview**

The CRUD Matrix maps each user role to database entities, showing which operations (Create, Read, Update, Delete) each role can perform on each entity.

**Legend:**
- **C** = Create (INSERT)
- **R** = Read (SELECT) 
- **U** = Update (UPDATE)
- **D** = Delete (DELETE)
- **-** = No Access

---

## **CRUD Matrix Table**

| Entity | Customer | Barber | Admin | System |
|--------|----------|--------|-------|--------|
| **USERS** | C,R,U,- | C,R,U,- | R,-,-,- | R,U,-,- |
| **BARBERS** | R,-,-,- | C,R,U,- | R,-,-,- | R,U,-,- |
| **SERVICES** | R,-,-,- | C,R,U,D | R,-,-,- | R,U,-,- |
| **APPOINTMENTS** | C,R,U,- | R,U,-,- | R,-,-,- | C,R,U,- |
| **REVIEWS** | C,R,-,- | R,-,-,- | R,-,-,- | R,-,-,- |
| **PORTFOLIO** | R,-,-,- | C,R,U,D | R,-,-,- | R,U,-,- |
| **FAVOURITES** | C,R,-,D | -,-,-,- | R,-,-,- | -,-,-,- |

---

## **Detailed CRUD Operations by Entity**

### **USERS Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ✅ New registration | ✅ New registration | ❌ | ❌ | Register new barber or customer account |
| **READ** | ✅ Own profile | ✅ Own profile | ✅ All users | ✅ All users | Retrieve user profiles and role data |
| **UPDATE** | ✅ Own info | ✅ Own info | ❌ | ✅ Timestamps | Update personal info, contact, password |
| **DELETE** | ❌ | ❌ | ✅ Soft delete | ✅ Cleanup | Remove inactive or duplicate users |

### **BARBERS Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ❌ | ✅ Create profile | ❌ | ❌ | Barber creates business profile |
| **READ** | ✅ Public profiles | ✅ Own profile | ✅ All barbers | ✅ All barbers | View barber profiles |
| **UPDATE** | ❌ | ✅ Own profile | ❌ | ✅ Statistics | Barber modifies business info |
| **DELETE** | ❌ | ❌ | ✅ Soft delete | ❌ | Remove inactive barber profiles |

### **SERVICES Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ❌ | ✅ Add service | ❌ | ❌ | Barber adds new service (name, price, duration) |
| **READ** | ✅ Public services | ✅ Own services | ✅ All services | ✅ All services | Customers browse; Admin monitors listings |
| **UPDATE** | ❌ | ✅ Own services | ❌ | ✅ Status | Barber modifies service info |
| **DELETE** | ❌ | ✅ Own services | ❌ | ❌ | Barber deletes discontinued services |

### **APPOINTMENTS Entity (Bookings)**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ✅ Book appointment | ❌ | ❌ | ✅ Auto-create | Customer creates booking (status: pending) |
| **READ** | ✅ Own bookings | ✅ Own schedule | ✅ All bookings | ✅ All bookings | View bookings by date/status |
| **UPDATE** | ✅ Reschedule/cancel | ✅ Confirm/reject | ❌ | ✅ Status changes | Barber confirms/rejects; Customer reschedules |
| **DELETE** | ❌ | ❌ | ✅ Cancelled/expired | ✅ Cleanup expired | Admin or system deletes cancelled/expired bookings |

### **REVIEWS Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ✅ Submit review | ❌ | ❌ | ❌ | Customer submits review after completed booking |
| **READ** | ✅ Public reviews | ✅ Own reviews | ✅ All reviews | ✅ All reviews | Barber views received feedback |
| **UPDATE** | ✅ Edit review | ❌ | ❌ | ❌ | Customer edits or updates review |
| **DELETE** | ❌ | ❌ | ✅ Flagged reviews | ❌ | Admin removes flagged/inappropriate reviews |

### **AVAILABILITY Entity (Working Hours)**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ❌ | ✅ Set availability | ❌ | ❌ | Barber defines available days/time slots |
| **READ** | ✅ View open slots | ✅ Own schedule | ✅ All schedules | ✅ All schedules | Customers view open slots |
| **UPDATE** | ❌ | ✅ Modify hours | ❌ | ❌ | Barber modifies working hours |
| **DELETE** | ❌ | ✅ Block times | ❌ | ❌ | Barber removes specific time slots |

### **PORTFOLIO Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ❌ | ✅ Upload images | ❌ | ❌ | Barber uploads portfolio images or descriptions |
| **READ** | ✅ Public portfolio | ✅ Own portfolio | ✅ All portfolio | ✅ All portfolio | Customers view barber portfolios |
| **UPDATE** | ❌ | ✅ Edit descriptions | ❌ | ❌ | Barber edits portfolio descriptions |
| **DELETE** | ❌ | ✅ Remove images | ❌ | ❌ | Barber deletes outdated entries |

### **FAVOURITES Entity**

| Operation | Customer | Barber | Admin | System | Description |
|-----------|----------|--------|-------|--------|-------------|
| **CREATE** | ✅ Add favorite | ❌ | ❌ | ❌ | Customer adds favorite barber |
| **READ** | ✅ Own favorites | ❌ | ✅ All favorites | ✅ All favorites | View favorite barbers |
| **UPDATE** | ❌ | ❌ | ❌ | ❌ | No updates needed |
| **DELETE** | ✅ Remove favorite | ❌ | ❌ | ❌ | Customer removes favorite |

---

## **Role-Based Summary**

### **Customer Role**
- ✅ Register own account
- ✅ Browse barbers, services, portfolios
- ✅ Create and manage own appointments
- ✅ Submit and edit reviews
- ✅ Manage favorite barbers
- ❌ Cannot modify others' data

### **Barber Role**
- ✅ Register and manage business profile
- ✅ Add, edit, delete own services
- ✅ Set and modify availability schedule
- ✅ Upload and manage portfolio
- ✅ Confirm/reject appointment requests
- ✅ View own reviews and feedback
- ❌ Cannot modify customer data

### **Admin Role**
- ✅ Read-only access to all data
- ✅ Soft delete inactive users/barbers
- ✅ Delete flagged/inappropriate reviews
- ✅ Delete cancelled/expired appointments
- ✅ Monitor system activity
- ❌ Cannot modify active business data

### **System Role**
- ✅ Automatic timestamp updates
- ✅ Calculate barber ratings/statistics
- ✅ Auto-create appointments (validated)
- ✅ Auto-cleanup expired records
- ✅ Update appointment statuses
- ✅ Generate automated notifications

---

## **Security Considerations**

### **Row Level Security (RLS)**
- **Users:** Can only access their own records
- **Barbers:** Can only access their own business data
- **Customers:** Can only access their own appointments and reviews
- **Admins:** Read-only access to all data
- **System:** Full access for automated operations

### **Data Validation Rules**
- **Create Operations:** Validate required fields and business rules
- **Read Operations:** Apply appropriate filters based on user role
- **Update Operations:** Validate ownership and business constraints
- **Delete Operations:** Implement soft delete for critical data

### **Audit Trail**
- **All Operations:** Log user ID, timestamp, and operation type
- **Critical Changes:** Require confirmation for sensitive operations
- **Data Integrity:** Maintain referential integrity across all operations

---

## **Implementation Notes**

### **Database Constraints**
- **Foreign Key Constraints:** Ensure referential integrity
- **Unique Constraints:** Prevent duplicate records
- **Check Constraints:** Validate data ranges and formats
- **Not Null Constraints:** Ensure required fields are populated

### **Performance Optimization**
- **Indexes:** Create indexes on frequently queried columns
- **Query Optimization:** Use efficient JOIN operations
- **Caching:** Implement caching for frequently accessed data
- **Pagination:** Use pagination for large result sets

### **Error Handling**
- **Validation Errors:** Return clear error messages
- **Constraint Violations:** Handle database constraint violations
- **Permission Errors:** Return appropriate access denied messages
- **System Errors:** Log errors and return generic error messages

---

*This CRUD matrix provides a comprehensive mapping of user roles to database operations, ensuring proper access control and data security for the BarberMatch system.*




