# BarberMatch Database ERD - Visual Representation

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## **Visual ERD Diagram**

```
                    ┌─────────────────┐
                    │      USERS      │
                    │                 │
                    │ user_id (PK)    │
                    │ email (UK)      │
                    │ password_hash   │
                    │ role            │
                    │ name            │
                    │ phone           │
                    │ location        │
                    │ profile_image   │
                    │ is_verified     │
                    │ is_active       │
                    │ created_at      │
                    │ updated_at      │
                    │ last_login      │
                    └─────────────────┘
                           │
                           │ 1:1
                           │
                    ┌─────────────────┐
                    │     BARBERS     │
                    │                 │
                    │ barber_id (PK)  │
                    │ user_id (FK)    │
                    │ salon_name      │
                    │ business_addr   │
                    │ city            │
                    │ state           │
                    │ postal_code     │
                    │ latitude        │
                    │ longitude       │
                    │ business_phone  │
                    │ business_email  │
                    │ business_license│
                    │ working_hours   │
                    │ bio             │
                    │ experience_yrs  │
                    │ average_rating  │
                    │ total_reviews   │
                    │ is_verified     │
                    │ is_active       │
                    │ created_at      │
                    │ updated_at      │
                    └─────────────────┘
                           │
                           │ 1:N
                           │
                    ┌─────────────────┐
                    │    SERVICES     │
                    │                 │
                    │ service_id (PK) │
                    │ barber_id (FK)  │
                    │ service_name    │
                    │ description     │
                    │ category        │
                    │ price           │
                    │ duration_mins   │
                    │ is_active       │
                    │ created_at      │
                    │ updated_at      │
                    └─────────────────┘
                           │
                           │ 1:N
                           │
                    ┌─────────────────┐
                    │   APPOINTMENTS  │
                    │                 │
                    │ appointment_id  │
                    │ customer_id (FK)│
                    │ barber_id (FK)  │
                    │ service_id (FK) │
                    │ appointment_date│
                    │ start_time      │
                    │ end_time        │
                    │ status          │
                    │ notes           │
                    │ total_price     │
                    │ created_at      │
                    │ updated_at      │
                    │ confirmed_at    │
                    │ completed_at    │
                    └─────────────────┘
                           │
                           │ 1:1
                           │
                    ┌─────────────────┐
                    │     REVIEWS     │
                    │                 │
                    │ review_id (PK)  │
                    │ appointment_id  │
                    │ customer_id (FK)│
                    │ barber_id (FK)  │
                    │ rating          │
                    │ review_text     │
                    │ is_verified    │
                    │ created_at      │
                    │ updated_at      │
                    └─────────────────┘

┌─────────────────┐                    ┌─────────────────┐
│     USERS       │                    │     BARBERS     │
│                 │                    │                 │
│ user_id (PK)    │                    │ barber_id (PK)  │
│ email (UK)      │                    │ user_id (FK)    │
│ password_hash   │                    │ salon_name      │
│ role            │                    │ business_addr   │
│ name            │                    │ city            │
│ phone           │                    │ state           │
│ location        │                    │ postal_code     │
│ profile_image   │                    │ latitude        │
│ is_verified     │                    │ longitude       │
│ is_active       │                    │ business_phone  │
│ created_at      │                    │ business_email  │
│ updated_at      │                    │ business_license│
│ last_login      │                    │ working_hours   │
└─────────────────┘                    │ bio             │
         │                             │ experience_yrs  │
         │ 1:N                         │ average_rating  │
         │                             │ total_reviews   │
         │                             │ is_verified     │
         │                             │ is_active       │
         │                             │ created_at      │
         │                             │ updated_at      │
         │                             └─────────────────┘
         │                                      │
         │                                      │ 1:N
         │                                      │
         │                             ┌─────────────────┐
         │                             │    PORTFOLIO    │
         │                             │                 │
         │                             │ portfolio_id    │
         │                             │ barber_id (FK)  │
         │                             │ image_url       │
         │                             │ image_type      │
         │                             │ title           │
         │                             │ description     │
         │                             │ service_category│
         │                             │ is_featured     │
         │                             │ created_at      │
         │                             │ updated_at      │
         │                             └─────────────────┘
         │
         │ 1:N
         │
┌─────────────────┐
│   FAVOURITES     │
│                 │
│ favourite_id (PK)│
│ customer_id (FK) │
│ barber_id (FK)   │
│ created_at       │
└─────────────────┘
```

---

## **Relationship Legend**

| Symbol | Meaning |
|--------|---------|
| **PK** | Primary Key |
| **FK** | Foreign Key |
| **UK** | Unique Key |
| **1:1** | One-to-One relationship |
| **1:N** | One-to-Many relationship |
| **N:M** | Many-to-Many relationship |

---

## **Entity Relationships**

### **Primary Relationships**

1. **USERS ↔ BARBERS (1:1)**
   - One user can be one barber
   - Foreign Key: barbers.user_id → users.user_id

2. **BARBERS ↔ SERVICES (1:N)**
   - One barber can have many services
   - Foreign Key: services.barber_id → barbers.barber_id

3. **USERS ↔ APPOINTMENTS (1:N)**
   - One customer can have many appointments
   - Foreign Key: appointments.customer_id → users.user_id

4. **BARBERS ↔ APPOINTMENTS (1:N)**
   - One barber can have many appointments
   - Foreign Key: appointments.barber_id → barbers.barber_id

5. **SERVICES ↔ APPOINTMENTS (1:N)**
   - One service can be used in many appointments
   - Foreign Key: appointments.service_id → services.service_id

6. **APPOINTMENTS ↔ REVIEWS (1:1)**
   - One appointment can have one review
   - Foreign Key: reviews.appointment_id → appointments.appointment_id

7. **BARBERS ↔ PORTFOLIO (1:N)**
   - One barber can have many portfolio images
   - Foreign Key: portfolio.barber_id → barbers.barber_id

8. **USERS ↔ FAVOURITES (1:N)**
   - One customer can favorite many barbers
   - Foreign Key: favourites.customer_id → users.user_id

9. **BARBERS ↔ FAVOURITES (1:N)**
   - One barber can be favorited by many customers
   - Foreign Key: favourites.barber_id → barbers.barber_id

---

## **Database Constraints**

### **Primary Key Constraints**
- All entities have UUID primary keys
- Primary keys are auto-generated and unique

### **Foreign Key Constraints**
- All foreign keys reference existing records
- Cascade delete rules for dependent records
- Referential integrity maintained across all relationships

### **Unique Constraints**
- **USERS.email** - Unique email addresses
- **BARBERS.salon_name + city** - Unique salon names per city
- **FAVOURITES.customer_id + barber_id** - Unique favorite combinations

### **Check Constraints**
- **USERS.role** - Must be 'customer' or 'barber'
- **REVIEWS.rating** - Must be between 1 and 5
- **SERVICES.price** - Must be greater than 0
- **SERVICES.duration_minutes** - Must be between 15 and 240
- **APPOINTMENTS.status** - Must be valid status enum

---

## **Normalization Status**

✅ **First Normal Form (1NF)** - All attributes contain atomic values  
✅ **Second Normal Form (2NF)** - No partial dependencies  
✅ **Third Normal Form (3NF)** - No transitive dependencies  
✅ **Boyce-Codd Normal Form (BCNF)** - All determinants are candidate keys  

---

## **Performance Indexes**

### **Primary Indexes**
- All primary keys (automatic)
- All foreign keys for JOIN operations

### **Unique Indexes**
- **USERS.email** - Fast email lookups
- **BARBERS.salon_name + city** - Business name searches

### **Composite Indexes**
- **APPOINTMENTS.barber_id + appointment_date** - Schedule queries
- **APPOINTMENTS.customer_id + status** - Customer appointment history
- **REVIEWS.barber_id + rating** - Rating calculations

### **Search Indexes**
- **BARBERS.city + state** - Location-based searches
- **SERVICES.category + is_active** - Service filtering
- **APPOINTMENTS.status + appointment_date** - Status filtering

---

*This visual ERD provides a clear representation of the BarberMatch database structure, showing all entities, relationships, and constraints for the MVP implementation.*