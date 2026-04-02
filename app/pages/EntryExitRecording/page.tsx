"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import { User, Briefcase, Scan, History, ArrowRightLeft, UserCheck } from "lucide-react";

interface GateRecord {
  id: string;
  name: string;
  category: string;
  entryTime: string;
  exitTime?: string;
  type: "employee" | "visitor";
  date: string;
}

export default function GateControlPage() {
  const [mode, setMode] = useState<"employee" | "visitor">("employee");
  const [idInput, setIdInput] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [reason, setReason] = useState("");
  
  const [outsideList, setOutsideList] = useState<GateRecord[]>(() => {
    if (typeof window !== "undefined") {
      const storedRecords = localStorage.getItem("gateRecords");
      if (storedRecords) {
        const parsed = JSON.parse(storedRecords);
        return parsed.filter((r: GateRecord) => !r.exitTime);
      }
    }
    return [];
  });

  const handleRecordExit = () => {
    if (!idInput) return;

    const now = new Date();
    const newExit: GateRecord = {
      id: idInput,
      name: mode === "employee" ? "Employee " + idInput : visitorName || "Visitor",
      category: mode === "employee" ? "" : reason || "General Visit",
      entryTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: mode,
      date: now.toLocaleDateString(),
    };

    const updatedOutsideList = [newExit, ...outsideList];
    setOutsideList(updatedOutsideList);
    
    // Save to system storage
    const allRecords = localStorage.getItem("gateRecords");
    const existingRecords = allRecords ? JSON.parse(allRecords) : [];
    localStorage.setItem("gateRecords", JSON.stringify([...existingRecords, newExit]));
    
    setIdInput("");
    setVisitorName("");
    setReason("");
  };

  const handleRecordReturn = (id: string) => {
    const returnTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setOutsideList(outsideList.filter(r => r.id !== id));
    
    const allRecords = localStorage.getItem("gateRecords");
    if (allRecords) {
      const existingRecords = JSON.parse(allRecords);
      const updatedRecords = existingRecords.map((r: GateRecord) =>
        r.id === id && !r.exitTime ? { ...r, exitTime: returnTime } : r
      );
      localStorage.setItem("gateRecords", JSON.stringify(updatedRecords));
    }
  };

  const filteredList = outsideList.filter((r) => r.type === mode);

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-10 pt-24 lg:pt-10 transition-all">
        
        {/* --- HEADER (Matched to Batch Page) --- */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-[#0c244c]">
                Gate Control
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage personnel entry and exit security</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <DateTime />
            <Link 
              href="/pages/AllEntryExitRecords"
              className="flex items-center gap-2 px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <History size={18} /> View History
            </Link>
          </div>
        </header>

        <hr className="border-gray-300 mb-10" />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* --- LEFT SIDE: EXIT SCANNER (Form Style) --- */}
          <div className="xl:col-span-4 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-[#4a5568] mb-6 flex items-center gap-2">
                <Scan size={20} className="text-blue-500" /> Recording Exit
              </h2>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                {/* Toggle */}
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setMode("employee")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                      mode === "employee" ? "bg-white text-[#0c244c] shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <User size={18} /> Employee
                  </button>
                  <button 
                    onClick={() => setMode("visitor")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                      mode === "visitor" ? "bg-white text-[#0c244c] shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <Briefcase size={18} /> Visitor
                  </button>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  {mode === "visitor" && (
                    <>
                      <div>
                        <InputLabel label="Visitor Name" />
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          placeholder="Full name (optional)"
                        />
                      </div>
                      <div>
                        <InputLabel label="Reason for Visit" />
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="e.g. Maintenance (optional)"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <InputLabel label="Scan ID Card / Entry ID *" />
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-mono text-lg text-center"
                        value={idInput}
                        onChange={(e) => setIdInput(e.target.value)}
                        placeholder="Scan now..."
                      />
                      <Scan className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRecordExit}
                  disabled={!idInput}
                  className="w-full bg-[#0084c8] hover:bg-[#0071ad] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Confirm Exit
                </button>
              </div>
            </section>
          </div>

          {/* --- RIGHT SIDE: ACTIVE LIST (Table Style) --- */}
          <div className="xl:col-span-8">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#4a5568] flex items-center gap-2">
                  <ArrowRightLeft size={20} className="text-blue-500" /> Currently Outside
                </h2>
                <span className={`px-4 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                  mode === "employee" ? "bg-[#e2f9ec] text-[#34d399]" : "bg-[#fef3c7] text-[#f59e0b]"
                }`}>
                  {mode}s: {filteredList.length}
                </span>
              </div>

              {/* Table Headers */}
              <div className="hidden lg:grid grid-cols-12 gap-2 px-8 mb-4 text-[#f87171] font-bold text-xs uppercase tracking-widest">
                <div className="col-span-2">ID</div>
                <div className="col-span-4">Name / Category</div>
                <div className="col-span-3 text-center">Departure</div>
                <div className="col-span-3 text-right">Action</div>
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredList.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl py-20 flex flex-col items-center text-gray-300">
                    <UserCheck size={48} className="mb-2 opacity-20" />
                    <p className="font-bold">No {mode}s currently recorded as outside</p>
                  </div>
                ) : (
                  filteredList.map((record) => (
                    <div 
                      key={record.id} 
                      className="bg-white border border-[#6366f1]/30 rounded-2xl shadow-sm hover:border-[#6366f1] transition-all"
                    >
                      <div className="grid grid-cols-12 gap-2 items-center px-8 py-5 text-[#2d3748] font-semibold text-sm">
                        <div className="col-span-2 font-mono text-xs">{record.id}</div>
                        
                        <div className="col-span-4">
                          <p className="font-bold text-[#0c244c]">{record.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">{record.category}</p>
                        </div>

                        <div className="col-span-3 text-center">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-bold">
                            {record.entryTime}
                          </span>
                        </div>

                        <div className="col-span-3 flex justify-end">
                          <button 
                            onClick={() => handleRecordReturn(record.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                          >
                            Mark Return
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Label Component matched to your Batch Page
function InputLabel({ label }: { label: string }) {
  return (
    <label className="block text-sm font-bold text-[#4a5568] mb-2 ml-1 uppercase tracking-wide">
      {label}
    </label>
  );
}