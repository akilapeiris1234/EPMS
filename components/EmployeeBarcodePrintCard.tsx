"use client";

import React, { useRef } from "react";
import { Printer, Download } from "lucide-react";
import Barcode from "react-barcode";
import { Employee } from "@/utils/formTypes";

interface EmployeeBarcodePrintCardProps {
  employee: Employee;
  onAddAnother: () => void;
}

export default function EmployeeBarcodePrintCard({
  employee,
  onAddAnother,
}: EmployeeBarcodePrintCardProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Employee ID - ${employee.employeeName}</title>
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
              background: #0c244c;
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
            .field {
              font-size: 11px;
              color: #666;
              margin: 3px 0;
            }
            .label {
              font-weight: bold;
              color: #444;
            }
            .barcode-container {
              margin: 8px 0;
              padding: 6px;
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
            <div class="header">Employee Identification Card</div>
            <div class="content">
              <div class="name">${employee.employeeName}</div>
              <div class="field"><span class="label">ID:</span> ${employee.employeeId}</div>
              <div class="field"><span class="label">Company:</span> ${employee.employeeCompany}</div>
              <div class="field"><span class="label">Department:</span> ${employee.department}</div>
              <div class="barcode-container">
                <svg id="barcode"></svg>
              </div>
              <div class="footer">
                Official Employee Identification<br/>Secure Facility Access
              </div>
            </div>
          </div>
          <script>
            JsBarcode("#barcode", "${employee.employeeId}", {
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

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `employee-${employee.employeeId}.png`;
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        ref={barcodeRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-[#0c244c]"
      >
        {/* Header */}
        <div className="bg-[#0c244c] text-white p-4 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase">
            Employee ID Card
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-3">
          <div className="text-2xl font-bold text-[#0c244c]">
            {employee.employeeName}
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-bold">Employee ID:</span> {employee.employeeId}
            </div>
            <div>
              <span className="font-bold">Company:</span> {employee.employeeCompany}
            </div>
            <div>
              <span className="font-bold">Department:</span> {employee.department}
            </div>
          </div>

          {/* Barcode */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
            <Barcode value={employee.employeeId} format="CODE128" />
          </div>

          <div className="text-[8px] text-gray-500 uppercase tracking-wide">
            Official Employee Identification Card
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-[#3ea5d9] hover:bg-[#2d8ab8] text-white font-bold rounded-lg transition-all shadow-md"
        >
          Print Card
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all shadow-md"
        >
          Download
        </button>

        <button
          onClick={onAddAnother}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all shadow-md"
        >
          Add Another
        </button>
      </div>
    </div>
  );
}
