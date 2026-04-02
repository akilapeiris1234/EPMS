"use client";

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import GuardIdModal from "@/components/GuardIdModal";
import GuardSelectionModal from "@/components/GuardSelectionModal";
import HoldingStateModal from "@/components/HoldingStateModal";
import { incomingPackageDefaults } from "@/utils/formDefaults";
import { generateReferenceNumber } from "@/utils/referenceNumberGenerator";
import { useNavigation } from "@/hooks/useNavigation";
import { ChevronDown } from "lucide-react";
import styles from "../styles.module.css";

interface BatchPackage {
  id: number;
  trackingNumber: string;
  customerName: string;
  employeeName: string;
  deliveryCompany: string;
}

const deliveryCompanies = [
  "Vision Systems",
  "Medical Systems",
  "Tech Logistics",
  "Doc Solutions",
  "Express Delivery",
  "Fast Track Courier",
];

const customers = [
  "John Doe",
  "Sarah Williams",
  "Michael Chen",
  "Emma Rodriguez",
  "David Thompson",
  "Lisa Patel",
  "Robert Kim",
  "Anna Garcia",
  "James Wilson",
  "Maria Lopez",
];

export default function BatchIncomingPackagePage() {
  const nav = useNavigation();
  const [formData, setFormData] = useState(() => ({
    ...incomingPackageDefaults,
    referenceNumber: generateReferenceNumber(),
    trackingNumber: "",
    customerName: "",
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
    if (!formData.customerName) {
      alert("Please select a Customer");
      return;
    }

    const newPackage = {
      id: Date.now(),
      trackingNumber: formData.trackingNumber,
      customerName: formData.customerName,
      employeeName: formData.employeeName,
      deliveryCompany: formData.deliveryCompany,
    };

    setBatchPackages([...batchPackages, newPackage]);

    // Reset tracking number for next entry
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
      console.log("✅ Batch Incoming Packages Submitted (with Guard):", finalData);

      setFormData({
        ...incomingPackageDefaults,
        referenceNumber: generateReferenceNumber(),
        trackingNumber: "",
        customerName: "",
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
      console.log("✅ Batch Incoming Packages Submitted (Holding State):", finalData);

      setFormData({
        ...incomingPackageDefaults,
        referenceNumber: generateReferenceNumber(),
        trackingNumber: "",
        customerName: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#0c244c]">
                Batch Incoming Packages
              </h1>
              <p className="text-sm text-gray-600 mt-1">Register multiple packages arriving together at the Company</p>
            </div>
            <Image 
              src="/images/Incoming.png" 
              alt="Incoming Package" 
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

        <form className="space-y-8 md:space-y-12 max-w-6xl">
          {/* Section 1: Package Information */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6">
              Batch Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
              <div className="md:col-span-6">
                <InputLabel label="Reference Number " />
                <input
                  type="text"
                  className={`${styles["form-input-custom"]} ${styles["form-input-readonly"]}`}
                  value={formData.referenceNumber}
                  placeholder="Auto-generated"
                  readOnly
                />
              </div>

              <div className="md:col-span-6">
                <InputLabel label="Tracking Number *" />
                <input
                  type="text"
                  className={styles["form-input-custom"]}
                  value={formData.trackingNumber}
                  onChange={(e) => handleInputChange(e, "trackingNumber")}
                  placeholder="Enter tracking number"
                />
              </div>

              <div className="md:col-span-6">
                <InputLabel label="Customer Name *" />
                <div className="relative">
                  <select
                    className={`${styles["form-input-custom"]} appearance-none cursor-pointer pr-10`}
                    value={formData.customerName}
                    onChange={(e) => handleInputChange(e, "customerName")}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
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

              <div className="md:col-span-6">
                <InputLabel label="Employee Name (Optional)" />
                <input
                  type="text"
                  className={styles["form-input-custom"]}
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange(e, "employeeName")}
                  placeholder="Enter employee name"
                />
              </div>

              <div className="md:col-span-6 relative">
                <InputLabel label="Delivery Company (Optional)" />
                <div className="relative">
                  <select
                    className={`${styles["form-input-custom"]} appearance-none cursor-pointer pr-10`}
                    value={formData.deliveryCompany}
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
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Additional Delivery Details */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6">
              Additional Delivery Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <InputLabel label="Delivery person name" />
                <input
                  type="text"
                  className={styles["form-input-custom"]}
                  value={formData.deliveryPersonName}
                  onChange={(e) => handleInputChange(e, "deliveryPersonName")}
                />
              </div>

              <div>
                <InputLabel label="Vehicle number" />
                <input
                  type="text"
                  className={styles["form-input-custom"]}
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange(e, "vehicleNumber")}
                />
              </div>

              <div className="relative">
                <InputLabel label="Vehicle Type" />
                <div className="relative">
                  <select
                    className={`${styles["form-input-custom"]} appearance-none cursor-pointer pr-10`}
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange(e, "vehicleType")}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Van">Van</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Car">Car</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Remarks Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6">
              Additional Notes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
              <div className="md:col-span-12">
                <InputLabel label="Remarks (Optional)" />
                <textarea
                  className={`${styles["form-input-custom"]} resize-none`}
                  rows={4}
                  value={formData.remark}
                  onChange={(e) => handleInputChange(e, "remark")}
                  placeholder="Add any additional notes or remarks about this batch..."
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />
          {batchPackages.length > 0 && (
            <>
              <hr className="border-gray-200" />
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-[#4a5568] mb-6">
                   Packages in Batch ({batchPackages.length})
                </h2>
                <div className="space-y-3">
                  {batchPackages.map((pkg: BatchPackage) => (
                    <div key={pkg.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-bold text-[#0c244c]">📦 {pkg.trackingNumber}</p>
                        <p className="text-sm text-gray-600">{pkg.customerName} {pkg.employeeName && `• ${pkg.employeeName}`}</p>
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
          <div className="flex justify-center md:justify-end pt-8 pb-10 gap-4">
            <button
              type="button"
              onClick={handleAddToBatch}
              className="w-full md:w-64 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition-all active:scale-95"
            >
              Add to Batch
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-center md:justify-end pt-4 pb-10 gap-4">
            <button
              type="button"
              onClick={() => nav.goToIncomingPackages()}
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
    </div>
  );
}

function InputLabel({ label }: { label: string }) {
  return (
    <label className="block text-lg md:text-xl font-medium text-[#4a5568] mb-2 ml-1">
      {label}
    </label>
  );
}
