# Guard Package Management System - Database Summary

## Overview
This is a comprehensive guard/security package management system that tracks incoming and outgoing packages, handles delivery operations, manages employee/visitor entry-exit records, and provides access control for users.

---

## 1. CORE MODULES & PAGES

### 1.1 Authentication & Access Control (Admin Panel)
**Location:** `/app/Admin/`

#### Pages:
- **AddUser** (`/Admin/AddUser`)
  - Create new guard/admin users with auto-generated Access ID
  - Manage user credentials and roles

- **AllUsers** (`/Admin/AllUsers`)
  - View list of all system users
  - User management interface

- **DeleteUser** (`/Admin/DeleteUser`)
  - Remove users from system

#### Data Collected:
- Access ID (auto-generated, format: 000001, 000002, etc.)
- Name
- Username
- User Type (Admin, Guard, SuperAdmin)
- Password (hashed)
- Created Date/Time
- Status (Active/Inactive)

---

### 1.2 Package Management System
**Location:** `/app/pages/`

#### 1.2.1 INCOMING PACKAGE WORKFLOW

**Pages:**
1. **IncomingPackage** (`/pages/IncomingPackage`)
   - Create new incoming package entry
   - Captures complete package details on arrival

2. **AllIncomingPackage** (`/pages/AllIncomingPackage`)
   - View all incoming packages
   - Search and filter functionality

3. **IncomingPackageVerification** (`/pages/IncomingPackageVerification`)
   - Verify and add package to system
   - Guard verification with Guard ID modal

4. **AllPackage - IncomingPackageDetails** (`/pages/AllPackage/IncomingPackageDetails`)
   - View specific package details
   - Cancel or update package

5. **AllPackage - IncomingPackageUpdate** (`/pages/AllPackage/UpdatePackagePage/IncomingPackageUpdate`)
   - Re-add cancelled packages
   - Verification workflow before final addition

#### Data Fields - Incoming Package:
```
- Reference Number
- Tracking Number
- Package Type: "Incoming" (constant)
- Customer Name
- Employee Name
- Employee ID
- Department
- Delivery Company
- Delivery Person Name
- Vehicle Number
- Vehicle Type
- Time (captured at verification)
- Date (captured at verification)
- Guard ID (verification)
- Status (Active, Cancelled, Verified)
```

---

#### 1.2.2 OUTGOING PACKAGE WORKFLOW

**Pages:**
1. **OutgoingPackage** (`/pages/OutgoingPackage`)
   - Create new outgoing package entry
   - Captures package dispatch details

2. **AllOutgoingPackage** (`/pages/AllOutgoingPackage`)
   - View all outgoing packages
   - List and filter view

3. **OutgoingPackageVerification** (`/pages/OutgoingPackageVerification`)
   - Verify outgoing package
   - Guard verification with modal

4. **AllPackage - OutgoingPackageDetails** (`/pages/AllPackage/OutgoingPackageDetails`)
   - View specific outgoing package
   - Cancel or manage package

5. **AllPackage - OutgoingPackageUpdate** (`/pages/AllPackage/UpdatePackagePage/OutgoingPackageUpdate`)
   - Re-add cancelled packages
   - Final verification before addition

#### Data Fields - Outgoing Package:
```
- Reference Number
- Package Type: "Outgoing" (constant)
- Customer Name
- Package Description (Fragile, Standard, etc.)
- Employee Name
- Employee ID
- Department
- Delivery Company
- Delivery Person Name
- Vehicle Number
- Vehicle Type
- Time (captured at verification)
- Date (captured at verification)
- Guard ID (verification)
- Status (Active, Cancelled, Verified)
```

---

### 1.3 Entry & Exit Recording System
**Location:** `/pages/EntryExitRecording`

#### Purpose:
Track employee and visitor entry/exit/return movements

#### Data Collected:
```
- Movement Type: Entry, Exit, Return
- Person Type: Employee, Visitor
- Person ID / NIC Number (scanned or manually entered)
- Person Name (optional)
- Reason for Movement:
  
  Employee Reasons:
  - Off-site Meeting
  - Business Trip
  - Lunch Break
  - Client Visit
  - Training Session
  - Conference
  - Personal Appointment
  - Bank/Official Work
  - Doctor Appointment
  - Other

  Visitor Reasons:
  - Meeting
  - Delivery
  - Interview
  - Personal Visit
  - Service/Maintenance
  - Inspection
  - Other

- Time (auto-captured)
- Date (auto-captured)
- Timestamp (ISO format)
```

---

### 1.4 Dashboard & Reporting
**Location:** `/pages/`

#### Pages:
1. **Dashboard** (`/pages/Dashbaord`)
   - System overview
   - Key metrics
   - Quick access to main functions

2. **Report** (`/pages/Report`)
   - Generate reports
   - View analytics and statistics

3. **AllPackage** (`/pages/AllPackage`)
   - Unified package view
   - Both incoming and outgoing packages

---

## 2. CORE ENTITIES & RELATIONSHIPS

### Entity 1: Users (Access Control)
```sql
Table: users
- user_id (Primary Key, Auto-increment)
- access_id (Unique, String: 000001 format)
- name (String)
- username (String, Unique)
- password (String, Hashed)
- user_type (Enum: Admin, Guard, SuperAdmin)
- is_active (Boolean)
- created_at (DateTime)
- updated_at (DateTime)
```

**Permissions:**
```sql
Table: user_permissions
- permission_id (Primary Key)
- user_id (Foreign Key)
- dashboard_access (Boolean)
- add_ongoing_package (Boolean)
- add_income_package (Boolean)
- all_packages_view (Boolean)
- all_packages_edit (Boolean)
- all_packages_delete (Boolean)
- outgoing_verification (Boolean)
- income_verification (Boolean)
- access_management_add (Boolean)
- access_management_edit (Boolean)
- access_management_control (Boolean)
- system_access (Boolean)
- report_access (Boolean)
```

---

### Entity 2: Incoming Packages
```sql
Table: incoming_packages
- package_id (Primary Key, Auto-increment)
- reference_number (String, Unique)
- tracking_number (String)
- customer_name (String)
- employee_name (String)
- employee_id (String)
- department (String)
- delivery_company (String)
- delivery_person_name (String)
- vehicle_number (String)
- vehicle_type (String)
- recorded_time (Time)
- recorded_date (Date)
- verified_by_guard_id (String)
- verification_time (DateTime)
- status (Enum: Active, Cancelled, Verified)
- created_at (DateTime)
- updated_at (DateTime)
```

---

### Entity 3: Outgoing Packages
```sql
Table: outgoing_packages
- package_id (Primary Key, Auto-increment)
- reference_number (String, Unique)
- customer_name (String)
- description (String)
- employee_name (String)
- employee_id (String)
- department (String)
- delivery_company (String)
- delivery_person_name (String)
- vehicle_number (String)
- vehicle_type (String)
- recorded_time (Time)
- recorded_date (Date)
- verified_by_guard_id (String)
- verification_time (DateTime)
- status (Enum: Active, Cancelled, Verified)
- created_at (DateTime)
- updated_at (DateTime)
```

---

### Entity 4: Entry/Exit Records
```sql
Table: movement_records
- record_id (Primary Key, Auto-increment)
- movement_type (Enum: Entry, Exit, Return)
- person_type (Enum: Employee, Visitor)
- person_id (String) -- ID or NIC
- person_name (String)
- reason (String)
- recorded_time (Time)
- recorded_date (Date)
- timestamp (DateTime, ISO format)
- created_at (DateTime)
```

---

### Entity 5: Delivery Companies (Reference)
```sql
Table: delivery_companies
- company_id (Primary Key, Auto-increment)
- company_name (String, Unique)
- contact_number (String, Optional)
- email (String, Optional)
- is_active (Boolean)
```

**Sample Data:**
- DHL, FedEx, UPS, Local Courier, Vision Systems, Medical Systems, Tech Logistics, Doc Solutions, Express Delivery, Fast Track Courier

---

### Entity 6: Departments (Reference)
```sql
Table: departments
- department_id (Primary Key, Auto-increment)
- department_name (String, Unique)
- is_active (Boolean)
```

**Sample Data:**
- Logistics, Dispatch, Warehouse, Operations, Administration, Sales, ARC lab

---

### Entity 7: Vehicle Types (Reference)
```sql
Table: vehicle_types
- type_id (Primary Key, Auto-increment)
- type_name (String, Unique)
- is_active (Boolean)
```

**Sample Data:**
- Van, Motorcycle, Car, Pickup, Truck

---

### Entity 8: Customers (Reference)
```sql
Table: customers
- customer_id (Primary Key, Auto-increment)
- customer_name (String, Unique)
- contact_info (String, Optional)
- is_active (Boolean)
```

**Sample Data:**
- Vision care kaluthara, Vision care panadura
- Essilor Lanka
- Safilo Group
- Luxottica
- Medical Supplies Ltd
- Electronics Hub
- Document Services
- Tech Solutions
- Vision Systems

---

## 3. DATA FLOW DIAGRAMS

### Incoming Package Flow:
```
IncomingPackage (Create)
    ↓
GuardIdModal (Verify + Capture Time/Date)
    ↓
Database Entry (Active)
    ↓
AllIncomingPackage (View)
    ↓
[Cancel] → IncomingPackageUpdate (Load Cancelled Data)
    ↓
GuardIdModal (Re-verify)
    ↓
Database Entry (Re-added)
```

### Outgoing Package Flow:
```
OutgoingPackage (Create)
    ↓
GuardIdModal (Verify + Capture Time/Date)
    ↓
Database Entry (Active)
    ↓
AllOutgoingPackage (View)
    ↓
[Cancel] → OutgoingPackageUpdate (Load Cancelled Data)
    ↓
GuardIdModal (Re-verify)
    ↓
Database Entry (Re-added)
```

### Entry/Exit Recording Flow:
```
EntryExitRecording (Select Type + Scan ID)
    ↓
Auto-capture Time/Date
    ↓
Database Entry
    ↓
Alert Confirmation
    ↓
Form Reset
```

---

## 4. KEY BUSINESS LOGIC

### 4.1 Package Status Management
- **Active**: Package is in system, ready for processing
- **Cancelled**: Package marked for cancellation
- **Verified**: Package has been verified by guard and locked

### 4.2 Guard Verification
- Guard ID required for all package additions
- Time and Date auto-captured at verification moment
- Cannot modify time/date manually (system generates on modal open)

### 4.3 Access ID Generation
- Auto-generated sequentially with leading zeros
- Format: 000001, 000002, 000003, etc.
- Stored in localStorage (incremental counter)

### 4.4 Movement Recording
- ID can be scanned (barcode) or manually entered
- Enter key triggers automatic recording
- Time/Date auto-captured at record moment
- Supports both employee and visitor tracking

---

## 5. FIELD VALIDATION RULES

### Required Fields:
**Incoming Package:**
- Reference Number, Tracking Number, Customer Name, Employee Name, Delivery Company

**Outgoing Package:**
- Reference Number, Customer Name, Description, Employee Name, Delivery Company

**Entry/Exit:**
- Movement Type, Person ID, Person Type

**User Creation:**
- Access ID (auto), Name, Username, User Type, Password

### Format Rules:
- Reference Number: Alphanumeric
- Tracking Number: Alphanumeric
- Vehicle Number: Alphanumeric (e.g., "KL 1245")
- Time: HH:MM:SS AM/PM format
- Date: MM-DD-YYYY format
- Passwords: Minimum 6 characters

---

## 6. TIME TRACKING

All time data is captured automatically:
- **Package Records**: Captured when Guard verifies (GuardIdModal opens)
- **Movement Records**: Captured when record button clicked or Enter pressed
- **User Activities**: Tracked via created_at/updated_at timestamps

---

## 7. System Constants

### Movement Types:
- Entry
- Exit
- Return

### Person Types:
- Employee
- Visitor

### User Types:
- Admin
- Guard
- SuperAdmin

### Package Statuses:
- Active
- Cancelled
- Verified

### Package Types:
- Incoming
- Outgoing

---

## 8. RECOMMENDED DATABASE STRUCTURE

### Primary Tables (9 total):
1. **users** - User accounts and authentication
2. **user_permissions** - Role-based access control
3. **incoming_packages** - Incoming package records
4. **outgoing_packages** - Outgoing package records
5. **movement_records** - Entry/Exit tracking
6. **delivery_companies** - Reference data
7. **departments** - Reference data
8. **vehicle_types** - Reference data
9. **customers** - Reference data

### Indexes Recommended:
- users.username (Unique)
- users.access_id (Unique)
- incoming_packages.reference_number (Unique)
- incoming_packages.tracking_number
- outgoing_packages.reference_number (Unique)
- movement_records.person_id
- movement_records.recorded_date

### Foreign Key Relationships:
- user_permissions.user_id → users.user_id
- incoming_packages.delivery_company → delivery_companies.company_id
- outgoing_packages.delivery_company → delivery_companies.company_id
- incoming_packages.department → departments.department_id
- outgoing_packages.department → departments.department_id

---

## 9. AUDIT & LOGGING

All records should include:
- `created_at` - When record was created
- `updated_at` - When record was last modified
- `created_by` - User ID who created
- `updated_by` - User ID who last modified
- For packages: `verified_by_guard_id` - Guard who verified

---

## 10. PAGE SUMMARY TABLE

| Page | Module | Function | Key Data | Status |
|------|--------|----------|----------|--------|
| IncomingPackage | 📦 Package | Create incoming package | Tracking#, Ref#, Customer, Employee, Delivery | ✅ |
| IncomingPackageVerification | ✓ Verify | Verify incoming package | + Guard ID, Time, Date | ✅ |
| OutgoingPackage | 📦 Package | Create outgoing package | Ref#, Customer, Description, Employee | ✅ |
| OutgoingPackageVerification | ✓ Verify | Verify outgoing package | + Guard ID, Time, Date | ✅ |
| AllIncomingPackage | 📋 List | View all incoming packages | Filtering, Search | ✅ |
| AllOutgoingPackage | 📋 List | View all outgoing packages | Filtering, Search | ✅ |
| AllPackage | 📋 List | View all packages (unified) | Both types, Sort | ✅ |
| IncomingPackageDetails | 📄 Details | View package details | Cancel option | ✅ |
| OutgoingPackageDetails | 📄 Details | View package details | Cancel option | ✅ |
| IncomingPackageUpdate | ♻️ Update | Re-add cancelled package | Pre-filled data + Re-verify | ✅ |
| OutgoingPackageUpdate | ♻️ Update | Re-add cancelled package | Pre-filled data + Re-verify | ✅ |
| EntryExitRecording | 🚪 Access | Record entry/exit | Movement, ID, Reason | ✅ |
| Dashboard | 📊 Dashboard | System overview | Metrics, Quick access | ✅ |
| AddUser | 👤 Admin | Create new user | Access ID, Name, Type, Password | ✅ |
| AllUsers | 👥 Admin | View all users | User list, Management | ✅ |
| DeleteUser | 👤 Admin | Remove user | User selection | ✅ |
| Report | 📈 Analytics | Generate reports | Package stats, Movement records | ✅ |

---

## 11. NOTES FOR DATABASE IMPLEMENTATION

1. **Time Zone Handling**: Store all times in local format (HH:MM:SS AM/PM) and dates in MM-DD-YYYY format as per system design
2. **Access ID Generation**: Keep separate counter table or use application-level logic
3. **Package Status Tracking**: Implement soft delete with status field rather than actual deletion
4. **Guard Verification**: Link all package verifications to specific Guard ID for audit trail
5. **Concurrent Movements**: Entry/Exit system should handle rapid successive scans without race conditions
6. **Data Retention**: Consider retention policy for old records (archive after 1 year?)
7. **Search Optimization**: Index commonly searched fields (reference number, tracking number, person ID)

---

## END OF SYSTEM SUMMARY
