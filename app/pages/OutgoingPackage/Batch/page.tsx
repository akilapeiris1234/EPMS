"use client";

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import GuardIdModal from "@/components/GuardIdModal";
import GuardSelectionModal from "@/components/GuardSelectionModal";
import HoldingStateModal from "@/components/HoldingStateModal";
import { outgoingPackageDefaults } from "@/utils/formDefaults";
import { BatchPackage } from "@/utils/formTypes";
import { generateReferenceNumber } from "@/utils/referenceNumberGenerator";
import { useNavigation } from "@/hooks/useNavigation";
import { ChevronDown } from "lucide-react";

const customerNames = [
  "Vision care panadura",
  "Medical Supplies Ltd",
  "Electronics Hub",
  "Document Services",
  "Tech Solutions",
  "Vision Systems",
];

const deliveryCompanies = [
  "Vision Systems",
  "Medical Systems",
  "Tech Logistics",
  "Doc Solutions",
  "Express Delivery",
  "Fast Track Courier",
];

const departments = [
  "Logistics",
  "Dispatch",
  "Warehouse",
  "Operations",
  "Administration",
  "Sales",
];

export default function BatchOutgoingPackagePage() {
  const nav = useNavigation();
  const [formData, setFormData] = useState(() => ({
    ...outgoingPackageDefaults,
    referenceNumber: generateReferenceNumber(),
    customerName: "",
    trackingNumber: "",
  }));

  const [batchPackages, setBatchPackages] = useState<BatchPackage[]>([]);
  const [showGuardSelectionModal, setShowGuardSelectionModal] = useState(false);
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [showHoldingStateModal, setShowHoldingStateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddToBatch = () => {
    if (!formData.trackingNumber.trim()) {
      alert("Please enter a Tracking Number");
      return;
    }

    const newPackage: BatchPackage = {
      id: Date.now(),
      trackingNumber: formData.trackingNumber,
      customerName: formData.customerName,
      description: formData.description,
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      department: formData.department,
      deliveryCompany: formData.deliveryCompany,
    };

    setBatchPackages([...batchPackages, newPackage]);

    // Reset only tracking number for next entry
    setFormData((prev) => ({
      ...prev,
      trackingNumber: "",
    }));
  };

  const handleRemoveFromBatch = (id: number) => {
    setBatchPackages(batchPackages.filter((pkg) => pkg.id !== id));
  };

  const handleSubmitClick = () => {
    if (batchPackages.length === 0) {
      alert("Please add at least one package to the batch");
      return;
    }
    // First, show the guard selection modal
    setShowGuardSelectionModal(true);
  };

  const handleGuardAvailable = () => {
    // Close selection modal and show guard id modal
    setShowGuardSelectionModal(false);
    setShowGuardModal(true);
  };

  const handleNoGuardAvailable = () => {
    // Close selection modal and show holding state modal
    setShowGuardSelectionModal(false);
    setShowHoldingStateModal(true);
  };

  const handleSubmitWithGuard = async (guardId: string, time: string, date: string) => {
    setIsSubmitting(true);

    const finalData = {
      referenceNumber: formData.referenceNumber,
      packages: batchPackages,
      guardId: guardId.trim(),
      time: time,
      date: date,
      mode: "batch",
      guardStatus: "verified",
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Batch Outgoing Packages Submitted (with Guard):", finalData);

      setFormData({
        ...outgoingPackageDefaults,
        referenceNumber: generateReferenceNumber(),
        customerName: "",
        trackingNumber: "",
      });
      setBatchPackages([]);

      setShowGuardModal(false);
      alert(`Batch submitted successfully and verified by guard! ${batchPackages.length} packages.`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit batch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitHoldingState = async () => {
    setIsSubmitting(true);

    const finalData = {
      referenceNumber: formData.referenceNumber,
      packages: batchPackages,
      mode: "batch",
      guardStatus: "pending",
      timestamp: new Date().toISOString(),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Batch Outgoing Packages Submitted (Holding State):", finalData);

      setFormData({
        ...outgoingPackageDefaults,
        referenceNumber: generateReferenceNumber(),
        customerName: "",
        trackingNumber: "",
      });
      setBatchPackages([]);

      setShowHoldingStateModal(false);
      alert(`Batch placed on hold. ${batchPackages.length} packages awaiting guard verification.`);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit batch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-10 pt-24 lg:pt-10 transition-all duration-300">
        <br />

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#0c244c]">
                Batch Outgoing Packages
              </h1>
              <p className="text-sm text-gray-600 mt-1">Register multiple packages with one Reference Number</p>
            </div>
            <Image 
              src="/images/Outgoing (2).png" 
              alt="Batch Outgoing Packages" 
              width={192}
              height={192}
              className="object-contain shrink-0"
            />
          </div>
          <div className="w-full md:w-auto">
            <DateTime />
          </div>
        </header>

        <hr className="border-gray-300 mb-10" />

        <form className="space-y-10 max-w-7xl">
          {/* Batch Reference */}
          <section>
            <h2 className="text-xl font-semibold text-[#5a677a] mb-6">
              Batch Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
              <div className="md:col-span-6">
                <InputLabel label="Reference Number (Batch ID)" />
                <input
                  type="text"
                  className="form-input-clean bg-[#e9ecef]"
                  value={formData.referenceNumber}
                  placeholder="Auto-generated"
                  readOnly
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Package Information */}
          <section>
            <h2 className="text-xl font-semibold text-[#5a677a] mb-6">
              Add Package to Batch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
              <div className="md:col-span-4">
                <InputLabel label="Package Type" />
                <div className="w-full p-3 bg-[#e9ecef] border border-gray-300 rounded-lg text-center font-bold text-gray-500">
                  Outgoing
                </div>
              </div>

              <div className="md:col-span-5 relative">
                <InputLabel label="Customer Name" />
                <div className="relative">
                  <select
                    className="form-input-clean appearance-none cursor-pointer pr-10"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange(e, "customerName")}
                  >
                    <option value="">Select Customer Name</option>
                    {customerNames.map((customer) => (
                      <option key={customer} value={customer}>
                        {customer}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div className="md:col-span-12 relative">
                <InputLabel label="Package Description" />
                <div className="relative">
                  <select
                    className="form-input-clean appearance-none cursor-pointer pr-10"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange(e, "description")}
                  >
                    <option value="">Select Description</option>
                    <option value="fragile">Fragile - Glassware</option>
                    <option value="standard">Standard - Optical Parts</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div className="md:col-span-5">
                <InputLabel label="Employee Name" />
                <input
                  type="text"
                  className="form-input-clean"
                  value={formData.employeeName || ""}
                  onChange={(e) => handleInputChange(e, "employeeName")}
                  placeholder="Scan the Employee barcode"
                />
              </div>
              <div className="md:col-span-3">
                <InputLabel label="Employee ID" />
                <input
                  type="text"
                  className="form-input-clean"
                  value={formData.employeeId || ""}
                  onChange={(e) => handleInputChange(e, "employeeId")}
                  placeholder="Scan the Employee barcode"
                />
              </div>
              <div className="md:col-span-4">
                <InputLabel label="Department" />
                <div className="relative">
                  <select
                    className="form-input-clean appearance-none cursor-pointer pr-10"
                    value={formData.department || ""}
                    onChange={(e) => handleInputChange(e, "department")}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              <div className="md:col-span-5 relative">
                <InputLabel label="Delivery Company" />
                <div className="relative">
                  <select
                    className="form-input-clean appearance-none cursor-pointer pr-10"
                    value={formData.deliveryCompany || ""}
                    onChange={(e) => handleInputChange(e, "deliveryCompany")}
                  >
                    <option value="">Select Delivery Company</option>
                    {deliveryCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
              <div className="md:col-span-6">
                <InputLabel label="Tracking Number *" />
                <input
                  type="text"
                  className="form-input-clean"
                  value={formData.trackingNumber}
                  onChange={(e) => handleInputChange(e, "trackingNumber")}
                  placeholder="Enter tracking number"
                />
              </div>

            </div>

            {/* Add to Batch Button */}
            <div className="flex justify-end pt-6 gap-4">
              <button
                type="button"
                onClick={handleAddToBatch}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all active:scale-95"
              >
                Add to Batch
              </button>
            </div>
          </section>

          {/* Batch Packages List */}
          {batchPackages.length > 0 && (
            <>
              <hr className="border-gray-200" />
              <section>
                <h2 className="text-xl font-semibold text-[#5a677a] mb-6">
                   Packages in Batch ({batchPackages.length})
                </h2>
                <div className="space-y-3">
                  {batchPackages.map((pkg: BatchPackage) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-bold text-[#0c244c]">{pkg.trackingNumber}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromBatch(pkg.id)}
                        className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-center md:justify-end pt-4 pb-12 gap-4">
            <button
              type="button"
              onClick={() => nav.goToOutgoingPackages()}
              className="w-full md:w-48 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={batchPackages.length === 0}
              className="w-full md:w-64 bg-[#0084c8] hover:bg-[#0071ad] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Submit Batch
            </button>
          </div>
        </form>
      </main>

      {/* Guard Selection Modal - Choose if Guard is Available */}
      <GuardSelectionModal
        isOpen={showGuardSelectionModal}
        onClose={() => setShowGuardSelectionModal(false)}
        onGuardAvailable={handleGuardAvailable}
        onNoGuardAvailable={handleNoGuardAvailable}
      />

      {/* Guard ID Modal - If Guard is Available */}
      <GuardIdModal
        isOpen={showGuardModal}
        onClose={() => setShowGuardModal(false)}
        onSubmit={handleSubmitWithGuard}
        isSubmitting={isSubmitting}
      />

      {/* Holding State Modal - If No Guard Available */}
      <HoldingStateModal
        isOpen={showHoldingStateModal}
        onClose={() => setShowHoldingStateModal(false)}
        onConfirm={handleSubmitHoldingState}
        isSubmitting={isSubmitting}
        packageDetails={{
          customerName: `${batchPackages.length} packages`,
          trackingNumber: formData.referenceNumber,
          employeeName: "Multiple Packages",
        }}
      />

      <style jsx>{`
        .form-input-clean {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f1f3f5;
          border: 1px solid #ced4da;
          border-radius: 0.5rem;
          outline: none;
          font-size: 1rem;
          color: #495057;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .form-input-clean:focus {
          background-color: #ffffff;
          border-color: #0084c8;
          box-shadow: 0 0 0 3px rgba(0, 132, 200, 0.1);
        }
        .form-input-clean:read-only {
          background-color: #e9ecef;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function InputLabel({ label }: { label: string }) {
  return (
    <label className="block text-lg font-medium text-[#2d3748] mb-2 ml-1">
      {label}
    </label>
  );
}
