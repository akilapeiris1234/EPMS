"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useNavigation } from "@/hooks/useNavigation";
import EmployeeBarcodePrintCard from "@/components/EmployeeBarcodePrintCard";
import { generateEmployeeId } from "@/utils/employeeIdGenerator";

export default function AddEmployeePage() {
  const nav = useNavigation();

  const [employeeData, setEmployeeData] = useState({
    employeeName: "",
    employeeCompany: "",
    department: "",
  });

  const [generatedEmployeeId, setGeneratedEmployeeId] = useState<string | null>(null);
  const [generatedEmployee, setGeneratedEmployee] = useState<{
    employeeId: string;
    employeeName: string;
    employeeCompany: string;
    department: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-generate ID when component mounts
  useEffect(() => {
    const newId = generateEmployeeId();
    setGeneratedEmployeeId(newId);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof employeeData
  ) => {
    setEmployeeData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!employeeData.employeeName.trim()) {
      setError("Employee name is required");
      setLoading(false);
      return;
    }

    try {
      // Use the auto-generated Employee ID
      const employeeId = generatedEmployeeId!;

      setSuccess("Employee added successfully!");
      setGeneratedEmployee({
        employeeId,
        employeeName: employeeData.employeeName,
        employeeCompany: employeeData.employeeCompany,
        department: employeeData.department,
      });

      // Reset form
      setEmployeeData({
        employeeName: "",
        employeeCompany: "",
        department: "",
      });
      // Generate new ID for next employee
      const newId = generateEmployeeId();
      setGeneratedEmployeeId(newId);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setGeneratedEmployee(null);
    setSuccess("");
  };

  // Show barcode card after successful submission
  if (generatedEmployee) {
    return (
      <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
        <Sidebar />

        <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
              Employee ID Card
            </h1>
            <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
              {new Date().toLocaleDateString("en-US")}
            </div>
          </header>

          <hr className="border-gray-200 mb-10" />

          <div className="max-w-3xl mx-auto">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            <EmployeeBarcodePrintCard
              employee={generatedEmployee}
              onAddAnother={handleAddAnother}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
            Add Employee Information
          </h1>
          <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString("en-US")}
          </div>
        </header>

        <hr className="border-gray-200 mb-10" />

        <div className="max-w-3xl mx-auto">
          <section className="bg-white p-8 rounded-lg shadow-md">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={employeeData.employeeName}
                  onChange={(e) => handleChange(e, "employeeName")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea5d9] focus:border-transparent"
                  placeholder="Enter employee full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Employee Company
                </label>
                <input
                  type="text"
                  value={employeeData.employeeCompany}
                  onChange={(e) => handleChange(e, "employeeCompany")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea5d9]"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={employeeData.department}
                  onChange={(e) => handleChange(e, "department")}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea5d9]"
                  placeholder="Enter department"
                />
              </div>

              {/* Employee ID Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Employee ID (Auto-Generated)
                </label>
                <input
                  type="text"
                  value={generatedEmployeeId || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border-2 border-green-400 rounded-lg text-gray-700 font-mono font-bold text-lg"
                  placeholder="Generating..."
                />
                {generatedEmployeeId && (
                  <p className="text-xs text-green-600 mt-2 font-semibold">
                    ✓ Employee ID auto-generated
                  </p>
                )}
              </div>
              <div className="flex gap-4 justify-start pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#3ea5d9] hover:bg-[#2d8ab8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
                >
                  {loading ? "Submitting..." : "Submit Employee Info"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (nav.goToAllPackages) {
                      nav.goToAllPackages();
                    } else if (nav.goToDashboard) {
                      nav.goToDashboard();
                    }
                  }}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}