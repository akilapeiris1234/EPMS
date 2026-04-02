"use client";

import React, { useRef } from "react";
import { Printer, Download, UserPlus, ShieldCheck, Fingerprint } from "lucide-react";
import Barcode from "react-barcode";
import { User } from "@/utils/formTypes";

interface BarcodePrintCardProps {
  user: User;
  onAddAnother: () => void;
}

export default function BarcodePrintCard({ user, onAddAnother }: BarcodePrintCardProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);

  const getRoleColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "admin": return "bg-blue-100 text-blue-700 border-blue-200";
      case "supervisor": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Access ID - ${user.name}</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: #fff;
              display: flex;
              justify-content: center;
            }
            .card {
              width: 350px;
              border: 2px solid #ddd;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
              background: #0084c8;
              color: white;
              padding: 12px;
              text-align: center;
              font-size: 11px;
              font-weight: bold;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .content {
              padding: 10px 12px;
              text-align: center;
            }
            .name {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin: 4px 0;
            }
            .username {
              font-size: 11px;
              color: #666;
              margin-bottom: 4px;
            }
            .role {
              display: inline-block;
              padding: 3px 10px;
              border-radius: 10px;
              font-size: 9px;
              font-weight: bold;
              margin-bottom: 8px;
              text-transform: uppercase;
            }
            .barcode-container {
              margin: 6px 0;
              padding: 4px;
              background: #f9f9f9;
              border-radius: 6px;
              display: flex;
              justify-content: center;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
            .footer {
              font-size: 7px;
              color: #999;
              margin-top: 6px;
              line-height: 1.2;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">Access Control Pass</div>
            <div class="content">
              <div class="name">${user.name}</div>
              <div class="username">@${user.Username}</div>
              <div class="role" style="background: ${user.type.toLowerCase() === 'admin' ? '#dbeafe' : user.type.toLowerCase() === 'supervisor' ? '#ede9fe' : '#dcfce7'}; 
                 color: ${user.type.toLowerCase() === 'admin' ? '#1e40af' : user.type.toLowerCase() === 'supervisor' ? '#5b21b6' : '#166534'};">
                ${user.type}
              </div>
              <div class="barcode-container">
                <svg id="barcode"></svg>
              </div>
              <div class="footer">
                Official Access Identity Card<br/>Secure Facility Access
              </div>
            </div>
          </div>
          <script>
            JsBarcode("#barcode", "${user.accessId}", {
              format: "CODE128",
              width: 1.2,
              height: 30,
              displayValue: true,
              fontSize: 11,
              margin: 3
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const svg = barcodeRef.current?.querySelector("svg");
    if (!svg) return;

    // Create a canvas with white background
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (larger for better quality)
    canvas.width = 400;
    canvas.height = 300;

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clone and render the SVG
    const svgClone = svg.cloneNode(true) as SVGElement;
    const svgData = new XMLSerializer().serializeToString(svgClone);
    
    const img = new Image();
    img.onload = () => {
      // Center the barcode image in the canvas
      const x = (canvas.width - img.width) / 2;
      const y = (canvas.height - img.height) / 2;
      ctx.drawImage(img, x, y);
      
      const link = document.createElement("a");
      link.download = `Barcode_${user.accessId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.onerror = () => {
      console.error("Failed to load image");
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="w-full px-4 md:px-0 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start">
        
        {/* ID Card Preview */}
        <div className="w-full md:max-w-[400px] lg:w-auto lg:max-w-[350px] mx-auto md:mx-0 lg:mx-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex-shrink-0">
          <div className="bg-[#0084c8] px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
            <span className="text-white/80 text-[9px] md:text-[10px] font-bold tracking-widest uppercase">Identity Card</span>
            <ShieldCheck size={18} className="text-white/80" />
          </div>
          
          <div className="p-4 md:p-8 flex flex-col items-center text-center">
            <h2 className="text-lg md:text-2xl font-bold text-slate-800 leading-tight">{user.name}</h2>
            <p className="text-slate-400 font-medium mb-3 md:mb-4 text-xs md:text-sm tracking-wide">@{user.Username}</p>
            
            <span className={`px-3 md:px-4 py-1 rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-wider border ${getRoleColor(user.type)}`}>
              {user.type}
            </span>

            <div className="mt-6 md:mt-10 w-full group relative">
              <div className="absolute -inset-2 bg-gray-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div ref={barcodeRef} className="relative bg-white p-2 md:p-3 rounded-lg flex justify-center overflow-x-auto">
                <Barcode 
                    value={user.accessId} 
                    width={1.8}
                    height={90}
                    fontSize={12}
                    margin={0}
                    background="transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-dashed border-gray-200 w-full">
              <div className="flex justify-between items-center px-2">
                <div className="text-left">
                  <p className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold">Issue Date</p>
                  <p className="text-xs md:text-xs font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Instructions & Actions */}
        <div className="w-full lg:flex-1 space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Fingerprint className="text-[#0084c8]" size={22} />
              Account Provisioned
            </h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-5 md:mb-6">
              The user account has been successfully created in the security database. 
              You can now print the physical access badge or download the digital barcode for mobile scanning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 bg-[#0084c8] hover:bg-[#0071ad] text-white font-semibold text-sm md:text-base rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200">
                <Printer size={18} />
                <span className="hidden md:inline">Print Badge</span>
                <span className="md:hidden">Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm md:text-base rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-200">
                <Download size={18} />
                <span className="hidden md:inline">Save PNG</span>
                <span className="md:hidden">Save</span>
              </button>
              <button
                onClick={onAddAnother}
                className="md:col-span-2 flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm md:text-base rounded-xl transition-all shadow-lg shadow-indigo-200">
                <UserPlus size={18} />
                <span className="hidden md:inline">Register New Member</span>
                <span className="md:hidden">New Member</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}