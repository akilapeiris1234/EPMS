"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import GuardIdModal from "@/components/GuardIdModal";
import GuardSelectionModal from "@/components/GuardSelectionModal";
import HoldingStateModal from "@/components/HoldingStateModal";
import { outgoingPackageVerificationDefaults } from "@/utils/formDefaults";
import { ChevronDown } from "lucide-react";

const vehicleTypes = ["Van", "Motorcycle", "Car", "Pickup"];

const deliveryCompanies = [
  "Vision Systems",
  "Medical Systems",
  "Tech Logistics",
  "Doc Solutions",
  "Express Delivery",
  "Fast Track Courier",
];

// Mock batch package data
const batchPackagesData: Record<string, { mode: string; trackingNumbers: string[] }> = {
  "000001": { mode: "single", trackingNumbers: ["TRK-001"] },
  "000002": { mode: "batch", trackingNumbers: ["TRK-OUT-B001", "TRK-OUT-B002", "TRK-OUT-B003"] },
  "000003": { mode: "single", trackingNumbers: ["TRK-003"] },
  "000004": { mode: "batch", trackingNumbers: ["TRK-OUT-B004", "TRK-OUT-B005", "TRK-OUT-B006", "TRK-OUT-B007"] },
  "000005": { mode: "single", trackingNumbers: ["TRK-005"] },
  "000006": { mode: "batch", trackingNumbers: ["TRK-OUT-B008", "TRK-OUT-B009"] },
  "000007": { mode: "single", trackingNumbers: ["TRK-007"] },
  "000008": { mode: "batch", trackingNumbers: ["TRK-OUT-B010", "TRK-OUT-B011", "TRK-OUT-B012"] },
  "000009": { mode: "single", trackingNumbers: ["TRK-009"] },
  "000010": { mode: "batch", trackingNumbers: ["TRK-OUT-B013", "TRK-OUT-B014"] },
  "000011": { mode: "single", trackingNumbers: ["TRK-011"] },
  "000012": { mode: "batch", trackingNumbers: ["TRK-OUT-B015", "TRK-OUT-B016", "TRK-OUT-B017"] },
};

export default function OutgoingVerificationContent() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("id") || "";
  
  const [packageMode, setPackageMode] = useState("single");
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [formData, setFormData] = useState(outgoingPackageVerificationDefaults);

  useEffect(() => {
    // Get package data based on reference number from URL
    const packageData = batchPackagesData[packageId];
    if (packageData) {
      setPackageMode(packageData.mode);
      setTrackingNumbers(packageData.trackingNumbers);
    }
  }, [packageId]);

  const [showGuardSelectionModal, setShowGuardSelectionModal] = useState(false);
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [showHoldingStateModal, setShowHoldingStateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitClick = () => {
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
      ...formData,
      guardId: guardId.trim(),
      time: time,
      date: date,
      guardStatus: "verified",
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("✅ Outgoing Package Verification Submitted (with Guard):", finalData);

      // Reset form after success
      setFormData(outgoingPackageVerificationDefaults);

      setShowGuardModal(false);
      alert("Package verification submitted successfully and verified by guard!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitHoldingState = async () => {
    setIsSubmitting(true);

    const finalData = {
      ...formData,
      guardStatus: "pending",
      timestamp: new Date().toISOString(),
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("✅ Outgoing Package Verification Submitted (Holding State):", finalData);

      // Reset form after success
      setFormData(outgoingPackageVerificationDefaults);

      setShowHoldingStateModal(false);
      alert("Package verification placed on hold awaiting guard verification.");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-10 pt-24 lg:pt-10 transition-all duration-300">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
                Outgoing package Verification
              </h1>
              <p className="text-sm text-gray-600 mt-1">Verify outgoing packages before dispatch</p>
            </div>
            <img 
              src="/images/Outgoing (2).png" 
              alt="Outgoing Package Verification" 
              className="w-48 h-48 object-contain flex-shrink-0"
            />
          </div>
          <div className="w-full md:w-auto">
            <DateTime />
          </div>
        </header>

        <hr className="border-gray-300 mb-10" />

        <form className="max-w-7xl mx-auto space-y-12">
          
          {/* Section: Package Information - If Batch Mode */}
          {packageMode === "batch" && trackingNumbers.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold text-[#4a5568] mb-8">
                Batch Tracking Numbers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackingNumbers.map((tn, idx) => (
                  <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Tracking #{idx + 1}</p>
                    <p className="font-bold text-[#0c244c] text-lg">{tn}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Section: Delivery Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-8">
              Delivery Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10">
              
              <div>
                <InputLabel label="Vehicle number" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.vehicleNumber}
                  onChange={(e) => handleInputChange(e, "vehicleNumber")}
                />
              </div>

              <div>
                <InputLabel label="Delivery person name" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.deliveryPersonName}
                  onChange={(e) => handleInputChange(e, "deliveryPersonName")}
                />
              </div>

              <div>
                <InputLabel label="Vehicle Type" />
                <select 
                  className="form-input-essilor" 
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange(e, "vehicleType")}
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <InputLabel label="NIC number" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.nicNumber}
                  onChange={(e) => handleInputChange(e, "nicNumber")}
                />
              </div>

              <div>
                <InputLabel label="Delivery Company" />
                <div className="relative">
                  <select
                    className="form-input-essilor appearance-none cursor-pointer pr-10"
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

          {/* Submit Button */}
          <div className="flex justify-center md:justify-end pt-12 pb-10">
            <button
              type="button"
              onClick={handleSubmitClick}
              className="w-full md:w-64 bg-[#0084c8] hover:bg-[#0071ad] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-lg"
            >
              Submit
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
          customerName: "Outgoing Package",
          trackingNumber: "Verification",
        }}
      />

      <style jsx>{`
        .form-input-essilor {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background-color: #f1f3f5;
          border: 2px solid #ced4da;
          border-radius: 0.75rem;
          outline: none;
          font-size: 1rem;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .form-input-essilor:focus {
          background-color: #fff;
          border-color: #0084c8;
          box-shadow: 0 0 0 4px rgba(0, 132, 200, 0.1);
        }
        .form-input-essilor:read-only {
          background-color: #e2e8f0;
          cursor: not-allowed;
          color: #666;
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
