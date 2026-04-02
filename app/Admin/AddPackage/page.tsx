"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function AddPackagePage() {
  const sections = [
    {
      title: "Add Employee Information",
      description: "Enter employee name, ID, company, and department",
      href: "/Admin/AddPackage/AddEmployee",
      icon: "👤",
    },
    {
      title: "Add Package Description",
      description: "Describe the package details and contents",
      href: "/Admin/AddPackage/AddPackageDescription",
      icon: "📦",
    },
    {
      title: "Add Customer Information",
      description: "Enter the customer name and details",
      href: "/Admin/AddPackage/AddCustomer",
      icon: "👥",
    },
    {
      title: "Add Delivery Information",
      description: "Enter delivery person and company details",
      href: "/Admin/AddPackage/AddDelivery",
      icon: "🚚",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
            Add Package & Employee
          </h1>
          <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US')}
          </div>
        </header>

        <hr className="border-gray-200 mb-10" />

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link key={section.href} href={section.href}>
                <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer hover:border-[#3ea5d9] border-2 border-transparent">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h2 className="text-xl font-bold text-[#0c244c] mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  <div className="flex items-center text-[#3ea5d9] font-semibold">
                    Continue →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}