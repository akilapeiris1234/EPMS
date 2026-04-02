import React, { useState, useEffect } from "react";
import { AlertCircle, Clock, ChevronRight } from "lucide-react";
import { HoldingPackageAlert } from "@/utils/formTypes";

interface HoldingPackagesListProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (packageId: number) => void;
}

export default function HoldingPackagesList({
  isOpen,
  onClose,
  onViewDetails,
}: HoldingPackagesListProps) {
  const [holdingPackages, setHoldingPackages] = useState<HoldingPackageAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchHoldingPackages();
    }
  }, [isOpen]);

  const fetchHoldingPackages = async () => {
    setLoading(true);
    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mockData: HoldingPackageAlert[] = [
        {
          id: 1,
          trackingNumber: "TRK-2025-001",
          customerName: "John Doe",
          type: "incoming",
          holdTime: "2 hours ago",
        },
        {
          id: 2,
          trackingNumber: "TRK-2025-002",
          customerName: "Jane Smith",
          type: "outgoing",
          holdTime: "30 minutes ago",
        },
        {
          id: 3,
          trackingNumber: "TRK-2025-003",
          customerName: "Mike Wilson",
          type: "incoming",
          holdTime: "1 hour ago",
        },
      ];

      setHoldingPackages(mockData);
    } catch (error) {
      console.error("Failed to fetch holding packages:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b bg-blue-50">
          <AlertCircle size={24} className="text-[#0c244c]" />
          <div>
            <h3 className="text-xl font-semibold text-[#0c244c]">
              Packages in Holding State
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {holdingPackages.length} package(s) awaiting guard verification
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">Loading packages...</p>
            </div>
          ) : holdingPackages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <CheckCircle size={40} className="text-green-500 mb-3" />
              <p className="text-gray-600 font-medium">No packages in holding state</p>
              <p className="text-xs text-gray-500 mt-1">All packages are clear!</p>
            </div>
          ) : (
            <div className="divide-y">
              {holdingPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewDetails(pkg.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            pkg.type === "incoming"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {pkg.type === "incoming" ? "📥" : "📤"}
                        </span>
                        <span className="font-semibold text-[#0c244c]">
                          {pkg.trackingNumber}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Customer: <span className="font-medium">{pkg.customerName}</span>
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={14} />
                        <span>Held {pkg.holdTime}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onViewDetails(pkg.id)}
                      className="px-4 py-2 bg-[#0c244c] hover:bg-[#0c2d5c] text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {holdingPackages.length > 0 && (
            <button
              onClick={() => {
                // Navigate to VerifyHoldingPackages page
                window.location.href = "/pages/VerifyHoldingPackages";
              }}
              className="px-4 py-2 bg-[#0c244c] text-white font-medium rounded-lg hover:bg-[#0c2d5c] transition-colors flex items-center gap-2"
            >
              View All <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for when no packages are holding
function CheckCircle({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
