-- ============================================
-- 1. CREATE DATABASE
-- ============================================
CREATE DATABASE GuardSystemDB;
GO

USE GuardSystemDB;
GO

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    FullName NVARCHAR(150),
    Role NVARCHAR(50) DEFAULT 'User',
    Department NVARCHAR(100),
    Company NVARCHAR(150),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 3. INCOMING PACKAGES
-- ============================================
CREATE TABLE IncomingPackages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TrackingNumber NVARCHAR(100) NOT NULL UNIQUE, -- manual barcode
    ReferenceNumber NVARCHAR(100),
    Mode NVARCHAR(20) DEFAULT 'single',

    CustomerName NVARCHAR(150),
    Time NVARCHAR(50),
    Date NVARCHAR(50),

    EmployeeId INT,
    EmployeeName NVARCHAR(150),
    EmployeeCompany NVARCHAR(150),
    Department NVARCHAR(100),

    DeliveryCompany NVARCHAR(150),
    DeliveryPersonName NVARCHAR(150),

    VehicleNumber NVARCHAR(50),
    VehicleType NVARCHAR(100),

    Remark NVARCHAR(1000),

    VerificationStatus NVARCHAR(50) DEFAULT 'Pending',

    HoldingState BIT DEFAULT 0,
    HoldingReason NVARCHAR(500),

    GuardVerificationStatus NVARCHAR(50) DEFAULT 'pending',
    GuardId NVARCHAR(100),
    GuardName NVARCHAR(150),
    GuardVerifiedAt DATETIME,

    VerifiedAt DATETIME,

    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 4. OUTGOING PACKAGES
-- ============================================
CREATE TABLE OutgoingPackages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ReferenceNumber NVARCHAR(100),
    Mode NVARCHAR(20) DEFAULT 'single',

    DeliveryPersonName NVARCHAR(150),
    PackageDescription NVARCHAR(500),

    Time NVARCHAR(50),
    Date NVARCHAR(50),

    EmployeeId INT,
    EmployeeName NVARCHAR(150),
    EmployeeCompany NVARCHAR(150),

    DeliveryCompany NVARCHAR(150),

    VehicleNumber NVARCHAR(50),
    VehicleType NVARCHAR(100),

    Remark NVARCHAR(1000),

    VerificationStatus NVARCHAR(50) DEFAULT 'Pending',

    HoldingState BIT DEFAULT 0,
    HoldingReason NVARCHAR(500),
    GuardVerificationStatus NVARCHAR(50) DEFAULT 'pending',
    GuardId NVARCHAR(100),
    GuardName NVARCHAR(150),
    GuardVerifiedAt DATETIME,
    VerifiedAt DATETIME,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 5. GATE RECORDS (ENTRY / EXIT)
-- ============================================
CREATE TABLE GateRecords (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PersonnelId NVARCHAR(100) NOT NULL,
    Name NVARCHAR(150),
    Category NVARCHAR(100),
    Type NVARCHAR(50) NOT NULL, 
    EntryTime NVARCHAR(50),
    ExitTime NVARCHAR(50),
    DriverName NVARCHAR(150),
    VehicleType NVARCHAR(50),
    PlateNumber NVARCHAR(50),
    Date NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 6. ACCESS IDS (BARCODES)
-- ============================================
CREATE TABLE AccessIds (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AccessId NVARCHAR(50) NOT NULL UNIQUE,
    Name NVARCHAR(150),
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Type NVARCHAR(50), -- user/admin/guard/supervisor

    IsActive BIT DEFAULT 1,
    IssuedAt DATETIME DEFAULT GETDATE(),
    RevokedAt DATETIME NULL
);

-- ============================================
-- 7. EMPLOYEES
-- ============================================
CREATE TABLE Employees (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId NVARCHAR(50) NOT NULL UNIQUE,
    EmployeeName NVARCHAR(150),
    EmployeeCompany NVARCHAR(150),
    Department NVARCHAR(100),

    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 8. DELIVERY PERSONS
-- ============================================
CREATE TABLE DeliveryPersons (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DeliveryPersonNIC NVARCHAR(100) NOT NULL UNIQUE,
    DeliveryPersonName NVARCHAR(150),
    DeliveryCompany NVARCHAR(150),

    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- ============================================
-- 9. INDEXES (PERFORMANCE)
-- ============================================
CREATE INDEX IX_Incoming_TrackingNumber ON IncomingPackages(TrackingNumber);
CREATE INDEX IX_Incoming_ReferenceNumber ON IncomingPackages(ReferenceNumber);

CREATE INDEX IX_Outgoing_ReferenceNumber ON OutgoingPackages(ReferenceNumber);

CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);

CREATE INDEX IX_GateRecords_PersonnelId ON GateRecords(PersonnelId);
CREATE INDEX IX_GateRecords_Date ON GateRecords(Date);
CREATE INDEX IX_GateRecords_Type ON GateRecords(Type);
CREATE INDEX IX_GateRecords_PlateNumber ON GateRecords(PlateNumber);

CREATE INDEX IX_AccessIds_AccessId ON AccessIds(AccessId);
CREATE INDEX IX_AccessIds_Username ON AccessIds(Username);

CREATE INDEX IX_Employees_EmployeeId ON Employees(EmployeeId);

CREATE INDEX IX_DeliveryPersons_NIC ON DeliveryPersons(DeliveryPersonNIC);
CREATE INDEX IX_Incoming_CustomerName ON IncomingPackages(CustomerName);