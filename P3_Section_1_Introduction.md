# Phase 3: Database Logical Design (Schema)
## BarberMatch Database System

**Subject:** Database (SECD2523)  
**Section:** Section 1-7  
**Task:** Phase 3 (P3) – Database Logical Design (Schema)  
**Prepared by:** Shi Ni Lai  
**Date:** January 2026

---

## 1.0 Introduction

### 1.1 Purpose of This Document

This document presents the **Database Logical Design** for the BarberMatch system, translating the conceptual design from Phase 2 into executable SQL schema definitions. This phase bridges the gap between conceptual modeling and physical implementation.

**Phase 3 focuses on:**
- Creating **SQL DDL (Data Definition Language)** scripts for all database objects
- Defining **table structures** with exact data types and constraints
- Implementing **referential integrity** through foreign key relationships
- Establishing **indexes** for query performance optimization
- Verifying **normalization** to BCNF (Boyce-Codd Normal Form)
- Providing **sample data** for testing and validation

### 1.2 Logical Design Overview

The logical design transforms the 7 conceptual entities into physical database tables:

| Conceptual Entity | Logical Table | Primary Purpose |
|-------------------|---------------|-----------------|
| USERS | `users` | Account management (customers & barbers) |
| BARBERS | `barbers` | Business profile storage |
| SERVICES | `services` | Service catalog management |
| APPOINTMENTS | `appointments` | Booking and scheduling |
| REVIEWS | `reviews` | Customer feedback system |
| PORTFOLIO | `portfolio` | Barber work showcase |
| FAVOURITES | `favourites` | Customer preferences |

### 1.3 Database Platform Specification

**Target DBMS:** MySQL 8.0+ or PostgreSQL 13+

**Key Features Required:**
- ✅ UUID data type support
- ✅ JSON column type for flexible data structures
- ✅ ENUM data type for controlled vocabularies
- ✅ Spatial indexing for geographic coordinates
- ✅ Foreign key constraints with CASCADE/RESTRICT
- ✅ CHECK constraints for data validation
- ✅ Triggers for automated updates
- ✅ Views for complex queries

### 1.4 Schema Design Principles

#### **Data Type Selection**
- **UUID** for all primary keys (security, uniqueness, scalability)
- **DECIMAL(10,2)** for monetary values (precision)
- **JSON** for flexible structures (working_hours)
- **ENUM** for controlled status values
- **TIMESTAMP** for audit trails

#### **Constraint Strategy**
- **PRIMARY KEY** on all tables (entity integrity)
- **FOREIGN KEY** for relationships (referential integrity)
- **UNIQUE** for business keys (salon_name + city, email)
- **CHECK** for business rules (rating 1-5, price > 0)
- **NOT NULL** for required fields

#### **Index Strategy**
- Primary keys (automatic B-tree indexes)
- Foreign keys (JOIN performance)
- Frequently filtered columns (status, city, category)
- Unique constraints (email, appointment slots)
- Spatial indexes (latitude, longitude)

### 1.5 Normalization Verification

All tables comply with **BCNF (Boyce-Codd Normal Form)**:

✅ **1NF:** All columns contain atomic values  
✅ **2NF:** No partial dependencies (all non-key attributes depend on entire primary key)  
✅ **3NF:** No transitive dependencies  
✅ **BCNF:** Every determinant is a candidate key

### 1.6 Document Structure

**Section 1.0: Introduction** (This section)  
Overview and design principles

**Section 2.0: Database Schema Design**  
Complete table definitions with SQL DDL scripts

**Section 3.0: SQL DDL Scripts**  
Executable CREATE TABLE, INDEX, and CONSTRAINT statements

**Section 4.0: Normalization Verification**  
Formal proof of BCNF compliance for all tables

**Section 5.0: Summary**  
Implementation readiness and validation results

### 1.7 Implementation Readiness

This Phase 3 deliverable provides:

✅ **Production-ready SQL scripts** that can be executed directly  
✅ **Complete schema definition** with all constraints and indexes  
✅ **Sample data scripts** for testing  
✅ **Normalization proof** showing design quality  
✅ **Performance optimization** through strategic indexing

---

**Next Section:** [Section 2.0 - Database Schema Design](P3_Section_2_Schema_Design.md)
