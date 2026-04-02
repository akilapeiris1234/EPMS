"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import { useNavigation } from "@/hooks/useNavigation";
import { X } from "lucide-react";

// Mock batch tracking numbers data
const batchTrackingData: Record<string, string[]> = {
  "00001": ["TRK-001"],
  "00002": ["TRK-B001", "TRK-B002", "TRK-B003"],
  "00003": ["TRK-003"],
  "00004": ["TRK-B004", "TRK-B005", "TRK-B006", "TRK-B007"],
  "00005": ["TRK-005"],
  "00006": ["TRK-B008", "TRK-B009"],
  "00007": ["TRK-007"],
};

export default function IncomingPackageDetail() {
  const { goToIncomingPackageUpdate } = useNavigation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    setIsCanceling(true);
    try {
      console.log("Package cancelled:", data.trackNumber);
      alert("Package cancelled! Redirecting to verification page...");
      goToIncomingPackageUpdate();
    } catch (error) {
      console.error("Error cancelling package:", error);
      alert("Failed to cancel package");
    } finally {
      setIsCanceling(false);
      setShowCancelModal(false);
    }
  };

  const data = {
    trackNumber: "00001",
    type: "Incoming",
    mode: "single",
    trackingNumbers: batchTrackingData["00001"] || [],
    customerName: "Vision care kaluthara",
    employeeName: "Mr. Ganudu",
    status: "Pending",
    employeeId: "N/A",
    employeeCompany: "N/A",
    department: "ARC lab",
    deliveryCompany: "DHL",
    deliveryPersonName: "Tharidu",
    vehicleNumber: "KL 1245",
    vehicleType: "Car",
    receiveDate: "3.19.2026",
    receiveTime: "9.57 AM",
    collectedDate: "N/A",
    collectedTime: "N/A",
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-6 md:p-12 pt-24 lg:pt-12">
        {/* Package View */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#0c244c]">Package Details</h1>
              <div className="hidden md:block">
                <DateTime />
              </div>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0c244c] px-8 py-5 flex justify-between items-center">
                <span className="text-sm font-bold text-blue-200 uppercase tracking-widest">Tracking Number</span>
                <span className="text-2xl font-bold text-white tracking-tight">{data.trackNumber}</span>
              </div>
              <div className="bg-[#8e99ac] px-10 py-3 hidden md:grid grid-cols-2 text-white font-bold text-lg">
                <span>Name</span>
                <span>Details</span>
              </div>

              <div className="p-8 md:p-14">
                <div className="space-y-6">
                  
                  {/* Batch Tracking Numbers Section */}
                  {data.mode === "batch" && data.trackingNumbers.length > 0 && (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-bold text-[#0c244c] mb-4">Batch Tracking Numbers</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {data.trackingNumbers.map((tn, idx) => (
                            <div key={idx} className="bg-white border border-blue-100 rounded p-3">
                              <p className="text-xs text-gray-500 mb-1">Tracking #{idx + 1}</p>
                              <p className="font-bold text-blue-600">{tn}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-100 my-4" />
                    </>
                  )}
                  
                  <DetailItem label="Package Type" value={data.type} isBadge badgeColor="green" />
                  <DetailItem label="Package Mode" value={data.mode} isBadge badgeColor="blue" />
                  <DetailItem label="Customer" value={data.customerName} />
                  <DetailItem label="Employee Name" value={data.employeeName} />
                  <DetailItem label="Status" value={data.status} isBadge badgeColor="yellow" />
                  <DetailItem label="Employee ID" value={data.employeeId} />
                  
                  <div className="border-t border-gray-100 my-4" /> 

                  <DetailItem label="Department" value={data.department} />
                  <DetailItem label="Delivery Company" value={data.deliveryCompany} />
                  <DetailItem label="Delivery Person" value={data.deliveryPersonName} />
                  <DetailItem label="Vehicle Number" value={data.vehicleNumber} />
                  <DetailItem label="Vehicle Type" value={data.vehicleType} />
                  
                  <div className="border-t border-gray-100 my-4" /> 
                  
                  <DetailItem label="Received Date" value={data.receiveDate} />
                  <DetailItem label="Received Time" value={data.receiveTime} />
                  <DetailItem label="Collected Date" value={data.collectedDate} />
                  <DetailItem label="Collected Time" value={data.collectedTime} />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12">
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="px-10 py-3 rounded-xl font-bold text-orange-600 hover:bg-orange-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <X size={18} /> Cancel Package
                  </button>
                </div>
                
                {/* Cancel Confirmation Modal */}
                <CancelModal 
                  isOpen={showCancelModal} 
                  onClose={() => setShowCancelModal(false)} 
                  onConfirm={handleCancel} 
                  isLoading={isCanceling} 
                  trackNumber={data.trackNumber} 
                />
              </div>
            </div>
      </main>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  isBadge?: boolean;
  badgeColor?: "green" | "yellow" | "blue";
}

function DetailItem({ label, value, isBadge = false, badgeColor = "green" }: DetailItemProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-0 items-start md:items-center group">
      <span className="text-gray-400 font-semibold text-sm md:text-base uppercase tracking-tight">
        {label}
      </span>
      <div className="flex items-center">
        {isBadge ? (
          <span className={`px-4 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
            badgeColor === "green" 
              ? "bg-[#e2f9ec] text-[#34d399]" 
              : badgeColor === "blue"
                ? "bg-[#dbeafe] text-[#3b82f6]"
                : "bg-[#fff9e6] text-[#f59e0b]"
          }`}>
            {value}
          </span>
        ) : (
          <span className="text-base md:text-xl font-bold text-[#334155]">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

function CancelModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading, 
  trackNumber 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  isLoading: boolean; 
  trackNumber: string; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
        <h3 className="text-2xl font-bold text-orange-600 mb-4">Cancel Package?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this package? The status will be marked as cancelled.
        </p>
        <p className="text-sm font-semibold text-gray-700 mb-6 bg-gray-100 p-3 rounded-lg">
          Track Number: {trackNumber}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <X size={18} /> {isLoading ? "Cancelling..." : "Cancel Package"}
          </button>
        </div>
      </div>
    </div>
  );
}
