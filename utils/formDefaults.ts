/**
 * Form Default Values
 */

import {
  IncomingPackageFormData,
  OutgoingPackageFormData,
  AddPackageFormData,
  IncomingPackageVerificationFormData,
  OutgoingPackageVerificationFormData,
  HoldingPackage,
} from "./formTypes";

export const incomingPackageDefaults: IncomingPackageFormData = {
  trackingNumber: "",
  referenceNumber: "",
  customerName: "",
  time: "",
  date: "",
  employeeName: "",
  department: "",
  employeeCompany: "",
  deliveryCompany: "",
  deliveryPersonName: "",
  vehicleNumber: "",
  vehicleType: "",
  remark: "",
};

export const outgoingPackageDefaults: OutgoingPackageFormData = {
  referenceNumber: "",
  customerName: "",
  description: "",
  deliveryPersonName: "",
  time: "",
  date: "",
  employeeName: "",
  employeeId: "",
  department: "",
  employeeCompany: "",
  deliveryCompany: "",
  vehicleNumber: "",
  vehicleType: "",
};

export const addPackageDefaults: AddPackageFormData = {
  packageType: "incoming",
  trackingNumber: "",
  referenceNumber: "",
  employeeId: 0,
  employeeName: "",
  department: "",
  employeeCompany: "",
  customerName: "",
  deliveryPersonName: "",
  deliveryCompany: "",
  vehicleNumber: "",
  vehicleType: "",
  time: "",
  date: "",
};

export const incomingPackageVerificationDefaults: IncomingPackageVerificationFormData = {
  employeeCompany: "",
  employeeId: "",
  department: "",
  time: "",
  date: "",
};

export const outgoingPackageVerificationDefaults: OutgoingPackageVerificationFormData = {
  employeeCompany: "",
  employeeName: "",
  department: "",
  vehicleNumber: "",
  deliveryPersonName: "",
  vehicleType: "",
  nicNumber: "",
  time: "",
  date: "",
  deliveryCompany: "",
};

export const holdingPackageDefaults: HoldingPackage = {
  id: 0,
  trackingNumber: "",
  referenceNumber: "",
  customerName: "",
  holdingReason: "",
  createdAt: "",
  type: "incoming",
  mode: "single",
  verified: false,
};
