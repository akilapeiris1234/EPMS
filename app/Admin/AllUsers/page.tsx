"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Plus } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import AccessControlModal from "@/components/AccessControlModal";

// Sample Data from the image
const accessData = [
  { id: "000001", name: "Mr.no 1", type: "User", Username: "akila", password: "***********" },
  { id: "000002", name: "Mr.no 2", type: "Admin", Username: "chamathi", password: "***********" },
  { id: "000003", name: "Mr.no 3", type: "Super Admin", Username: "vihadu_@", password: "***********" },
];

export default function AccessControlListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof accessData[0] | null>(null);
  const nav = useNavigation();

  const openAccessControlModal = (user: typeof accessData[0]) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-4 gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
            Access Control Management
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}/>
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
        </header>

        <hr className="border-gray-200 mb-6" />

        {/* --- ADD NEW BUTTON --- */}
        <div className="flex justify-end gap-3 mb-6">
          <button 
            onClick={() => nav.goToAddPackage()} 
            className="flex items-center gap-2 bg-[#1f8896] hover:bg-[#116b81] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={23} />
            <span className="text-lg">Add Details</span>
          </button>
          <button 
            onClick={() => nav.goToAddUser()} 
            className="flex items-center gap-2 bg-[#3ea5d9] hover:bg-[#3494c7] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={24} />
            <span className="text-lg">Add New</span>
          </button>
        </div>

        {/* --- TABLE HEADERS (Desktop) --- */}
        <div className="hidden lg:grid grid-cols-12 gap-2 px-8 mb-4 text-[#f87171] font-bold text-base md:text-lg tracking-wide">
          <div className="col-span-1">Access ID</div>
          <div className="col-span-1 text-center">Name</div>
          <div className="col-span-2 text-center">Type</div>
          <div className="col-span-3 text-center">Username</div>
          <div className="col-span-2 text-center">Password</div>
          <div className="col-span-3 text-right"></div>
        </div>

        {/* --- USER LIST --- */}
        <div className="space-y-4">
          {accessData.map((user, index) => (
            <div key={index} className="bg-white border border-[#6366f1]/30 rounded-2xl shadow-sm hover:border-[#6366f1] transition-all" >
              {/* Desktop View Row */}
              <div className="hidden lg:grid grid-cols-12 gap-2 items-center px-8 py-5 text-[#2d3748] font-semibold text-sm xl:text-base">
                <div className="col-span-1">{user.id}</div>
                <div className="col-span-1 text-center truncate">{user.name}</div>
                <div className="col-span-2 text-center">{user.type}</div>
                <div className="col-span-3 text-center truncate">{user.Username}</div>
                <div className="col-span-2 text-center font-mono">{user.password}</div>
                
                <div className="col-span-3 flex justify-end gap-3">
                  <button onClick={() => openAccessControlModal(user)} className="bg-[#3ea5d9] hover:bg-[#3494c7] text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95" >
                    Access control
                  </button>
                  <button onClick={() => nav.goToDeleteUser()} className="bg-[#3ea5d9] hover:bg-[#3494c7] text-white px-8 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95" >
                    Edit
                  </button>
                </div>
              </div>

              {/* Mobile View Card */}
              <div className="lg:hidden p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-black">Access ID</span>
                    <span className="font-bold text-[#0c244c]">{user.id}</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                    {user.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-400 font-medium">Name:</div>
                  <div className="text-right font-bold">{user.name}</div>
                  
                  <div className="text-gray-400 font-medium">Username:</div>
                  <div className="text-right font-bold truncate">{user.Username}</div>
                  
                  <div className="text-gray-400 font-medium">Password:</div>
                  <div className="text-right font-mono font-bold tracking-tighter">{user.password}</div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => openAccessControlModal(user)} className="flex-1 bg-[#3ea5d9] hover:bg-[#3494c7] text-white py-2.5 rounded-xl font-bold text-xs transition-colors" >
                    Access control
                  </button>
                  <button onClick={() => nav.goToDeleteUser()} className="flex-1 bg-[#3ea5d9] hover:bg-[#3494c7] text-white py-2.5 rounded-xl font-bold text-xs transition-colors" >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Access Control Modal */}
      <AccessControlModal isOpen={isModalOpen} selectedUser={selectedUser} onClose={closeModal} />
    </div>
  );
}

