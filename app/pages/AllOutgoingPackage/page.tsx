"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useNavigation } from "@/hooks/useNavigation";
import Pagination, { usePagination } from "@/components/Pagination";
import { Search, Eye } from "lucide-react";

// Sample Data exactly from your image
const outgoingPackages = [
  { referenceNumber: "000001", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "single" },
  { referenceNumber: "000002", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Collected", date: "3.18.2026", time: "1.26 PM", mode: "batch" },
  { referenceNumber: "000003", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "single" },
  { referenceNumber: "000004", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "batch" },
  { referenceNumber: "000005", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Collected", date: "3.18.2026", time: "1.26 PM", mode: "single" },
  { referenceNumber: "000006", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "batch" },
  { referenceNumber: "000007", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "single" },
  { referenceNumber: "000008", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "batch" },
  { referenceNumber: "000009", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "single" },
  { referenceNumber: "000010", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "batch" },
  { referenceNumber: "000011", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "single" },
  { referenceNumber: "000012", type: "Outgoing", customer: "Vision care panadura", employee: "Mr.onel", status: "Pending", date: "N/A", time: "N/A", mode: "batch" },
];

export default function OutgoingPackagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { goToOutgoingVerification } = useNavigation();
  const { currentPage, setCurrentPage, paginatedItems: paginatedPackages, totalPages, totalItems: totalOutgoingPackages } = usePagination({ items: outgoingPackages, itemsPerPage: 10 });

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        
        {/* --- TOP HEADER --- */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">Outgoing packages</h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </header>

        <hr className="border-gray-200 mb-8" />

        {/* --- TABLE HEADERS (Desktop) --- */}
        <div className="hidden lg:grid grid-cols-12 gap-2 px-8 mb-4 text-[#f87171] font-bold text-sm md:text-base uppercase tracking-wider">
          <div className="col-span-1">Reference Number</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-2 text-center">Customer</div>
          <div className="col-span-1 text-center">Mode</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Date</div>
          <div className="col-span-1 text-center">Time</div>
          <div className="col-span-1 text-right pr-2">Action</div>
        </div>

        {/* --- PACKAGE CARDS --- */}
        <div className="space-y-4">
          {paginatedPackages.map((pkg) => (
            <div 
              key={pkg.referenceNumber} 
              className="bg-white border border-[#6366f1]/30 rounded-2xl shadow-sm hover:border-[#6366f1] transition-all cursor-pointer"
            >
              {/* Desktop View Row */}
              <div 
                onClick={() => goToOutgoingVerification(pkg.referenceNumber)}
                className="hidden lg:grid grid-cols-12 gap-2 items-center px-8 py-5 text-[#2d3748] font-semibold text-sm xl:text-base"
              >
                <div className="col-span-1">{pkg.referenceNumber}</div>
                
                {/* Outgoing Badge (Red) */}
                <div className="col-span-2 flex justify-center">
                  <span className="px-5 py-1.5 rounded-xl bg-[#fee2e2] text-[#ef4444] text-xs font-black uppercase tracking-wider">
                    {pkg.type}
                  </span>
                </div>

                <div className="col-span-2 text-center truncate px-2">{pkg.customer}</div>
                <div className="col-span-1 flex justify-center">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                    pkg.mode === "single" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {pkg.mode === "single" ? "Single" : "Batch"}
                  </span>
                </div>
                <div className="col-span-1 flex justify-center">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                    pkg.status === "Completed" || pkg.status?.toLowerCase() === "collected" ? "bg-green-100 text-green-700" :
                    pkg.status === "Pending" ? "bg-orange-100 text-orange-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {pkg.status}
                  </span>
                </div>

                <div className="col-span-2 text-center whitespace-nowrap">{pkg.date}</div>
                <div className="col-span-1 text-center whitespace-nowrap">{pkg.time}</div>
                
                <div className="col-span-1 flex justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      goToOutgoingVerification(pkg.referenceNumber);
                    }}
                    className="bg-[#0084c8] hover:bg-[#0071ad] text-white px-6 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Mobile View Card */}
              <div 
                onClick={() => goToOutgoingVerification(pkg.referenceNumber)}
                className="lg:hidden p-5 space-y-4 cursor-pointer"
              >
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <span className="font-black text-[#0c244c]">#{pkg.referenceNumber}</span>
                  <span className="px-3 py-1 rounded-lg bg-[#fee2e2] text-[#ef4444] text-[10px] font-black uppercase">
                    {pkg.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-400 font-medium">Customer:</div>
                  <div className="text-right font-bold truncate">{pkg.customer}</div>
                  
                  <div className="text-gray-400 font-medium">Mode:</div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold inline-block ${
                      pkg.mode === "single" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {pkg.mode === "single" ? "Single" : "Batch"}
                    </span>
                  </div>
                  
                  <div className="text-gray-400 font-medium">Status:</div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold inline-block ${
                      pkg.status === "Completed" || pkg.status?.toLowerCase() === "collected" ? "bg-green-100 text-green-700" :
                      pkg.status === "Pending" ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {pkg.status}
                    </span>
                  </div>
                  
                  <div className="text-gray-400 font-medium">Date/Time:</div>
                  <div className="text-right font-bold text-gray-500">{pkg.date} | {pkg.time}</div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToOutgoingVerification(pkg.referenceNumber);
                  }}
                  className="w-full mt-2 bg-[#0084c8] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0071ad] transition-all"
                >
                  <Eye size={18} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalOutgoingPackages}
          itemsShown={paginatedPackages.length}
          onPageChange={setCurrentPage}
        />

      </main>
    </div>
  );
}