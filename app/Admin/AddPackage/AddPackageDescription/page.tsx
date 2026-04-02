"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useNavigation } from "@/hooks/useNavigation";

export default function AddPackagePage() {
  const nav = useNavigation();

  const [packageData, setPackageData] = useState({
    packageDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPackageData((prev) => ({ ...prev, packageDescription: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!packageData.packageDescription.trim()) {
      setError("Please enter package description");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addPackage",
          userRole: "Admin",
          ...packageData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add package");
      }

      setSuccess("Package information added successfully!");
      setPackageData({
        packageDescription: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        if (nav.goToAllPackages) {
          nav.goToAllPackages();
        } else if (nav.goToDashboard) {
          nav.goToDashboard();
        }
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans text-[#2d3748]">
      <Sidebar />

      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-10 transition-all">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0c244c]">
            Add Package Description
          </h1>
          <div className="bg-white px-6 py-2 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US')}
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

            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Package Description *
                </label>
                <textarea
                  rows={8}
                  value={packageData.packageDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3ea5d9] resize-y"
                  placeholder="Describe the package (e.g., documents, electronics, fragile items, weight, dimensions, etc.)"
                />
              </div>

              <div className="flex gap-4 justify-start pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#3ea5d9] hover:bg-[#2d8ab8] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.98]"
                >
                  {loading ? "Submitting..." : "Submit Package Info"}
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
