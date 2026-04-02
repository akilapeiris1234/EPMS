"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ChevronDown } from "lucide-react";
import { generateAccessId } from "@/utils/accessIdGenerator";
import BarcodePrintCard from "@/components/BarcodePrintCard";

export default function AccessManagementPage() {
  const [formData, setFormData] = useState({
    accessId: generateAccessId(),
    name: "",
    Username: "",
    type: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userCreated, setUserCreated] = useState(false);
  const [createdUser, setCreatedUser] = useState<typeof formData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Regenerate Access ID when type is selected
      if (field === "type" && value) {
        updated.accessId = generateAccessId(value);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.Username || !formData.type || !formData.newPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Save user data
    setCreatedUser(formData);
    setUserCreated(true);

    // Optional: Reset form for next user
    setTimeout(() => {
      setFormData({
        accessId: generateAccessId(),
        name: "",
        Username: "",
        type: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 500);
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

        {!userCreated ? (
          <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-12">
          
          {/* Section: Guard Information */}
          <section>
            <h2 className="text-2xl font-semibold text-[#4a5568] mb-8">
              Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              
              {/* Row 1 */}
              <div>
                <InputLabel label="Access ID" />
                <input 
                  type="text" 
                  className="form-input-essilor bg-gray-100 cursor-not-allowed" 
                  value={formData.accessId}
                  readOnly
                />
              </div>
              <div>
                <InputLabel label=" Name" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.name}
                  onChange={(e) => handleInputChange(e, "name")}/>
              </div>

              <div>
                <InputLabel label="User Name" />
                <input 
                  type="text" 
                  className="form-input-essilor" 
                  value={formData.Username}
                  onChange={(e) => handleInputChange(e, "Username")}/>
              </div>
              {/* Row 2 */}
              <div className="relative">
                <InputLabel label="Type" />
                <div className="relative">
                  <select className="form-input-essilor appearance-none cursor-pointer pr-10" value={formData.type} onChange={(e) => handleInputChange(e, "type")} >
                    <option value=""></option>
                    <option value="user">Employee</option>
                    <option value="admin">Admin</option>
                    <option value="guard">Guard</option>
                    <option value="supervisor">SuperAdmin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                </div>
              </div>

              <div>
                <InputLabel label="New Password" />
                <input 
                  type="password" 
                  className="form-input-essilor" 
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange(e, "newPassword")}/>
              </div>

              <div>
                <InputLabel label="Confirm Password" />
                <input 
                  type="password" 
                  className="form-input-essilor"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, "confirmPassword")}/>
              </div>

            </div>
          </section>

          {/* Footer Create Button */}
          <div className="flex justify-center md:justify-end pt-12 pb-10">
            <button
              type="submit"
              className="w-full md:w-64 bg-[#0084c8] hover:bg-[#0071ad] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 text-lg">
              Create User
            </button>
          </div>
        </form>
        ) : (
          createdUser && <BarcodePrintCard user={createdUser} onAddAnother={() => setUserCreated(false)} />
        )}
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