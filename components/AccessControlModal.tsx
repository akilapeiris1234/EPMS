"use client";

import React, { useState } from "react";
import { KeyRound, X } from "lucide-react";

interface AccessControlModalProps {
  isOpen: boolean;
  selectedUser: {
    id: string;
    name: string;
    type: string;
    Username: string;
    password: string;
  } | null;
  onClose: () => void;
}

function ToggleSwitch({ isActive, onChange }: { isActive: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-16 h-8 rounded-full transition-colors ${
        isActive ? "bg-[#17a2b8]" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
          isActive ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AccessControlModal({ isOpen, selectedUser, onClose }: AccessControlModalProps) {
  
  const [permissions, setPermissions] = useState({
    dashboardAccess: true,
    addOngoingPackage: true,
    addIncomePackage: false,
    allPackagesView: true,
    allPackagesEdit: true,
    allPackagesDelete: false,
    outgoingVerification: true,
    incomeVerification: false,
    accessManagementAdd: true,
    accessManagementEdit: true,
    accessManagementControl: false,
    reportAccess: false,
    EntryExitRecording: true,
    VerifyHoldingPackages: false,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        
        {/* Modal Header */}
        <div className="bg-white flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 bg-[#17a2b8] rounded-full">
              <KeyRound size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#17a2b8]">
                Access Control
              </h2>
              <p className="text-sm text-gray-500">{selectedUser.id} - {selectedUser.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-3">
          
          {/* Dashboard Access */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-lg font-semibold text-[#2d3748]">Dashboard Access</span>
            <ToggleSwitch 
              isActive={permissions.dashboardAccess}
              onChange={() => togglePermission("dashboardAccess")}
            />
          </div>

          {/* Add Ongoing Package access */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-lg font-semibold text-[#2d3748]">Add Ongoing Package access</span>
            <ToggleSwitch 
              isActive={permissions.addOngoingPackage}
              onChange={() => togglePermission("addOngoingPackage")}
            />
          </div>

          {/* Add income Package access */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-lg font-semibold text-[#2d3748]">Add income Package access</span>
            <ToggleSwitch 
              isActive={permissions.addIncomePackage}
              onChange={() => togglePermission("addIncomePackage")}
            />
          </div>

          {/* All packages */}
          <div className="py-2 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-[#2d3748]">All packages</span>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">View</span>
                  <ToggleSwitch 
                    isActive={permissions.allPackagesView}
                    onChange={() => togglePermission("allPackagesView")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">Edit</span>
                  <ToggleSwitch 
                    isActive={permissions.allPackagesEdit}
                    onChange={() => togglePermission("allPackagesEdit")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">Delete</span>
                  <ToggleSwitch 
                    isActive={permissions.allPackagesDelete}
                    onChange={() => togglePermission("allPackagesDelete")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outgoing Package Verification */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-lg font-semibold text-[#2d3748]">Outgoing Package Verification</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1 font-medium">View</span>
              <ToggleSwitch 
                isActive={permissions.outgoingVerification}
                onChange={() => togglePermission("outgoingVerification")}
              />
            </div>
          </div>

          {/* Income Package Verification */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-lg font-semibold text-[#2d3748]">Income Package Verification</span>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500 mb-1 font-medium">View</span>
              <ToggleSwitch 
                isActive={permissions.incomeVerification}
                onChange={() => togglePermission("incomeVerification")}
              />
            </div>
          </div>

          {/* Access Management */}
          <div className="py-2 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-[#2d3748]">Access Management</span>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">Add</span>
                  <ToggleSwitch 
                    isActive={permissions.accessManagementAdd}
                    onChange={() => togglePermission("accessManagementAdd")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">Edit</span>
                  <ToggleSwitch 
                    isActive={permissions.accessManagementEdit}
                    onChange={() => togglePermission("accessManagementEdit")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">Control</span>
                  <ToggleSwitch 
                    isActive={permissions.accessManagementControl}
                    onChange={() => togglePermission("accessManagementControl")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report access */}
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold text-[#2d3748]">Report access</span>
            <ToggleSwitch 
              isActive={permissions.reportAccess}
              onChange={() => togglePermission("reportAccess")}
            />
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold text-[#2d3748]">Entry & Exit Recording</span>
            <ToggleSwitch 
              isActive={permissions.EntryExitRecording}
              onChange={() => togglePermission("EntryExitRecording")}
            />
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-lg font-semibold text-[#2d3748]">Verify Holding Packages</span>
            <ToggleSwitch 
              isActive={permissions.VerifyHoldingPackages}
              onChange={() => togglePermission("VerifyHoldingPackages")}
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-white flex gap-4 justify-center p-5 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-[#3ea5d9] hover:bg-[#3494c7] text-white font-bold rounded-lg transition-colors">
            Update
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold rounded-lg transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
