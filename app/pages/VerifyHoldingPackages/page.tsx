"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import GuardIdModal from "@/components/GuardIdModal";
import { Clock, AlertCircle, Eye } from "lucide-react";
import { HoldingPackage } from "@/utils/formTypes";

export default function VerifyHoldingPackagesPage() {
  const [holdingPackages, setHoldingPackages] = useState<HoldingPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<HoldingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuardModal, setShowGuardModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<HoldingPackage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - Replace with API call
  useEffect(() => {
    const fetchHoldingPackages = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockData: HoldingPackage[] = [
          {
            id: 1,
            trackingNumber: "TRK-2025-001",
            customerName: "John Doe",
            holdingReason: "Pending damage inspection",
            createdAt: "2025-12-15T10:30:00",
            type: "incoming",
            mode: "single",
            verified: false,
          },
          {
            id: 2,
            referenceNumber: "REF-002",
            trackingNumbers: ["TRK-2025-010", "TRK-2025-011", "TRK-2025-012"],
            customerName: "Jane Smith",
            holdingReason: "Awaiting customer confirmation",
            createdAt: "2025-12-15T11:00:00",
            type: "outgoing",
            mode: "batch",
            verified: false,
          },
          {
            id: 3,
            referenceNumber: "REF-003",
            customerName: "Mike Wilson",
            holdingReason: "Address verification needed",
            createdAt: "2025-12-14T14:20:00",
            type: "incoming",
            mode: "batch",
            verified: true,
          },
        ];

        setHoldingPackages(mockData);
        setFilteredPackages(mockData);
      } catch (error) {
        console.error("Failed to fetch holding packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHoldingPackages();
  }, []);

  // Filter packages based on search (only show pending)
  useEffect(() => {
    let filtered = holdingPackages.filter((pkg) => !pkg.verified);

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (pkg) =>
          (pkg.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          (pkg.trackingNumbers?.some(tn => tn.toLowerCase().includes(searchTerm.toLowerCase())) ?? false) ||
          pkg.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
    }

    setFilteredPackages(filtered);
  }, [holdingPackages, searchTerm]);

  const handleVerifyClick = (pkg: HoldingPackage) => {
    setSelectedPackage(pkg);
    setShowGuardModal(true);
  };

  const handleVerifyWithGuard = async (
    guardId: string,
    time: string,
    date: string
  ) => {
    if (!selectedPackage) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Update the package status
      setHoldingPackages((prev) =>
        prev.map((pkg) =>
          pkg.id === selectedPackage.id
            ? { ...pkg, verified: true }
            : pkg
        )
      );

      console.log(" Package Verified by Guard:", {
        packageId: selectedPackage.id,
        trackingNumber: selectedPackage.trackingNumber,
        guardId,
        time,
        date,
      });

      setShowGuardModal(false);
      setSelectedPackage(null);
    } catch (error) {
      console.error("Verification error:", error);
      alert("Failed to verify package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                Verify Holding Packages
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Review and verify packages placed in holding state
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <DateTime />
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {/* Filters Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by tracking number, customer, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c244c]"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={Clock}
            label="Total Holding"
            count={holdingPackages.filter((p) => !p.verified).length}
            color="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending Verification"
            count={holdingPackages.filter((p) => !p.verified).length}
            color="bg-yellow-50"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Packages List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white p-12 text-center rounded-xl">
              <p className="text-gray-500">Loading packages...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No packages found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0c244c]">
                        Tracking #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0c244c]">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0c244c]">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#0c244c]">
                        Mode
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-[#0c244c]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {pkg.trackingNumber && (
                            <span className="font-semibold text-[#0c244c]">
                              {pkg.trackingNumber}
                            </span>
                          )}
                          {pkg.trackingNumbers && pkg.trackingNumbers.length > 0 && (
                            <div className="space-y-1">
                              {pkg.trackingNumbers.map((tn, idx) => (
                                <div key={idx} className="font-semibold text-[#0c244c]">
                                  {tn}
                                </div>
                              ))}
                            </div>
                          )}
                          {pkg.referenceNumber && (
                            <div className="font-semibold text-[#0c244c]">
                              Ref: {pkg.referenceNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {pkg.customerName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pkg.type === "incoming"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {pkg.type === "incoming" ? "Incoming" : "Outgoing"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pkg.mode === "single"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {pkg.mode === "single" ? "Single" : "Batch"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {!pkg.verified ? (
                            <button
                              onClick={() => handleVerifyClick(pkg)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c244c] text-white rounded-lg hover:bg-[#0c2d5c] transition-colors font-medium"
                            >
                              Verify
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    {/* Header with Tracking and Customer Name */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                        Tracking Number
                      </p>
                      {pkg.trackingNumber && (
                        <p className="font-bold text-[#0c244c] text-lg mb-2">{pkg.trackingNumber}</p>
                      )}
                      {pkg.trackingNumbers && pkg.trackingNumbers.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {pkg.trackingNumbers.map((tn, idx) => (
                            <p key={idx} className="font-bold text-[#0c244c]">
                              {tn}
                            </p>
                          ))}
                        </div>
                      )}
                      {pkg.referenceNumber && (
                        <p className="font-bold text-[#0c244c] mb-2">Ref: {pkg.referenceNumber}</p>
                      )}
                      <p className="text-sm font-semibold text-gray-800">{pkg.customerName}</p>
                    </div>

                    {/* Status Badges */}
                    <div className="mb-4 flex gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.type === "incoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {pkg.type === "incoming" ? "Incoming" : "Outgoing"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          pkg.mode === "single"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {pkg.mode === "single" ? "Single" : "Batch"}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-100">
                      {!pkg.verified ? (
                        <button
                          onClick={() => handleVerifyClick(pkg)}
                          className="w-full px-4 py-2.5 bg-[#0c244c] text-white rounded-lg hover:bg-[#0c2d5c] transition-colors font-bold text-sm"
                        >
                          Verify Package
                        </button>
                      ) : (
                        <p className="text-sm text-gray-500 text-center font-medium">✓ Verification Completed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Guard Verification Modal */}
        {selectedPackage && (
          <GuardIdModal
            isOpen={showGuardModal}
            onClose={() => {
              setShowGuardModal(false);
              setSelectedPackage(null);
            }}
            onSubmit={handleVerifyWithGuard}
            isSubmitting={isSubmitting}
            package={selectedPackage}
          />
        )}
      </main>
    </div>
  );
}

// Helper component for stat cards
function StatCard({
  icon: Icon,
  label,
  count,
  color,
  iconColor,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  count: number;
  color: string;
  iconColor: string;
}) {
  return (
    <div className={`${color} p-6 rounded-xl border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-[#0c244c] mt-2">{count}</p>
        </div>
        <Icon size={32} className={`${iconColor} opacity-50`} />
      </div>
    </div>
  );
}
