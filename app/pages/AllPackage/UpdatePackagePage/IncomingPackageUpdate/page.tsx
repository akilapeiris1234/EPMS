"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import GuardIdModal from "@/components/GuardIdModal";
import { ChevronDown } from "lucide-react";

export default function IncomingPackageVerificationPage() {
  // Existing package data that was loaded
  const existingPackageData = {
    referenceNumber: "REF-00001",
    trackingNumber: "00001",
    customerName: "Vision care kaluthara",
    employeeName: "Mr.Ganudu",
    employeeId: "E001",
    department: "ARC lab",
    deliveryCompany: "DHL",
    deliveryPerson: "Tharidu",
    vehicleNumber: "KL 1245",
    vehicleType: "Car",
  };

  const [formData, setFormData] = useState({
    referenceNumber: existingPackageData.referenceNumber,
    trackingNumber: existingPackageData.trackingNumber,
    customerName: existingPackageData.customerName,
    employeeName: existingPackageData.employeeName,
    employeeId: existingPackageData.employeeId,
    department: existingPackageData.department,
    deliveryCompany: existingPackageData.deliveryCompany,
    deliveryPerson: existingPackageData.deliveryPerson,
    vehicleNumber: existingPackageData.vehicleNumber,
    vehicleType: existingPackageData.vehicleType,
  });

  const [showGuardIdModal, setShowGuardIdModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown options
  const customerOptions = ["Vision care kaluthara", "Essilor Lanka", "Safilo Group", "Luxottica", "Other"];
  const employeeOptions = ["Mr.Ganudu", "John Smith", "Sarah Johnson", "Mike Williams", "Other"];
  const employeeIdOptions = ["E001", "E002", "E003", "E004", "E005"];
  const departmentOptions = ["ARC lab", "Sales", "Logistics", "Administration", "Other"];
  const vehicleTypeOptions = ["Van", "Motorcycle", "Car", "Pickup", "Truck"];
  const companyOptions = ["DHL", "FedEx", "UPS", "Local Courier", "Other"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGuardIdModal(true);
  };

  const handleGuardIdSubmit = async (guardId: string, time: string, date: string) => {
    setIsSubmitting(true);
    try {
      const finalData = { ...formData, time, date };
      console.log("Package verified and added with Guard ID:", guardId);
      console.log("Package data:", finalData);
      alert("Package verified and added successfully!");
      // Reset form
      setFormData({
        referenceNumber: "",
        trackingNumber: "",
        customerName: "",
        employeeName: "",
        employeeId: "",
        department: "",
        deliveryCompany: "",
        deliveryPerson: "",
        vehicleNumber: "",
        vehicleType: "",
      });
      setShowGuardIdModal(false);
    } catch (error) {
      console.error("Error adding package:", error);
      alert("Failed to add package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 p-4 md:p-10 pt-24 lg:pt-10 transition-all">
        <header className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <h1 className="text-4xl font-bold text-[#0c244c]">Verify & Add Package</h1>
          <div className="w-full md:w-auto">
            <DateTime />
          </div>
        </header>

        <hr className="border-gray-300 mb-10" />

        <form onSubmit={handleSubmit} className="space-y-12 max-w-7xl">
          
          {/* --- Section 1: Package Information --- */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-6">Package Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
              
              <div className="md:col-span-4">
                <InputLabel label="Reference Number" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.referenceNumber}
                  onChange={(e) => handleInputChange(e, "referenceNumber")}
                />
              </div>

              <div className="md:col-span-4">
                <InputLabel label="Tracking Number" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.trackingNumber}
                  onChange={(e) => handleInputChange(e, "trackingNumber")}
                />
              </div>

              <div className="md:col-span-4">
                <InputLabel label="Package Type" />
                <div className="w-full p-3.5 bg-[#e9ecef] border border-gray-300 rounded-xl text-center font-bold text-gray-500 uppercase tracking-wider">
                  Incoming
                </div>
              </div>

              <div className="md:col-span-6">
                <InputLabel label="Customer Name" />
                <select 
                  className="form-input-essilor" 
                  value={formData.customerName}
                  onChange={(e) => handleInputChange(e, "customerName")}
                >
                  {customerOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* --- Section 2: Employee Details --- */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-6 text-left">Employee Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              <div className="md:col-span-1">
                <InputLabel label="Employee Name" />
                <select 
                  className="form-input-essilor" 
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange(e, "employeeName")}
                >
                  {employeeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <InputLabel label="Employee ID" />
                <select 
                  className="form-input-essilor" 
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange(e, "employeeId")}
                >
                  {employeeIdOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-1">
                <InputLabel label="Department" />
                <select 
                  className="form-input-essilor" 
                  value={formData.department}
                  onChange={(e) => handleInputChange(e, "department")}
                >
                  {departmentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* --- Section 3: Delivery Details --- */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-6">Delivery Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="max-w-md">
                <InputLabel label="Company Name" />
                <select className="form-input-essilor" value={formData.deliveryCompany} onChange={(e) => handleInputChange(e, "deliveryCompany")}>
                  {companyOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="max-w-md">
                <InputLabel label="Delivery person name" />
                <input type="text" className="form-input-essilor" value={formData.deliveryPerson} onChange={(e) => handleInputChange(e, "deliveryPerson")} />
              </div>
              <div className="max-w-md">
                <InputLabel label="Vehicle number" />
                <input type="text" className="form-input-essilor" value={formData.vehicleNumber} onChange={(e) => handleInputChange(e, "vehicleNumber")} />
              </div>
              <div className="max-w-md">
                <InputLabel label="Vehicle Type" />
                <select className="form-input-essilor" value={formData.vehicleType} onChange={(e) => handleInputChange(e, "vehicleType")}>
                  {vehicleTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Add Package Button */}
          <div className="flex justify-center md:justify-end pt-8 pb-12">
            <button
              type="submit"
              className="w-full md:w-64 bg-[#0084c8] hover:bg-[#0071ad] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-lg"
            >
              Verify Package
            </button>
          </div>
        </form>

        {/* Guard ID Verification Modal */}
        <GuardIdModal
          isOpen={showGuardIdModal}
          onClose={() => setShowGuardIdModal(false)}
          onSubmit={handleGuardIdSubmit}
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Global CSS for this page's inputs */}
      <style jsx>{`
        .form-input-essilor {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background-color: #f1f3f5;
          border: 1px solid #ced4da;
          border-radius: 0.75rem;
          outline: none;
          font-size: 1.2rem;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s;
        }
        .form-input-essilor:focus {
          background-color: #fff;
          border-color: #0084c8;
          box-shadow: 0 0 0 4px rgba(0, 132, 200, 0.1);
        }
        .form-input-essilor:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-input-essilor option {
          background-color: #fff;
          color: #495057;
        }
      `}</style>
    </div>
  );
}

function InputLabel({ label }: { label: string }) {
  return (
    <label className="block text-xl font-medium text-[#2d3748] mb-3 ml-1">
      {label}
    </label>
  );
}