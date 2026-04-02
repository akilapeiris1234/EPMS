"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DateTime from "@/components/DateTime";
import { ChevronDown } from "lucide-react";

export default function AccessControlEditPage() {
  // Initial state with the sample data from your image
  const [formData, setFormData] = useState({
    accessId: "000001",
    name: "Mr.no 1",
    email: "test@gmail.com",
    type: "Staff",
    newPassword: "************",
    confirmPassword: "************",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 lg:ml-72 p-4 md:p-10 pt-24 lg:pt-10 transition-all duration-300">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
            Access Control Management
          </h1>
        </header>

        <hr className="border-gray-300 mb-10" />

        <form className="max-w-7xl mx-auto space-y-12">
          
          {/* Section: Guard Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-8">
              Guard Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              
              {/* Row 1: Access ID, Name, Email */}
              <div>
                <InputLabel label="Access ID" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.accessId}
                  onChange={(e) => handleInputChange(e, "accessId")}
                />
              </div>

              <div>
                <InputLabel label="Name" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, "name")}
                />
              </div>

              <div>
                <InputLabel label="Email" />
                <input 
                  type="email" 
                  className="form-input-essilor" 
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                />
              </div>

              {/* Row 2: Type, New Password, Confirm Password */}
              <div className="relative">
                <InputLabel label="type" />
                <div className="relative">
                  <select className="form-input-essilor appearance-none cursor-pointer pr-10" value={formData.type} onChange={(e) => handleInputChange(e, "type")} >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <InputLabel label="New Password" />
                <input 
                  type="text" // Shown as text with asterisks in your image
                  className="form-input-essilor" 
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange(e, "newPassword")}
                />
              </div>

              <div>
                <InputLabel label="Confirm Password" />
                <input 
                  type="text" // Shown as text with asterisks in your image
                  className="form-input-essilor" 
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, "confirmPassword")}
                />
              </div>

            </div>
          </section>

          {/* Footer Delete Button */}
          <div className="flex justify-center md:justify-end pt-12 pb-10">
            <button type="button" className="w-full md:w-64 bg-[#0084c8] hover:bg-[#0071ad] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-lg" >
              Delete
            </button>
          </div>
        </form>
      </main>

      {/* Styled Input CSS */}
      <style jsx>{`
        .form-input-essilor {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background-color: #f1f3f5;
          border: 1px solid #ced4da;
          border-radius: 0.75rem;
          outline: none;
          font-size: 1.125rem;
          font-weight: 500;
          color: #495057;
          transition: all 0.2s ease;
        }
        .form-input-essilor:focus {
          background-color: #fff;
          border-color: #0084c8;
          box-shadow: 0 0 0 4px rgba(0, 132, 200, 0.1);
        }
      `}</style>
    </div>
  );
}

function InputLabel({ label }: { label: string }) {
  return (
    <label className="block text-xl font-medium text-[#2d3748] mb-3 ml-1">
      {label}
    </label>
  );
}
