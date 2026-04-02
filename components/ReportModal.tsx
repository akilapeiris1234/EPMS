import React from "react";
import { Download, X } from "lucide-react";
import { ReportPackage } from "@/utils/formTypes";

interface ReportModalProps {
  isOpen: boolean;
  filteredPackages: ReportPackage[];
  onClose: () => void;
  onDownload: () => void;
}

export default function ReportModal({
  isOpen,
  filteredPackages,
  onClose,
  onDownload,
}: ReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#0c244c]">Report</h2>
            <p className="text-sm text-gray-600 mt-1">Total Records: {filteredPackages.length}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-[#0084c8] hover:bg-[#0071ad] text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Download size={16} /> Download CSV
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#0084c8]">
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Track #</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Reference #</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Type</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Mode</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Customer</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Employee</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">EmpID</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Dept</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Delivery Company</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Delivery Person</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Vehicle #</th>
                  <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Vehicle Type</th>
                  {filteredPackages[0]?.type === "Incoming" ? (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Receive Date</th>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Receive Time</th>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Collected</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Dispatch Date</th>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Dispatch Time</th>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Delivery Date</th>
                      <th className="px-4 py-3 text-left font-bold text-[#0084c8]">Delivery Time</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-[#0084c8]">
                      {pkg.mode === "batch" && pkg.trackingNumbers?.length
                        ? pkg.trackingNumbers.join(", ")
                        : pkg.id
                      }
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{pkg.referenceNumber || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pkg.type === "Incoming" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {pkg.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize font-medium">{pkg.mode}</span>
                    </td>
                    <td className="px-4 py-3">{pkg.customer}</td>
                    <td className="px-4 py-3">{pkg.employee}</td>
                    <td className="px-4 py-3">{pkg.employeeId}</td>
                    <td className="px-4 py-3">{pkg.department}</td>
                    <td className="px-4 py-3">{pkg.deliveryCompany}</td>
                    <td className="px-4 py-3">{pkg.deliveryPersonName}</td>
                    <td className="px-4 py-3">{pkg.vehicleNumber}</td>
                    <td className="px-4 py-3">{pkg.vehicleType}</td>
                    {pkg.type === "Incoming" ? (
                      <>
                        <td className="px-4 py-3">{pkg.receiveDate}</td>
                        <td className="px-4 py-3">{pkg.receiveTime}</td>
                        <td className="px-4 py-3">{pkg.collectedTime}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{pkg.dispatchDate}</td>
                        <td className="px-4 py-3">{pkg.dispatchTime}</td>
                        <td className="px-4 py-3">{pkg.deliveryDate}</td>
                        <td className="px-4 py-3">{pkg.deliveryTime}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
