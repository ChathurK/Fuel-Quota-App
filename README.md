# Fuel Quota Management System

A comprehensive digital solution for managing fuel quotas during fuel crisis situations, consisting of a backend API, specialized web portals, and mobile application for fuel station operations.

## 🏗️ Project Overview

This system is designed to manage fuel crises for the general public by implementing controlled fuel quota distribution and monitoring. The platform addresses fuel shortage situations through systematic quota allocation, real-time transaction tracking, and automated notification systems for crisis management scenarios.

### System Highlights

**🚨 Crisis Management Platform**: Designed specifically for managing fuel shortages and crisis situations with controlled quota distribution

**🔗 DMT Database Integration**: Real-time vehicle validation through Department of Motor Traffic database connection ensuring authentic vehicle registration (In this project a mock dataset is used for validation.)

**📱 Dedicated Mobile Operations**: Android application exclusively for fuel station operators to scan QR codes and process fuel transactions

**🎯 Multi-Portal Architecture**: Three specialized web portals - vehicle owner registration, fuel station owner registration, and employee-only administration

**📊 Real-time Quota Monitoring**: Live tracking of fuel quotas and consumption during crisis periods with immediate balance updates

**📲 Mandatory SMS Notifications**: Automatic SMS alerts to vehicle owners after every fuel transaction via Twilio integration

**🔒 Secure QR Code System**: Unique QR code generation for each validated vehicle enabling quick identification and quota verification

### Key Features

- **Vehicle Registration Portal**: Online portal for vehicle owners to register by providing vehicle details with DMT database validation
- **DMT Database Validation**: Automatic verification of vehicle information through Department of Motor Traffic database (Mock database) connection
- **Unique QR Code Generation**: System generates unique QR codes for each validated vehicle registration
- **Fuel Station Registration Portal**: Dedicated online portal for fuel station owners to register their stations
- **Employee-Only Admin Portal**: Restricted web portal for administrators to monitor fuel distribution and manage station registrations
- **Android Mobile Application**: Specialized app for fuel station operators to scan QR codes and check available fuel quotas
- **Real-time Quota Verification**: Instant display of available fuel balance when QR codes are scanned
- **Fuel Transaction Processing**: Mobile app interface for operators to enter pumped fuel amounts after dispensing
- **Mandatory SMS Notifications**: Automatic SMS alerts sent to vehicle owners after each fuel transaction via Twilio
- **Crisis Management Dashboard**: Administrative tools for monitoring fuel distribution during crisis situations

## 🏛️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│Vehicle Owner    │    │Fuel Station     │    │ Employee-Only   │
│Registration     │    │Registration     │    │ Admin Portal    │
│Portal (React)   │    │Portal (React)   │    │   (React)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │     Backend API         │
                    │   (Spring Boot)         │
                    └─────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
    ┌──────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │   MySQL DB       │ │Android Mobile   │ │ External APIs   │
    │ ┌──────────────┐ │ │App (QR Scanner) │ │ ┌─────────────┐ │
    │ │- users       │ │ │for Fuel Station │ │ │Twilio SMS   │ │
    │ │- vehicles    │ │ │   Operators     │ │ │DMT Database │ │
    │ │- stations    │ │ └─────────────────┘ │ │(Mock)       │ │
    │ │- quotas      │ │                     │ └─────────────┘ │
    │ │- transactions│ │                     └─────────────────┘
    │ └──────────────┘ │
    └──────────────────┘                              
```

## 🚀 Quick Start Guide

### Prerequisites

- **Java 11+** (for backend)
- **Node.js 14+** (for frontend and mobile app)
- **MySQL 8.0+** (for database)
- **Expo CLI** (for mobile app development)

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Setup configuration
mv src/main/resources/application.properties.bak src/main/resources/application.properties

# Configure database and Twilio credentials (see backend/README.md)
# Edit src/main/resources/application.properties

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

**📋 Detailed Instructions:** See [`backend/README.md`](./backend/README.md) for complete setup guide including database configuration and Twilio SMS setup.

### 2. Web Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies and start
npm install
npm start
```

**📋 Detailed Instructions:** See [`frontend/README.md`](./frontend/README.md) for configuration options and troubleshooting.

### 3. Mobile App Setup

```powershell
# Navigate to mobile app directory
cd fuel-station-app

# Install dependencies and start
npm install
npm start
```

**📋 Detailed Instructions:** See [`fuel-station-app/README.md`](./fuel-station-app/README.md) for Expo setup and device testing.


## 📱 Application Screenshots

### 🎨 Complete UI/UX Design
**View key application screens and user interface designs:**

**[📋 Screenshots - Fuel Quota Management System](https://www.figma.com/design/HjhibLjptxvkwYCHav92QC/Fuel-Quota-Management-System?node-id=0-1&t=KwKoQSwZBfI2H69I-1)**

The Figma design includes:
- **Web Dashboard Screens**: Home Page, Login Page, Sign-Up Page, Admin dashboard, Station Manager Dashboard, Vehicle Owner Dashboard
- **Mobile Application Screens**: Login Screen, Home Screen, Transaction History, QR Scanner, Transaction Details Screen


## 📚 Documentation

- **Backend Setup**: [`backend/README.md`](./backend/README.md)
- **Frontend Setup**: [`frontend/README.md`](./frontend/README.md)
- **Mobile App Setup**: [`fuel-station-app/README.md`](./fuel-station-app/README.md)


## 👥 User Roles & Access

After the first backend startup, you can login with these default accounts:

| Role | Username | Password | Access |
|------|----------|----------|---------|
| Admin | `admin` | `password` | Full system management |
| Station Owner | `station` | `password` | Station operations |
| Vehicle Owner | `vehicle` | `password` | Vehicle quota checking |

### 🔹 System Administrator
- **Access**: Web Dashboard (Full Administrative Control)
- **Capabilities**: 
  - Complete user management (station owners, vehicle owners)
  - System-wide fuel station registration and monitoring
  - Comprehensive reports and analytics (consumption, utilization, performance)
  - Vehicle registration approval and management
  - Bulk quota allocation and emergency quota resets
  - System health monitoring and notification statistics
  - Transaction data export and top consumer reports

### 🔹 Station Owner  
- **Access**: Web Dashboard + Mobile Application
- **Capabilities**:
  - Fuel station profile management and updates
  - Mobile app for real-time fuel dispensing operations
  - QR code scanning for instant vehicle quota verification
  - Transaction history and daily/monthly sales reports
  - Station dashboard with performance metrics and statistics
  - Customer quota status checking and validation

### 🔹 Vehicle Owner
- **Access**: Web Dashboard (Self-Service Portal)
- **Capabilities**:
  - Vehicle registration with automatic QR code generation
  - Real-time quota status checking with usage breakdown
  - Complete transaction history viewing and analysis
  - Personal profile management and contact updates
  - Monthly quota allocation tracking and renewal status


## 🔒 Security & Business Rules

### Security Features
- **JWT Authentication**: Secure token-based authentication with role validation
- **Role-based Access Control**: Strict endpoint protection based on user roles
- **Input Validation**: Comprehensive server-side validation for all API endpoints
- **SQL Injection Protection**: JPA/Hibernate ORM with parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Business Rules Implementation
- **Transaction Limits**: Maximum 100 liters per single transaction
- **Fuel Type Validation**: Strict fuel type matching between vehicle and request
- **Quota Enforcement**: Real-time quota checking before fuel dispensing
- **Ownership Verification**: Users can only access their own vehicles/stations
- **Station Status**: Only active stations can process transactions
- **Monthly Reset**: Automatic quota renewal on the 1st of each month


## 💰 Fuel Quota Allocations

The system implements smart quota allocation based on vehicle type and specifications:

### Petrol Quotas (Monthly)
- **Cars**: 60L (80L for engines >1800cc)
- **Motorcycles**: 20L
- **Three Wheelers**: 40L

### Diesel Quotas (Monthly)
- **Cars**: 80L
- **Commercial Vehicles** (Bus/Lorry): 200L

### Automatic Management
- **Monthly Reset**: Automatic quota reset on the 1st of each month (configurable via cron)
- **Usage Tracking**: Real-time remaining quota calculation with percentage-based monitoring
- **Alert System**: Low quota warnings at 20% and critical alerts at 10% remaining
- **Expiration Monitoring**: Automatic detection and handling of quota period expiration


## 🛠️ Development

### Tech Stack
- **Backend**: Spring Boot 2.7+, Spring Security, JPA/Hibernate, MySQL 8.0+
- **Frontend**: React.js 18+, Material-UI, Axios for API communication
- **Mobile**: React Native with Expo SDK, React Navigation, Camera API
- **Database**: MySQL with comprehensive relational schema
- **External Services**: Twilio SMS API, DMT Integration APIs
- **Security**: JWT Authentication, Role-based Access Control (RBAC)
- **Notification**: Real-time SMS and Email notification system

### Project Structure
```
fuelQuotaManagementSystem/
├── backend/                 # Spring Boot API server
├── frontend/               # React.js web dashboard  
├── fuel-station-app/       # React Native mobile app
├── fuel_quota_db.sql       # Database schema
└── README.md              # This file
```

### Database Schema

The system uses MySQL database with the following key entities:

#### Core Tables
- **users**: System users with role-based access (ADMIN, STATION_OWNER, VEHICLE_OWNER)
- **vehicles**: Registered vehicles with QR codes and fuel type specifications
- **fuel_stations**: Registered fuel stations with owner relationships and fuel availability
- **fuel_quotas**: Monthly quota allocations with start/end dates and remaining balances
- **fuel_transactions**: Complete fuel dispensing records with quota deduction tracking


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

---

**🚀 Ready to get started?** Follow the Quick Start Guide above and refer to the individual README files for detailed setup instructions!
