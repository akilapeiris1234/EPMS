-- Create Users Table
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
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

-- Create IncomingPackages Table
CREATE TABLE IncomingPackages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    TrackingNumber NVARCHAR(100) UNIQUE,
    ReferenceNumber NVARCHAR(100),
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
    VerificationStatus NVARCHAR(50) DEFAULT 'Pending',
    HoldingState BIT DEFAULT 0,
    HoldingReason NVARCHAR(500),
    GuardVerificationStatus NVARCHAR(50),
    GuardId NVARCHAR(100),
    GuardName NVARCHAR(150),
    GuardVerifiedAt DATETIME NULL,
    VerifiedAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Create OutgoingPackages Table
CREATE TABLE OutgoingPackages (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ReferenceNumber NVARCHAR(100),
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
    VerificationStatus NVARCHAR(50) DEFAULT 'Pending',
    HoldingState BIT DEFAULT 0,
    HoldingReason NVARCHAR(500),
    GuardVerificationStatus NVARCHAR(50),
    GuardId NVARCHAR(100),
    GuardName NVARCHAR(150),
    GuardVerifiedAt DATETIME NULL,
    VerifiedAt DATETIME NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

-- Create Indexes for better performance
CREATE INDEX IX_IncomingPackages_TrackingNumber ON IncomingPackages(TrackingNumber);
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);