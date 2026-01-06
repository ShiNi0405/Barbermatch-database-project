# Phase 2: Database Conceptual Design (ERD)
## BarberMatch Database System

**Subject:** Database (SECD2523)  
**Section:** Section 1-7  
**Task:** Phase 2 (P2) – Database Conceptual Design (ERD)  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 1.0 Introduction

### 1.1 Purpose of This Document

This document presents the **Database Conceptual Design** for the BarberMatch system, fulfilling the requirements of Phase 2 (P2) of the Database course (SECD2523). The conceptual design translates the business requirements identified in Phase 1 into a structured database model that serves as the foundation for the physical database implementation.

This phase focuses on:
- Defining the **conceptual Entity-Relationship Diagram (ERD)** that represents all entities, attributes, and relationships
- Creating an **Enhanced ERD (EERD)** incorporating advanced database features
- Documenting **business rules** that govern data integrity and operations
- Producing a comprehensive **data dictionary** for all database objects

### 1.2 Project Overview

**BarberMatch** is a comprehensive database-driven platform designed to revolutionize the barbershop industry by connecting customers with local barbers through an efficient booking and management system. The system addresses critical challenges including:

- **Manual booking processes** that lead to scheduling conflicts and errors
- **Limited online presence** for individual barbers
- **Poor customer experience** in finding and booking barber services
- **Lack of transparency** in pricing, availability, and service quality
- **Fragmented data management** across multiple systems

### 1.3 Database Scope

The BarberMatch database system manages the following core functions:

#### **User Management**
- Customer and barber account registration and authentication
- Profile management with role-based access control
- User verification and security

#### **Barber Management**
- Business profile creation with salon details
- Location-based services with GPS coordinates
- Working hours and availability management
- Portfolio showcase for barber work

#### **Service Management**
- Service catalog with pricing and duration
- Category-based service organization
- Service availability and status tracking

#### **Appointment Management**
- Real-time booking with conflict prevention
- Multi-status appointment workflow (requested, confirmed, cancelled, completed)
- Appointment history and tracking

#### **Review System**
- Customer feedback and ratings (1-5 stars)
- Verified review management
- Rating aggregation for barber profiles

#### **Favorites Management**
- Customer favorite barber lists
- Quick access to preferred barbers

### 1.4 Design Approach

The database design follows industry best practices:

**Normalization:** All tables are normalized to **Third Normal Form (3NF)** and **Boyce-Codd Normal Form (BCNF)** to eliminate data redundancy and ensure data integrity.

**Entity-Relationship Modeling:** The design uses **UML notation** for ERD representation, clearly showing entities, attributes, primary keys, foreign keys, and relationship cardinalities.

**Business Rule Enforcement:** The database enforces **57 comprehensive business rules** through constraints, triggers, and application logic.

**Performance Optimization:** Strategic indexing, efficient data types, and query optimization design ensure fast response times.

**Security:** Row-level security (RLS), password hashing, and role-based access control protect sensitive data.

**Scalability:** UUID primary keys, partitioning strategy, and cloud-ready architecture support future growth.

### 1.5 Database Entities Overview

The BarberMatch database consists of **7 core entities**:

| Entity | Purpose | Key Attributes |
|--------|---------|----------------|
| **USERS** | Manages all user accounts (customers & barbers) | user_id, email, role, name, phone |
| **BARBERS** | Stores barber business profiles | barber_id, salon_name, location, working_hours |
| **SERVICES** | Catalog of services offered by barbers | service_id, service_name, price, duration |
| **APPOINTMENTS** | Booking records and scheduling | appointment_id, date, time, status |
| **REVIEWS** | Customer feedback and ratings | review_id, rating, review_text |
| **PORTFOLIO** | Barber work showcase images | portfolio_id, image_url, image_type |
| **FAVOURITES** | Customer favorite barber lists | favourite_id, customer_id, barber_id |

### 1.6 Key Relationships

The database implements **9 primary relationships**:

1. **USERS ↔ BARBERS** (1:1) - One user can be one barber
2. **BARBERS ↔ SERVICES** (1:N) - One barber offers many services
3. **USERS ↔ APPOINTMENTS** (1:N) - One customer has many appointments
4. **BARBERS ↔ APPOINTMENTS** (1:N) - One barber receives many appointments
5. **SERVICES ↔ APPOINTMENTS** (1:N) - One service used in many appointments
6. **APPOINTMENTS ↔ REVIEWS** (1:1) - One appointment can have one review
7. **BARBERS ↔ PORTFOLIO** (1:N) - One barber has many portfolio images
8. **USERS ↔ FAVOURITES** (1:N) - One customer favorites many barbers
9. **BARBERS ↔ FAVOURITES** (1:N) - One barber favorited by many customers

### 1.7 Document Structure

This Phase 2 document is organized as follows:

**Section 1.0: Introduction** (This section)  
Provides overview, scope, and design approach

**Section 2.0: Data Flow Diagram (DFD)**  
Illustrates the To-Be system with data flows between processes

**Section 3.0: Data & Transaction Requirements**  
Documents business rules and transaction operations

**Section 4.0: Database Conceptual Design**  
Presents the Conceptual ERD and Enhanced ERD (EERD)

**Section 5.0: Data Dictionary**  
Details all tables, columns, data types, and constraints

**Section 6.0: Summary**  
Summarizes key design decisions and deliverables

### 1.8 Design Tools and Technologies

**Database Management System:** MySQL 8.0+ or PostgreSQL 13+  
**Modeling Tool:** ERD diagrams using Mermaid and PlantUML notation  
**Normalization:** BCNF (Boyce-Codd Normal Form)  
**Primary Key Strategy:** UUID for security and scalability  
**Data Types:** VARCHAR, TEXT, DECIMAL, INTEGER, BOOLEAN, TIMESTAMP, JSON, ENUM

### 1.9 Alignment with Phase 1

This conceptual design directly implements the requirements defined in Phase 1:

✅ **Problem Statement:** Addresses all identified pain points with centralized data management  
✅ **Functional Requirements:** All 28 functional requirements (FR-001 to FR-028) mapped to database entities  
✅ **Business Rules:** All 57 business rules (RULE-001 to RULE-057) enforced through database constraints  
✅ **Transaction Requirements:** All 59 transaction operations supported by the schema design  
✅ **Non-Functional Requirements:** Performance, security, and scalability built into the design

---

**Next Section:** [Section 2.0 - Data Flow Diagram (DFD)](P2_Section_2_DFD.md)
