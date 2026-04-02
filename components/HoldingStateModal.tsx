import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface HoldingStateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  isSubmitting?: boolean;
  packageDetails: {
    customerName: string;
    trackingNumber: string;
    employeeName?: string;
  };
  onHoldingStateSet?: (data: {
    trackingNumber: string;
    reason: string;
    timestamp: string;
  }) => void;
}

export default function HoldingStateModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
  packageDetails,
  onHoldingStateSet,
}: HoldingStateModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [holdingReason, setHoldingReason] = useState("");

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      if (onHoldingStateSet) {
        onHoldingStateSet({
          trackingNumber: packageDetails.trackingNumber,
          reason: holdingReason || "No reason specified",
          timestamp: new Date().toISOString(),
        });
      }
      onConfirm(holdingReason);
      setConfirmed(false);
      setHoldingReason("");
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-blue-50">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-[#0c244c]" />
            <h3 className="text-xl font-semibold text-[#0c244c]">
              Package on Hold
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-gray-700 mb-3">
              This package will be placed in a <span className="font-bold text-[#0c244c]">holding state</span> and requires <span className="font-bold">guard verification</span> before it can be released.
            </p>
            <p className="text-sm text-gray-600">
              A guard will need to verify and sign off on this package later.
            </p>
          </div>

          {/* Package Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#0c244c]">Package Details:</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking Number:</span>
                <span className="font-semibold">{packageDetails.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-semibold">{packageDetails.customerName}</span>
              </div>
              {packageDetails.employeeName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee:</span>
                  <span className="font-semibold">{packageDetails.employeeName}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold text-[#0c244c]"> HOLDING</span>
              </div>
            </div>
          </div>

          {/* Holding Reason */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#0c244c]">
              Reason for Holding (optional)
            </label>
            <textarea
              value={holdingReason}
              onChange={(e) => setHoldingReason(e.target.value)}
              placeholder="Enter reason for placing this package on hold (e.g., Pending damage inspection, Awaiting customer confirmation, Address verification needed)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c244c] text-sm resize-none"
              rows={3}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              This will help guards understand why this package is in holding state
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-600 font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Change Selection
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || confirmed}
            className={`flex-1 py-3 font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
              confirmed
                ? "bg-green-500 text-white"
                : "bg-[#0c244c] hover:bg-[#0c2d5c] disabled:bg-gray-400 text-white"
            }`}
          >
            {confirmed ? (
              <>
                <CheckCircle size={20} />
                Confirmed
              </>
            ) : isSubmitting ? (
              "Submitting..."
            ) : (
              "Confirm & Hold"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
