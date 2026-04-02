"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import { Search, ArrowLeft } from "lucide-react";

interface GateRecord {
  id: string;
  name: string;
  category: string;
  entryTime: string;
  exitTime?: string;
  type: "employee" | "visitor";
  date: string;
}

export default function AllEntryExitRecordsPage() {
  const [records, setRecords] = useState<GateRecord[]>(() => {
    if (typeof window !== "undefined") {
      const storedRecords = localStorage.getItem("gateRecords");
      return storedRecords ? JSON.parse(storedRecords) : [];
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "employee" | "visitor">("all");

  const filteredRecords = useMemo(() => {
    let filtered = records;
    if (typeFilter !== "all") filtered = filtered.filter(r => r.type === typeFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.id.toLowerCase().includes(q) || 
        r.name.toLowerCase().includes(q) || 
        r.category.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [records, searchQuery, typeFilter]);

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href="/pages/EntryExitRecording"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
              >
                <ArrowLeft size={18} />
              </Link>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Logs</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">Entry & Exit Records</h1>
          </div>
          <DateTime />
        </header>

        <hr className="border-gray-200 mb-8" />

        {/* --- STATS SECTION (System Style) --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox label="Total Records" value={filteredRecords.length} color="blue" />
          <StatBox label="Employees" value={filteredRecords.filter(r => r.type === "employee").length} color="green" />
          <StatBox label="Visitors" value={filteredRecords.filter(r => r.type === "visitor")?.length || 0} color="yellow" />
          <StatBox label="Still Outside" value={filteredRecords.filter(r => !r.exitTime).length} color="red" notify={filteredRecords.filter(r => !r.exitTime).length > 0} />
        </div>

        {/* --- CONTROLS (Search & Filter) --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by ID, Name or Department"
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | "employee" | "visitor")}
            className="px-4 py-2 bg-white border border-gray-100 rounded-lg shadow-sm text-sm font-bold text-[#2d3748] outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="employee">Employees</option>
            <option value="visitor">Visitors</option>
          </select>
        </div>

        {/* --- DESKTOP TABLE HEADERS (System Colors) --- */}
        <div className="hidden lg:grid grid-cols-11 gap-2 px-8 mb-4 text-[#f87171] font-bold text-sm uppercase tracking-wider">
          <div className="col-span-2">
            {typeFilter === "employee" ? "Employee ID" : typeFilter === "visitor" ? "Visitor ID" : "Personnel ID"}
          </div>
          <div className="col-span-3">Personnel Name</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-3 text-center">Time Log (Out - In)</div>
        </div>

        {/* --- RECORDS LIST --- */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-20 text-center text-gray-400 font-bold">
              No records found matching your criteria
            </div>
          ) : (
            filteredRecords.map((record, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-[#6366f1]/30 rounded-2xl shadow-sm hover:border-[#6366f1] transition-all group"
              >
                {/* Desktop Row */}
                <div className="hidden lg:grid grid-cols-11 gap-2 items-center px-8 py-5 text-[#2d3748] font-semibold text-sm">
                  <div className="col-span-2 font-mono text-xs text-gray-500">{record.id}</div>
                  
                  <div className="col-span-3">
                    <p className="font-bold">{record.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{record.category}</p>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      record.type === "employee" ? "bg-[#e2f9ec] text-[#34d399]" : "bg-[#fef3c7] text-[#f59e0b]"
                    }`}>
                      {record.type}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                      record.exitTime ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
                    }`}>
                      {record.exitTime ? "Returned" : "Outside"}
                    </span>
                  </div>

                  <div className="col-span-3 text-center text-xs">
                    <span className="text-gray-400 mr-2">{record.date}</span>
                    <span className="font-bold">{record.entryTime}</span>
                    <span className="mx-2 text-gray-300">→</span>
                    <span className={record.exitTime ? "font-bold text-green-600" : "font-bold text-red-600"}>
                      {record.exitTime || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Mobile View Card */}
                <div className="lg:hidden p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <span className="font-black text-[#0c244c] tracking-tighter">{record.id}</span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                      record.type === "employee" ? "bg-[#e2f9ec] text-[#34d399]" : "bg-[#fef3c7] text-[#f59e0b]"
                    }`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="text-sm font-bold">{record.name}</div>
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>{record.entryTime} - {record.exitTime || "Still Out"}</span>
                    <span className={record.exitTime ? "text-green-600" : "text-orange-600"}>
                      {record.exitTime ? "Returned" : "Outside"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// System-styled Stat Box
function StatBox({ label, value, color, notify }: { label: string, value: number, color: "blue" | "green" | "yellow" | "red", notify?: boolean }) {
  const colorMap: Record<"blue" | "green" | "yellow" | "red", string> = {
    blue: "border-blue-100",
    green: "border-green-100",
    yellow: "border-yellow-100",
    red: "border-red-300"
  };
  
  return (
    <div className={`bg-white border ${colorMap[color]} p-5 rounded-2xl shadow-sm relative`}>
      {notify && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      )}
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#0c244c]">{value}</p>
    </div>
  );
}