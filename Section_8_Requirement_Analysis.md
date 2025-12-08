# Section 8: Requirement Analysis

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## 8.0 Requirement Analysis (AS-IS System, Functional & Non-Functional)

### 8.1 Current Business Process

#### 8.1.1 Current System Overview (AS-IS)

The current system for barber booking operates through a **manual, decentralized process** with the following characteristics:

**Existing Process Flow:**
1. **Customer Discovery:** Customers search for barbers through word-of-mouth, social media (Instagram, Facebook), or phone directories
2. **Initial Contact:** Phone calls or direct visits to barbershops to inquire about services and availability
3. **Service Information:** Barbers verbally communicate their services and pricing during in-person or phone consultations
4. **Booking Process:** Bookings are made through phone calls or walk-ins, recorded in physical appointment books or simple digital calendars
5. **Payment:** Cash or card payments made at the time of service
6. **Feedback:** Customer reviews are shared informally or through social media platforms

**Key Limitations of AS-IS System:**
- **No centralized booking system** - Customers must contact each barber individually
- **Uncertain availability** - No real-time visibility into available time slots
- **Limited service discovery** - Customers cannot easily compare prices, services, or ratings
- **Poor customer experience** - No online reviews, ratings, or portfolio visibility
- **Inefficient scheduling** - Manual booking leads to errors, double-booking, and missed appointments
- **No analytics** - Barbers cannot track business performance, popular services, or customer trends
- **Geographic limitations** - Customers can only find barbers they already know about in their local area

#### 8.1.2 Current Business Scenarios

**Scenario 1: Customer Seeks Haircut Service**
```
1. Customer decides they need a haircut
2. Customer searches for barbers nearby (Google Maps, social media)
3. Customer calls barber to check availability
4. Barber checks physical calendar or memory for open slots
5. If available, customer confirms booking via phone
6. Customer writes down appointment time and address
7. Customer visits barber at scheduled time
8. Service completed, payment made in cash/card
9. (Optional) Customer shares feedback informally
```

**Scenario 2: Barber Manages Bookings**
```
1. Barber opens shop for the day
2. Customers call or walk in for appointments
3. Barber checks availability manually (memory or calendar)
4. If slot available, records appointment in calendar/book
5. Barber performs service at scheduled time
6. Payment collected after service
7. (Rarely) Barber tracks performance manually
```

**Current Issues in These Scenarios:**
- Double-booking risk due to manual entry
- No reminders for customers or barbers
- Limited visibility of barber's work portfolio
- Price comparison requires multiple phone calls
- No systematic review collection
- Geographic barriers to finding barbers

#### 8.1.3 Current Workflow Diagrams

**Current Customer Booking Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│ Customer Decides to Get Service                        │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Search for Barbers                                     │
│ - Google Maps                                           │
│ - Social Media                                          │
│ - Phone Directory                                       │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Contact Barber by Phone or Walk-In                     │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Barber Checks Manual Calendar                          │
│ - Opens appointment book                                │
│ - Checks memory for availability                        │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Book Appointment (Write/Save)                          │
│ - Customer writes down time/date                        │
│ - Barber records in calendar                            │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Customer Visits at Scheduled Time                     │
│ - Service provided                                      │
│ - Payment made                                          │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Optional: Informal Feedback                           │
│ - Word-of-mouth                                         │
│ - Social media posts                                    │
└─────────────────────────────────────────────────────────┘
```

**Current Barber Management Workflow:**
```
┌─────────────────────────────────────────────────────────┐
│ Barber Opens Shop                                      │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Receive Bookings                                       │
│ - Phone calls                                           │
│ - Walk-ins                                              │
│ - Check manual calendar                                 │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Manual Scheduling                                      │
│ - Write in appointment book                             │
│ - Remember verbally                                     │
│ - Risk of double-booking                                │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Perform Service at Scheduled Time                     │
│ - Provide service                                       │
│ - Collect payment                                       │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Limited Record Keeping                                 │
│ - No analytics                                          │
│ - No performance tracking                               │
│ - No customer database                                  │
└─────────────────────────────────────────────────────────┘
```

#### 8.1.4 Problems with Current System

**For Customers:**
1. **Time-consuming discovery:** Multiple phone calls required to find available barbers
2. **Limited choice:** Cannot easily compare services, prices, or ratings
3. **Uncertainty:** No real-time availability information
4. **No reminders:** Risk of forgetting appointments
5. **Geographic limitations:** Cannot find barbers outside immediate area
6. **No portfolio visibility:** Cannot see barber's work quality before booking

**For Barbers:**
1. **No centralized platform:** Must rely on word-of-mouth and social media for customers
2. **Manual scheduling:** Physical calendars prone to errors and conflicts
3. **Limited reach:** Cannot attract customers outside local area
4. **No analytics:** Cannot track business performance or customer preferences
5. **Double-booking risk:** Manual entry leads to scheduling conflicts
6. **No digital portfolio:** Limited ability to showcase work quality

---

### 8.2 Functional Requirements

#### 8.2.1 User Management Functions

**FR-001: User Registration**
- System shall allow users to register with email, password, name, phone, and location
- System shall validate email format and password strength (8+ characters, 1+ number)
- System shall assign unique user ID automatically
- System shall require users to select role (customer or barber)
- **Business Rule:** RULE-001, RULE-002, RULE-005

**FR-002: User Authentication**
- System shall authenticate users via email and password
- System shall hash passwords securely using bcrypt
- System shall track last login timestamp
- System shall support session management
- **Business Rule:** RULE-003

**FR-003: User Profile Management**
- System shall allow users to update their profile information
- System shall restrict users to editing only their own profiles
- System shall prevent role changes after initial registration
- **Business Rule:** RULE-004, RULE-008, RULE-009

#### 8.2.2 Barber Management Functions

**FR-004: Barber Profile Creation**
- System shall allow barbers to create business profiles
- System shall require salon name, address, city, state, phone, and working hours
- System shall ensure salon name uniqueness per city
- System shall capture GPS coordinates (latitude/longitude) for location-based searches
- **Business Rule:** RULE-007, RULE-010, RULE-011, RULE-012

**FR-005: Barber Profile Updates**
- System shall allow barbers to update business information
- System shall prevent deletion of profiles with pending appointments
- System shall track average rating and total reviews
- System shall support portfolio uploads (max 20 images)
- **Business Rule:** RULE-014, RULE-045

**FR-006: Barber Discovery and Search**
- System shall allow customers to search barbers by location
- System shall filter barbers by rating, service type, and availability
- System shall display barber profiles with ratings, reviews, and portfolio
- System shall calculate distance from customer location to barber
- **Business Rule:** RULE-052

#### 8.2.3 Service Management Functions

**FR-007: Service Creation**
- System shall allow barbers to add services with name, description, price, and duration
- System shall validate price is positive and duration is 15-240 minutes
- System shall require barbers to have at least one active service
- System shall limit barbers to 20 active services maximum
- **Business Rule:** RULE-013, RULE-015, RULE-016, RULE-017, RULE-018

**FR-008: Service Updates**
- System shall allow barbers to modify service details
- System shall prevent deletion of services with future appointments
- System shall allow barbers to activate/deactivate services
- System shall track service popularity for analytics
- **Business Rule:** RULE-019

**FR-009: Service Browsing**
- System shall display all active services for selected barbers
- System shall allow filtering by category and price range
- System shall show service availability in real-time
- System shall calculate total price including any additional services
- **Business Rule:** RULE-052

#### 8.2.4 Appointment Management Functions

**FR-010: Appointment Booking**
- System shall allow customers to book appointments with active barbers
- System shall validate appointment time is at least 2 hours in future
- System shall validate appointment is not more than 30 days in advance
- System shall prevent double-booking by checking barber's existing appointments
- System shall check appointments are within barber's working hours
- System shall set initial status to 'requested' for barber confirmation
- **Business Rule:** RULE-020, RULE-021, RULE-022, RULE-023, RULE-024, RULE-026, RULE-031

**FR-011: Appointment Confirmation**
- System shall allow barbers to confirm requested appointments
- System shall allow barbers to reject requested appointments
- System shall set appointment status to 'confirmed' or 'rejected'
- System shall record confirmation timestamp
- System shall notify customer of barber's decision
- **Business Rule:** RULE-027

**FR-012: Appointment Cancellation**
- System shall allow customers to cancel appointments up to 2 hours before
- System shall allow barbers to cancel appointments up to 1 hour before
- System shall set appointment status to 'cancelled'
- System shall prevent cancellation of completed appointments
- System shall send cancellation notifications
- **Business Rule:** RULE-028, RULE-029, RULE-030

**FR-013: Appointment Completion**
- System shall allow barbers to mark appointments as completed
- System shall record completion timestamp
- System shall enable review submission after completion
- System shall update barber statistics
- System shall generate completion notification
- **Business Rule:** RULE-030, RULE-035

**FR-014: Appointment Expiry**
- System shall auto-expire booking requests after 24 hours without response
- System shall notify barber of pending requests
- System shall notify customer if request expires
- System shall free up time slot for other bookings
- **Business Rule:** RULE-025

#### 8.2.5 Review Management Functions

**FR-015: Review Submission**
- System shall allow customers to submit reviews for completed appointments only
- System shall limit customers to one review per appointment
- System shall require rating (1-5 stars) and allow optional review text
- System shall enforce review submission within 7 days of completion
- System shall mark reviews as verified
- **Business Rule:** RULE-035, RULE-036, RULE-037, RULE-038, RULE-039

**FR-016: Review Display**
- System shall display all reviews for a barber sorted by most recent
- System shall show verified purchase badge for review authenticity
- System shall calculate and display average rating
- System shall update barber's total reviews count
- System shall prevent barbers from editing or deleting reviews
- **Business Rule:** RULE-042

**FR-017: Review Moderation**
- System shall allow administrators to flag and remove inappropriate reviews
- System shall preserve review history for deleted reviews
- System shall recalculate barber ratings after review deletion
- System shall notify barber of review removal
- **Business Rule:** RULE-043

#### 8.2.6 Portfolio Management Functions

**FR-018: Portfolio Upload**
- System shall allow barbers to upload portfolio images
- System shall enforce file format (JPG, PNG, WebP)
- System shall limit file size to 5MB per image
- System shall limit maximum 20 images per barber portfolio
- System shall support image types: before, after, gallery
- System shall allow featured images for prominent display
- **Business Rule:** RULE-044, RULE-045, RULE-046, RULE-047, RULE-048

**FR-019: Portfolio Display**
- System shall display portfolio in barber profile gallery
- System shall show featured images prominently
- System shall organize images by service category
- System shall support zoom and full-screen viewing
- System shall be accessible to all customers
- **Business Rule:** RULE-052

**FR-020: Portfolio Management**
- System shall allow barbers to edit image descriptions and titles
- System shall allow barbers to delete their own portfolio images
- System shall preserve portfolio image history
- System shall maintain portfolio statistics
- **Business Rule:** RULE-044

#### 8.2.7 Favorite Management Functions

**FR-021: Add to Favorites**
- System shall allow customers to add barbers to favorites
- System shall prevent duplicate favorites (same customer-barber pair)
- System shall track favorite creation timestamp
- System shall enable quick access to favorite barbers
- **Business Rule:** (No specific rule, but data integrity constraint)

**FR-022: Manage Favorites**
- System shall allow customers to view their favorite barbers
- System shall allow customers to remove barbers from favorites
- System shall support favorite-based filtering in searches
- System shall provide shortcut to book with favorites
- **Business Rule:** (No specific rule, but user experience requirement)

#### 8.2.8 Analytics and Reporting Functions

**FR-023: Barber Analytics**
- System shall calculate barber's average rating from reviews
- System shall count total reviews per barber
- System shall track booking statistics (requests, confirmations, completions)
- System shall provide revenue tracking
- System shall generate performance reports
- **Business Rule:** (Derived from review and appointment data)

**FR-024: Service Analytics**
- System shall identify most popular services
- System shall track service booking frequency
- System shall calculate revenue per service
- System shall provide service performance metrics
- System shall support data-driven service optimization
- **Business Rule:** (Derived from appointment and service data)

**FR-025: Customer Analytics**
- System shall track customer booking frequency
- System shall calculate customer lifetime value
- System shall identify customer segments
- System shall support personalized recommendations
- System shall provide customer retention metrics
- **Business Rule:** (Derived from appointment and user data)

#### 8.2.9 Search and Discovery Functions

**FR-026: Location-Based Search**
- System shall find barbers within specified radius of customer location
- System shall calculate and display distance to barbers
- System shall sort results by distance (nearest first)
- System shall integrate with GPS/map services
- System shall support postal code-based searches
- **Business Rule:** RULE-052 (public data access)

**FR-027: Filtered Search**
- System shall filter barbers by minimum rating
- System shall filter by service type and category
- System shall filter by price range
- System shall filter by availability
- System shall combine multiple filters
- **Business Rule:** RULE-052

**FR-028: Full-Text Search**
- System shall support searching barber names, salon names, and services
- System shall search service descriptions and barber bios
- System shall rank results by relevance
- System shall provide search suggestions
- System shall support auto-complete functionality
- **Business Rule:** RULE-052

---

### 8.3 Non-Functional Requirements

#### 8.3.1 Performance Requirements

**NFR-001: Response Time**
- System shall respond to simple queries in less than 100ms
- System shall respond to complex queries in less than 500ms
- System shall respond to bulk operations in less than 2 seconds
- System shall maintain real-time updates with latency under 50ms
- **Priority:** High

**NFR-002: Throughput**
- System shall support 1000+ concurrent users
- System shall handle 100+ simultaneous booking requests
- System shall process 1000+ queries per second
- System shall maintain performance under peak load
- **Priority:** High

**NFR-003: Scalability**
- System shall handle 10x data growth without performance degradation
- System shall scale to 100,000+ users
- System shall support multiple geographic regions
- System shall accommodate 10,000+ barber profiles
- **Priority:** Medium

#### 8.3.2 Security Requirements

**NFR-004: Authentication Security**
- System shall use secure password hashing (bcrypt)
- System shall enforce minimum password requirements (8+ chars, 1+ number)
- System shall implement session management with secure tokens
- System shall require email verification before account activation
- System shall log all authentication attempts
- **Priority:** High

**NFR-005: Data Protection**
- System shall encrypt sensitive data at rest and in transit (TLS/SSL)
- System shall implement Row Level Security (RLS) for data isolation
- System shall prevent unauthorized access to user data
- System shall audit all data modifications
- System shall protect against SQL injection and XSS attacks
- **Priority:** High

**NFR-006: Access Control**
- System shall enforce role-based access control (Customer, Barber, Admin)
- System shall restrict users to accessing only their own data
- System shall provide read-only access to public data
- System shall require admin privileges for sensitive operations
- System shall log all access attempts
- **Priority:** High

#### 8.3.3 Reliability Requirements

**NFR-007: Availability**
- System shall maintain 99.9% uptime (less than 8.76 hours downtime/year)
- System shall implement automated failover mechanisms
- System shall provide backup systems for critical operations
- System shall support graceful degradation during high load
- System shall notify administrators of system issues
- **Priority:** High

**NFR-008: Data Backup and Recovery**
- System shall perform automated daily backups
- System shall retain backups for minimum 30 days
- System shall support point-in-time recovery
- System shall test backup restoration procedures monthly
- System shall protect backup data with encryption
- **Priority:** High

**NFR-009: Error Handling**
- System shall log all errors for debugging
- System shall provide meaningful error messages to users
- System shall prevent data corruption on errors
- System shall implement transaction rollback for failed operations
- System shall notify administrators of critical errors
- **Priority:** Medium

#### 8.3.4 Usability Requirements

**NFR-010: User Interface**
- System shall provide intuitive and user-friendly interface
- System shall support mobile-responsive design
- System shall be accessible (WCAG 2.1 Level AA compliance)
- System shall support multiple languages (i18n)
- System shall provide clear navigation and search functionality
- **Priority:** Medium

**NFR-011: Accessibility**
- System shall support screen readers
- System shall provide keyboard navigation
- System shall use sufficient color contrast
- System shall support font size adjustment
- System shall comply with accessibility standards
- **Priority:** Medium

#### 8.3.5 Compatibility Requirements

**NFR-012: Browser Compatibility**
- System shall support Chrome (latest 2 versions)
- System shall support Firefox (latest 2 versions)
- System shall support Safari (latest 2 versions)
- System shall support Edge (latest 2 versions)
- System shall support mobile browsers (Chrome Mobile, Safari Mobile)
- **Priority:** Medium

**NFR-013: Database Compatibility**
- System shall use PostgreSQL 13+ or MySQL 8.0+
- System shall support JSON data type for working_hours
- System shall support UUID primary keys
- System shall support JSON indexing and queries
- System shall support geographic queries (latitude/longitude)
- **Priority:** High

#### 8.3.6 Maintainability Requirements

**NFR-014: Code Quality**
- System shall follow consistent coding standards
- System shall include comprehensive code comments
- System shall implement proper error handling
- System shall use version control (Git)
- System shall maintain code documentation
- **Priority:** Medium

**NFR-015: Monitoring**
- System shall provide application performance monitoring
- System shall track system health metrics
- System shall log user activities for audit trails
- System shall provide real-time error alerts
- System shall support performance debugging
- **Priority:** Medium

#### 8.3.7 Legal and Compliance Requirements

**NFR-016: Data Privacy**
- System shall comply with GDPR data protection regulations
- System shall provide user data export functionality
- System shall support user data deletion requests
- System shall obtain user consent for data processing
- System shall maintain privacy policy
- **Priority:** High

**NFR-017: Data Retention**
- System shall retain appointment history indefinitely
- System shall retain user accounts while active
- System shall implement soft delete for data preservation
- System shall archive old data according to policy
- System shall comply with legal data retention requirements
- **Priority:** Medium

---

## 8.4 Summary

This requirement analysis covers both the current (AS-IS) manual system and the proposed (TO-BE) digital system. The functional requirements address all core business operations including user management, barber discovery, service management, appointment booking, reviews, and analytics. The non-functional requirements ensure the system is performant, secure, reliable, and maintainable.

**Key Improvements from AS-IS to TO-BE:**
1. **Centralized booking system** eliminates manual scheduling errors
2. **Real-time availability** prevents double-booking conflicts
3. **Enhanced discovery** allows customers to compare barbers easily
4. **Digital portfolio** showcases barber work quality
5. **Review system** builds trust and accountability
6. **Analytics dashboard** enables data-driven decisions
7. **Geographic reach** connects barbers with customers beyond local area

The requirements are designed to align with all 57 business rules defined in the system, ensuring comprehensive coverage of operational needs while maintaining security, performance, and scalability.

