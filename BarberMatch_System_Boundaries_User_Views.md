# BarberMatch System Boundaries & User Views

**Project:** BarberMatch MVP Booking Platform  
**Prepared by:** Shi Ni Lai  
**Date:** 24 October 2025

---

## **1. System Boundaries**

### **1.1 What is INCLUDED in the System**

#### **Core Booking Management**
- ✅ **Appointment Booking** - Customer can book appointments with barbers
- ✅ **Appointment Scheduling** - Real-time availability checking and conflict prevention
- ✅ **Appointment Status Management** - Requested → Confirmed → Completed workflow
- ✅ **Appointment Rescheduling** - Customer can modify appointment times
- ✅ **Appointment Cancellation** - Both customer and barber can cancel appointments

#### **User Management**
- ✅ **User Registration & Authentication** - Email/password based authentication
- ✅ **Role-Based Access Control** - Customer, Barber, Admin roles
- ✅ **User Profile Management** - Basic profile information and settings
- ✅ **Email Verification** - Account activation process

#### **Barber Management**
- ✅ **Barber Registration** - Business profile creation and verification
- ✅ **Service Management** - Add, edit, remove services with pricing
- ✅ **Availability Management** - Set working hours and availability calendar
- ✅ **Portfolio Management** - Upload and manage work showcase images
- ✅ **Business Profile** - Salon information, location, contact details

#### **Customer Features**
- ✅ **Barber Discovery** - Search and filter barbers by location, rating, services
- ✅ **Service Browsing** - View available services with pricing and duration
- ✅ **Appointment History** - View past and upcoming appointments
- ✅ **Rating System** - Rate completed appointments (1-5 stars)
- ✅ **Favorites Management** - Save favorite barbers for quick access

#### **Admin Features**
- ✅ **System Monitoring** - View all users, barbers, appointments, and reviews
- ✅ **Data Management** - Read-only access to all system data
- ✅ **User Account Management** - Monitor user accounts and activity
- ✅ **System Analytics** - Basic reporting and statistics

#### **Database Operations**
- ✅ **Data Storage** - All user data, appointments, services, reviews
- ✅ **Data Validation** - Business rules enforcement and constraint checking
- ✅ **Data Security** - Password hashing, input validation, access control
- ✅ **Data Backup** - Automated daily backups and recovery procedures

---

### **1.2 What is EXCLUDED from the System**

#### **Payment Processing**
- ❌ **Payment Gateway Integration** - No credit card processing
- ❌ **Online Payments** - No Stripe, PayPal, or other payment systems
- ❌ **Payment History** - No transaction records or billing
- ❌ **Refund Management** - No automated refund processing
- ❌ **Invoicing System** - No invoice generation or management

#### **Advanced Communication Features**
- ❌ **Real-time Chat** - No messaging between customers and barbers
- ❌ **Push Notifications** - No external notification system
- ❌ **Email Notifications** - No automated email reminders
- ❌ **SMS Notifications** - No text message alerts
- ❌ **Video Calls** - No video consultation features

#### **Advanced AI Features**
- ❌ **AI Hairstyle Recommendations** - No machine learning algorithms
- ❌ **Facial Recognition** - No image analysis or processing
- ❌ **Smart Scheduling** - No AI-powered appointment optimization
- ❌ **Predictive Analytics** - No demand forecasting or insights
- ❌ **Chatbot Support** - No automated customer service

#### **Financial Management**
- ❌ **Revenue Tracking** - No financial reporting or analytics
- ❌ **Commission Management** - No platform fee calculations
- ❌ **Tax Calculations** - No tax computation or reporting
- ❌ **Financial Reporting** - No profit/loss statements
- ❌ **Accounting Integration** - No accounting system integration

#### **Advanced Business Features**
- ❌ **Multi-location Support** - No chain salon management
- ❌ **Staff Management** - No employee scheduling or management
- ❌ **Inventory Management** - No product or supply tracking
- ❌ **Marketing Tools** - No promotional campaigns or discounts
- ❌ **Loyalty Programs** - No points or rewards system

#### **External Integrations**
- ❌ **Social Media Integration** - No Facebook, Instagram, Twitter integration
- ❌ **Map Services** - No Google Maps or navigation features
- ❌ **Calendar Integration** - No Google Calendar or Outlook sync
- ❌ **Third-party APIs** - No external service integrations
- ❌ **Mobile App Store** - No app store deployment

#### **Advanced Security Features**
- ❌ **Two-Factor Authentication** - No 2FA or MFA
- ❌ **Biometric Authentication** - No fingerprint or face recognition
- ❌ **Advanced Encryption** - No end-to-end encryption
- ❌ **Audit Logging** - No detailed audit trails
- ❌ **Compliance Features** - No GDPR or HIPAA compliance

---

## **2. User Views**

### **2.1 Customer User View**

#### **Primary Functions**
- **Discover Barbers** - Search and browse available barbers
- **Book Appointments** - Schedule appointments with preferred barbers
- **Manage Bookings** - View, reschedule, or cancel appointments
- **Rate Services** - Provide feedback on completed appointments
- **Manage Favorites** - Save and organize favorite barbers

#### **Data Access**
- **Own Profile** - View and edit personal information
- **Public Barber Profiles** - View barber information, services, and portfolios
- **Own Appointments** - View appointment history and upcoming bookings
- **Public Reviews** - View reviews from other customers
- **Own Favorites** - Manage saved barber list

#### **User Interface Screens**
1. **Home Dashboard** - Overview of upcoming appointments and quick actions
2. **Barber Discovery** - Search and filter barbers by location, rating, services
3. **Barber Profile** - View detailed barber information, services, and portfolio
4. **Appointment Booking** - Select service, date, and time for booking
5. **Appointment Management** - View, reschedule, or cancel appointments
6. **Settings** - Manage profile, preferences, and account settings

#### **Business Rules for Customers**
- Can only book appointments with active barbers
- Must book appointments at least 2 hours in advance
- Can cancel appointments up to 2 hours before scheduled time
- Can only rate completed appointments
- Can only have one appointment per barber per time slot

---

### **2.2 Barber User View**

#### **Primary Functions**
- **Manage Business Profile** - Update salon information and contact details
- **Manage Services** - Add, edit, or remove service offerings
- **Set Availability** - Configure working hours and availability calendar
- **Manage Appointments** - View, confirm, or reject booking requests
- **Showcase Work** - Upload and manage portfolio images

#### **Data Access**
- **Own Profile** - View and edit business information
- **Own Services** - Manage service offerings and pricing
- **Own Appointments** - View appointment schedule and customer information
- **Own Portfolio** - Manage work showcase images
- **Own Reviews** - View customer feedback and ratings

#### **User Interface Screens**
1. **Barber Dashboard** - Overview of appointments, reviews, and business metrics
2. **Appointment Management** - View upcoming appointments and manage requests
3. **Service Management** - Add, edit, or remove services with pricing
4. **Profile Management** - Update business information and contact details
5. **Portfolio Management** - Upload and organize work showcase images
6. **Availability Calendar** - Set working hours and manage schedule

#### **Business Rules for Barbers**
- Must complete business profile before receiving bookings
- Must have at least one active service offering
- Can only confirm or reject appointment requests
- Cannot delete profile if there are pending appointments
- Must respond to booking requests within 24 hours

---

### **2.3 Admin User View**

#### **Primary Functions**
- **System Monitoring** - View all system data and user activity
- **User Management** - Monitor user accounts and profiles
- **Data Analysis** - View system statistics and reports
- **Content Moderation** - Monitor reviews and portfolio content
- **System Maintenance** - Access system logs and error reports

#### **Data Access**
- **All Users** - View all customer and barber accounts
- **All Appointments** - View all booking records and status
- **All Services** - View all service offerings across barbers
- **All Reviews** - View all customer feedback and ratings
- **All Portfolios** - View all barber work showcase images
- **System Data** - Access system logs, errors, and performance metrics

#### **User Interface Screens**
1. **Admin Dashboard** - Overview of system statistics and key metrics
2. **User Management** - View and monitor all user accounts
3. **Appointment Overview** - View all appointments and booking trends
4. **Service Management** - Monitor all service offerings
5. **Review Management** - View and moderate customer reviews
6. **System Reports** - Generate and view system analytics

#### **Business Rules for Admins**
- Read-only access to all system data
- Cannot modify user accounts or appointments
- Cannot delete critical system data
- Can view system performance and error logs
- Can generate basic reports and statistics

---

## **3. System Scope Summary**

### **3.1 In-Scope Features**
| Feature Category | Description | Priority |
|------------------|-------------|----------|
| **Core Booking** | Appointment booking, scheduling, status management | Essential |
| **User Management** | Registration, authentication, profile management | Essential |
| **Barber Management** | Business profiles, services, availability, portfolio | Essential |
| **Customer Features** | Discovery, booking, rating, favorites | Essential |
| **Admin Features** | System monitoring, data viewing, basic reports | Essential |
| **Database Operations** | Data storage, validation, security, backup | Essential |

### **3.2 Out-of-Scope Features**
| Feature Category | Description | Reason |
|------------------|-------------|--------|
| **Payment Processing** | Credit card processing, billing, refunds | Academic project scope |
| **Advanced Communication** | Chat, notifications, email alerts | Complexity beyond MVP |
| **AI Features** | Machine learning, facial recognition, smart scheduling | Advanced technology |
| **Financial Management** | Revenue tracking, tax calculations, accounting | Business complexity |
| **External Integrations** | Social media, maps, calendar sync | Third-party dependencies |
| **Advanced Security** | 2FA, biometrics, compliance features | Enterprise-level features |

---

## **4. User View Matrix**

| User Role | Create | Read | Update | Delete | Special Permissions |
|-----------|--------|------|--------|--------|-------------------|
| **Customer** | Account, Appointments, Reviews, Favorites | Own data, Public barber info | Own profile, Own appointments | Own favorites | Can rate completed appointments |
| **Barber** | Account, Services, Portfolio | Own data, Customer info for appointments | Own profile, Services, Portfolio | Own services, Portfolio images | Can confirm/reject appointments |
| **Admin** | None | All system data | None | None | Read-only access to everything |

---

## **5. System Boundaries Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                    BARBERMATCH SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   CUSTOMER      │    │     BARBER      │                │
│  │                 │    │                 │                │
│  │ • Book Appts    │    │ • Manage Profile│                │
│  │ • Rate Services │    │ • Set Services  │                │
│  │ • View Barbers  │    │ • Manage Schedule│               │
│  │ • Manage Favs   │    │ • Upload Portfolio│              │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────────┬───────────┘                        │
│                       │                                    │
│  ┌─────────────────┐  │  ┌─────────────────┐                │
│  │     ADMIN       │  │  │   DATABASE      │                │
│  │                 │  │  │                 │                │
│  │ • Monitor Data  │  │  │ • Store Data    │                │
│  │ • View Reports  │  │  │ • Validate Rules│               │
│  │ • System Logs   │  │  │ • Backup Data   │                │
│  └─────────────────┘  │  └─────────────────┘                │
│                       │                                    │
├─────────────────────────────────────────────────────────────┤
│                    SYSTEM BOUNDARIES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ INCLUDED:                                                │
│  • Appointment Booking & Management                         │
│  • User Registration & Authentication                        │
│  • Barber Profile & Service Management                      │
│  • Customer Discovery & Rating                              │
│  • Admin Monitoring & Reporting                             │
│  • Database Operations & Security                           │
│                                                             │
│  ❌ EXCLUDED:                                                │
│  • Payment Processing & Billing                            │
│  • Real-time Communication & Notifications                  │
│  • AI Features & Machine Learning                           │
│  • Financial Management & Accounting                        │
│  • External Integrations & APIs                             │
│  • Advanced Security & Compliance                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## **6. Implementation Guidelines**

### **6.1 Development Priorities**
1. **Phase 1:** Core database schema and user authentication
2. **Phase 2:** Basic booking functionality and user interfaces
3. **Phase 3:** Advanced features and admin dashboard
4. **Phase 4:** Testing, optimization, and documentation

### **6.2 Success Criteria**
- ✅ All three user roles can access appropriate system functions
- ✅ Core booking workflow functions end-to-end
- ✅ Data integrity and security requirements met
- ✅ System boundaries clearly defined and maintained
- ✅ User views provide appropriate access and functionality

---

*This document provides a comprehensive overview of the BarberMatch system boundaries and user views, ensuring clear scope definition and role-based access control for the MVP implementation.*




