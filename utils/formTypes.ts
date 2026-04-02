/**
 * Form Data Interfaces
 */

export interface IncomingPackageFormData {
  trackingNumber: string;
  referenceNumber: string;
  customerName: string;
  time: string;
  date: string;
  employeeName: string;
  department: string;
  employeeCompany: string;
  deliveryCompany: string;
  deliveryPersonName: string;
  vehicleNumber: string;
  vehicleType: string;
  remark: string;
}

export interface OutgoingPackageFormData {
  referenceNumber: string;
  customerName: string;
  description: string;
  deliveryPersonName: string;
  time: string;
  date: string;
  employeeName: string;
  employeeId: string;
  department: string;
  employeeCompany: string;
  deliveryCompany: string;
  vehicleNumber: string;
  vehicleType: string;
}

export interface AddPackageFormData {
  packageType: 'incoming' | 'outgoing';
  trackingNumber: string;
  referenceNumber?: string;
  employeeId: number;
  employeeName: string;
  department: string;
  employeeCompany: string;
  customerName?: string;
  deliveryPersonName?: string;
  deliveryCompany: string;
  vehicleNumber?: string;
  vehicleType?: string;
  time?: string;
  date?: string;
}

export interface IncomingPackageVerificationFormData {
  employeeCompany: string;
  employeeId: string;
  department: string;
  time: string;
  date: string;
}

export interface OutgoingPackageVerificationFormData {
  employeeCompany: string;
  employeeName: string;
  department: string;
  vehicleNumber: string;
  deliveryPersonName: string;
  vehicleType: string;
  nicNumber: string;
  time: string;
  date: string;
  deliveryCompany: string;
}

export interface HoldingPackage {
  id: number;
  trackingNumber?: string;
  trackingNumbers?: string[];
  referenceNumber?: string;
  customerName: string;
  holdingReason?: string;
  createdAt: string;
  type: "incoming" | "outgoing";
  mode: "single" | "batch";
  verified: boolean;
}

export interface HoldingPackageAlert {
  id: number;
  trackingNumber: string;
  customerName: string;
  type: "incoming" | "outgoing";
  holdTime: string;
}

export interface BatchPackage {
  id: number;
  trackingNumber: string;
  customerName: string;
  description: string;
  employeeName: string;
  employeeId: string;
  department: string;
  deliveryCompany: string;
}

export interface User {
  accessId: string;
  name: string;
  Username: string;
  type: string;
}

export interface Delivery {
  deliveryPersonNIC: string;
  deliveryPersonName: string;
  deliveryCompany: string;
}

export interface ReportPackage {
  id: string;
  type: "Incoming" | "Outgoing";
  mode: "single" | "batch";
  customer: string;
  employee: string;
  employeeId: string;
  department: string;
  employeeCompany: string;
  deliveryCompany: string;
  status: string;
  deliveryPersonName?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  receiveDate?: string;
  receiveTime?: string;
  collectedTime?: string;
  dispatchDate?: string;
  dispatchTime?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  date: string;
  time: string;
  trackingNumbers?: string[];
  referenceNumber?: string;
}

export interface Employee {
  employeeId: string;
  employeeName: string;
  employeeCompany: string;
  department: string;
}
