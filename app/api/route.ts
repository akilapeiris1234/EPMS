import { getConnection } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
// @ts-expect-error - mssql package doesn't have type definitions
import sql from 'mssql';

function isAdmin(userRole?: string): boolean {
  return userRole?.toLowerCase() === 'admin';
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toNullableString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized === '' ? null : normalized;
}

function toNullableInt(value: unknown): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;

    const parsed = parseInt(trimmed, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      action,
      userRole,
      packageType,
      trackingNumber,
      customerName,
      packageDescription,
      time,
      date,
      employeeId,
      employeeName,
      employeeCompany,
      department,
      deliveryCompany,
      deliveryPersonName,
      vehicleNumber,
      vehicleType,
      deliveryPersonNIC,
    } = body;

    // Handle addEmployee action
    if (action === 'addEmployee') {
      if (!isAdmin(userRole)) {
        return NextResponse.json({ error: 'Only admins can add employees' }, { status: 403 });
      }

      if (!employeeName || !employeeName.trim()) {
        return NextResponse.json(
          { error: 'Employee name is required' },
          { status: 400 }
        );
      }

      try {
        const pool = await getConnection();
        // Just acknowledge the employee was added - barcode is already generated on client
        return NextResponse.json({
          success: true,
          message: 'Employee added successfully!',
          employeeId,
        }, { status: 201 });
      } catch (error: unknown) {
        console.error('Add Employee Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    // Handle addCustomer action
    if (action === 'addCustomer') {
      if (!isAdmin(userRole)) {
        return NextResponse.json({ error: 'Only admins can add customer info' }, { status: 403 });
      }

      try {
        // Just acknowledge the customer info was added
        return NextResponse.json({
          success: true,
          message: 'Customer information added successfully!',
        }, { status: 201 });
      } catch (error: unknown) {
        console.error('Add Customer Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    // Handle addPackage action (for package description)
    if (action === 'addPackage' && !packageType) {
      if (!isAdmin(userRole)) {
        return NextResponse.json({ error: 'Only admins can add package info' }, { status: 403 });
      }

      try {
        // Just acknowledge the package description was added
        return NextResponse.json({
          success: true,
          message: 'Package information added successfully!',
        }, { status: 201 });
      } catch (error: unknown) {
        console.error('Add Package Description Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    // Handle addDelivery action
    if (action === 'addDelivery') {
      if (!isAdmin(userRole)) {
        return NextResponse.json({ error: 'Only admins can add delivery info' }, { status: 403 });
      }

      try {
        // Just acknowledge the delivery info was added
        return NextResponse.json({
          success: true,
          message: 'Delivery information added successfully!',
        }, { status: 201 });
      } catch (error: unknown) {
        console.error('Add Delivery Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
      }
    }

    if (action !== 'addPackage') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!isAdmin(userRole)) {
      return NextResponse.json({ error: 'Only admins can add packages' }, { status: 403 });
    }

    const normalizedPackageType = normalizeString(packageType) || 'incoming';
    const shouldInsertIncoming =
      normalizedPackageType === 'incoming' || normalizedPackageType === 'both';
    const shouldInsertOutgoing =
      normalizedPackageType === 'outgoing' || normalizedPackageType === 'both';
    
    const normalizedTrackingNumber = normalizeString(trackingNumber);

    const hasAtLeastOneUserField = [
      customerName,
      packageDescription,
      time,
      date,
      employeeId,
      employeeName,
      employeeCompany,
      department,
      deliveryCompany,
      deliveryPersonName,
      vehicleNumber,
      vehicleType,
    ].some((field) => {
      if (typeof field === 'string') return field.trim() !== '';
      return field !== null && field !== undefined;
    });

    if (!hasAtLeastOneUserField) {
      return NextResponse.json(
        { error: 'Please provide at least one field value' },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    if (!shouldInsertIncoming && !shouldInsertOutgoing) {
      return NextResponse.json(
        { error: 'Invalid package type. Use "incoming", "outgoing" or "both"' },
        { status: 400 }
      );
    }

    if (shouldInsertIncoming) {
      await pool.request()
        .input('trackingNumber', sql.NVarChar(100), normalizedTrackingNumber)
        .input('customerName', sql.NVarChar(150), toNullableString(customerName))
        .input('time', sql.NVarChar(50), toNullableString(time))
        .input('date', sql.NVarChar(50), toNullableString(date))
        .input('employeeId', sql.Int, toNullableInt(employeeId))
        .input('employeeName', sql.NVarChar(150), toNullableString(employeeName))
        .input('employeeCompany', sql.NVarChar(150), toNullableString(employeeCompany))
        .input('department', sql.NVarChar(100), toNullableString(department))
        .input('deliveryCompany', sql.NVarChar(150), toNullableString(deliveryCompany))
        .input('deliveryPersonName', sql.NVarChar(150), toNullableString(deliveryPersonName))
        .input('vehicleNumber', sql.NVarChar(50), toNullableString(vehicleNumber))
        .input('vehicleType', sql.NVarChar(100), toNullableString(vehicleType))
        .query(`
          INSERT INTO IncomingPackages 
          (TrackingNumber, ReferenceNumber, CustomerName, Time, Date, EmployeeId, EmployeeName, EmployeeCompany, 
           Department, DeliveryCompany, DeliveryPersonName, VehicleNumber, VehicleType, VerificationStatus, CreatedAt, UpdatedAt)
          VALUES 
          (@trackingNumber, NULL, @customerName, @time, @date, @employeeId, @employeeName, @employeeCompany, 
           @department, @deliveryCompany, @deliveryPersonName, @vehicleNumber, @vehicleType, 'Pending', GETDATE(), GETDATE())
        `);

    }

    if (shouldInsertOutgoing) {
      await pool.request()
        .input('referenceNumber', sql.NVarChar(100), normalizedTrackingNumber)
        .input('deliveryPersonName', sql.NVarChar(150), toNullableString(deliveryPersonName))
        .input('packageDescription', sql.NVarChar(500), toNullableString(packageDescription))
        .input('time', sql.NVarChar(50), toNullableString(time))
        .input('date', sql.NVarChar(50), toNullableString(date))
        .input('employeeId', sql.Int, toNullableInt(employeeId))
        .input('employeeName', sql.NVarChar(150), toNullableString(employeeName))
        .input('employeeCompany', sql.NVarChar(150), toNullableString(employeeCompany))
        .input('deliveryCompany', sql.NVarChar(150), toNullableString(deliveryCompany))
        .input('vehicleNumber', sql.NVarChar(50), toNullableString(vehicleNumber))
        .input('vehicleType', sql.NVarChar(100), toNullableString(vehicleType))
        .query(`
          INSERT INTO OutgoingPackages 
          (ReferenceNumber, DeliveryPersonName, PackageDescription, Time, Date, EmployeeId, EmployeeName, EmployeeCompany, 
            DeliveryCompany, VehicleNumber, VehicleType, VerificationStatus, CreatedAt, UpdatedAt)
          VALUES 
          (@referenceNumber, @deliveryPersonName, @packageDescription, @time, @date, @employeeId, @employeeName, @employeeCompany, 
            @deliveryCompany, @vehicleNumber, @vehicleType, 'Pending', GETDATE(), GETDATE())
        `);

    }

    const successMessage =
      shouldInsertIncoming && shouldInsertOutgoing
        ? 'Incoming and Outgoing packages added successfully!'
        : shouldInsertIncoming
          ? 'Incoming package added successfully!'
          : 'Outgoing package added successfully!';

    return NextResponse.json({
      success: true,
      message: successMessage,
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Add Package Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}