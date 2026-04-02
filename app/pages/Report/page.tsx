"use client";

import React, { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import FilterPanel from "@/components/FilterPanel";
import ReportModal from "@/components/ReportModal";
import Pagination, { usePagination } from "@/components/Pagination";
import { Search } from "lucide-react";
import { generateReportCSV } from "@/utils/reportGenerator";
import { ReportPackage } from "@/utils/formTypes";

// Enhanced package data with all fields
const initialPackages = [
  { 
    id: "000001", type: "Incoming", mode: "single", customer: "Vision care panadura", employee: "Mr.onel", employeeId: "E001", department: "Logistics", employeeCompany: "Vision Systems", deliveryCompany: "Vision Systems", status: "Collected", deliveryPersonName: "John Smith", vehicleNumber: "VH001", vehicleType: "Van", receiveDate: "3.18.2026", receiveTime: "1.26 PM", collectedTime: "2.30 PM", date: "3.18.2026", time: "1.26 PM" 
  },
  { 
    id: "000002", type: "Incoming", mode: "batch", customer: "Vision care panadura", employee: "Mr.onel", employeeId: "E001", department: "Logistics", employeeCompany: "Vision Systems", deliveryCompany: "Vision Systems", status: "Pending", deliveryPersonName: "John Smith", vehicleNumber: "VH001", vehicleType: "Van", receiveDate: "3.19.2026", receiveTime: "10.30 AM", collectedTime: "N/A", date: "3.19.2026", time: "10.30 AM", trackingNumbers: ["000020", "000021", "000022", "000023"], referenceNumber: "20260319-1030-00001"
  },
  { 
    id: "000003", type: "Outgoing", mode: "single", customer: "Medical Supplies Ltd", employee: "Ms.Sarah", employeeId: "E002", department: "Dispatch", employeeCompany: "Medical Systems", deliveryCompany: "Medical Systems", status: "Pending", deliveryPersonName: "Mike Johnson", vehicleNumber: "VH002", vehicleType: "Truck", dispatchDate: "3.18.2026", dispatchTime: "9.00 AM", deliveryDate: "3.19.2026", deliveryTime: "3.00 PM", date: "3.18.2026", time: "9.00 AM" 
  },
  { 
    id: "000004", type: "Incoming", mode: "single", customer: "Electronics Hub", employee: "Mr.Ahmed", employeeId: "E003", department: "Logistics", employeeCompany: "Tech Logistics", deliveryCompany: "Tech Logistics", status: "Collected", deliveryPersonName: "Alex Brown", vehicleNumber: "VH003", vehicleType: "Van", receiveDate: "3.17.2026", receiveTime: "2.15 PM", collectedTime: "3.45 PM", date: "3.17.2026", time: "2.15 PM" 
  },
  { 
    id: "000005", type: "Outgoing", mode: "batch", customer: "Document Services", employee: "Ms.Emily", employeeId: "E004", department: "Dispatch", employeeCompany: "Doc Solutions", deliveryCompany: "Doc Solutions", status: "Collected", deliveryPersonName: "David Wilson", vehicleNumber: "VH004", vehicleType: "Van", dispatchDate: "3.16.2026", dispatchTime: "8.30 AM", deliveryDate: "3.16.2026", deliveryTime: "1.00 PM", date: "3.16.2026", time: "8.30 AM", trackingNumbers: ["000050", "000051", "000052"], referenceNumber: "20260316-0830-00002"
  },
  { 
    id: "000006", type: "Incoming", mode: "single", customer: "Vision care panadura", employee: "Mr.onel", employeeId: "E001", department: "Logistics", employeeCompany: "Vision Systems", deliveryCompany: "Vision Systems", status: "Collected", deliveryPersonName: "John Smith", vehicleNumber: "VH001", vehicleType: "Van", receiveDate: "3.15.2026", receiveTime: "11.00 AM", collectedTime: "12.30 PM", date: "3.15.2026", time: "11.00 AM" 
  },
  { 
    id: "000007", type: "Outgoing", mode: "batch", customer: "Medical Supplies Ltd", employee: "Ms.Sarah", employeeId: "E002", department: "Dispatch", employeeCompany: "Medical Systems", deliveryCompany: "Medical Systems", status: "Pending", deliveryPersonName: "Mike Johnson", vehicleNumber: "VH002", vehicleType: "Truck", dispatchDate: "3.20.2026", dispatchTime: "10.00 AM", deliveryDate: "N/A", deliveryTime: "N/A", date: "3.20.2026", time: "10.00 AM", trackingNumbers: ["000070", "000071", "000072", "000073", "000074"], referenceNumber: "20260320-1000-00003"
  },
];

export default function ReportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  // Apply filters
  const filteredPackages = useMemo(() => {
    return (initialPackages as ReportPackage[]).filter((pkg) => {
      const [month, , year] = pkg.date.split(".");
      const matchesSearch = pkg.id.includes(searchQuery) || pkg.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "" || pkg.type === filterType;
      const matchesMode = filterMode === "" || pkg.mode === filterMode;
      const matchesCustomer = filterCustomer === "" || pkg.customer === filterCustomer;
      const matchesEmployee = filterEmployee === "" || pkg.employee === filterEmployee;
      const matchesMonth = filterMonth === "" || month === filterMonth;
      const matchesYear = filterYear === "" || year === filterYear;
      
      return matchesSearch && matchesType && matchesMode && matchesCustomer && matchesEmployee && matchesMonth && matchesYear;
    });
  }, [searchQuery, filterType, filterMode, filterCustomer, filterEmployee, filterMonth, filterYear]);

  // Pagination for filtered data
  const { currentPage, setCurrentPage, paginatedItems: paginatedPackages, totalPages, totalItems: totalFilteredPackages } = usePagination({ items: filteredPackages, itemsPerPage: 10 });

  // All 12 months
  const allMonths = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = 2026;
  const allYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

  const uniqueTypes = [...new Set(initialPackages.map((pkg) => pkg.type))];
  const uniqueModes = [...new Set(initialPackages.map((pkg) => pkg.mode))];
  const uniqueCustomers = [...new Set(initialPackages.map((pkg) => pkg.customer))];
  const uniqueEmployees = [...new Set(initialPackages.map((pkg) => pkg.employee))];

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c] mb-6">Reports</h1>

        {/* Search Bar */}
        <div className="mb-6 max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Track Number or Customer"
              className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Filters Section */}
        <FilterPanel
          filterType={filterType}
          filterMode={filterMode}
          filterCustomer={filterCustomer}
          filterEmployee={filterEmployee}
          filterMonth={filterMonth}
          filterYear={filterYear}
          onFilterTypeChange={(value) => { setFilterType(value); setCurrentPage(1); }}
          onFilterModeChange={(value) => { setFilterMode(value); setCurrentPage(1); }}
          onFilterCustomerChange={(value) => { setFilterCustomer(value); setCurrentPage(1); }}
          onFilterEmployeeChange={(value) => { setFilterEmployee(value); setCurrentPage(1); }}
          onFilterMonthChange={(value) => { setFilterMonth(value); setCurrentPage(1); }}
          onFilterYearChange={(value) => { setFilterYear(value); setCurrentPage(1); }}
          onReset={() => {
            setFilterType("");
            setFilterMode("");
            setFilterCustomer("");
            setFilterEmployee("");
            setFilterMonth("");
            setFilterYear("");
            setCurrentPage(1);
          }}
          onGenerateReport={() => setShowReportModal(true)}
          uniqueTypes={uniqueTypes}
          uniqueModes={uniqueModes}
          uniqueCustomers={uniqueCustomers}
          uniqueEmployees={uniqueEmployees}
          allMonths={allMonths}
          allYears={allYears}
        />

        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          <p className="text-sm">Showing <span className="font-bold text-[#0084c8]">{filteredPackages.length}</span> filtered results</p>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg">No packages match your filters</p>
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Track #</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Mode</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Employee</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-[#f87171] uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0084c8]">{pkg.id}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                            pkg.type === "Incoming" ? "bg-[#e2f9ec] text-[#34d399]" : "bg-[#fff1f2] text-[#fb7185]"
                          }`}>
                            {pkg.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                            pkg.mode === "single" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {pkg.mode === "single" ? "Single" : "Batch"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{pkg.customer}</td>
                        <td className="px-6 py-4 text-sm">{pkg.employee}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                            pkg.status === "Completed" || pkg.status?.toLowerCase() === "collected" ? "bg-green-100 text-green-700" :
                            pkg.status === "Pending" ? "bg-orange-100 text-orange-600" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {pkg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{pkg.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-3">
              {paginatedPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div><p className="text-xs text-gray-500">Track #</p><p className="font-bold text-[#0084c8]">{pkg.id}</p></div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pkg.type === "Incoming" ? "bg-[#e2f9ec] text-[#34d399]" : "bg-[#fff1f2] text-[#fb7185]"
                      }`}>{pkg.type}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pkg.mode === "single" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>{pkg.mode === "single" ? "Single" : "Batch"}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div><p className="text-gray-500">Customer</p><p className="font-bold">{pkg.customer}</p></div>
                    <div><p className="text-gray-500">Employee</p><p className="font-bold">{pkg.employee}</p></div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                      pkg.status === "Completed" || pkg.status?.toLowerCase() === "collected" ? "bg-green-100 text-green-700" :
                      pkg.status === "Pending" ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalFilteredPackages}
              itemsShown={paginatedPackages.length}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        filteredPackages={filteredPackages}
        onClose={() => setShowReportModal(false)}
        onDownload={() => generateReportCSV(filteredPackages)}
      />
    </div>
  );
}