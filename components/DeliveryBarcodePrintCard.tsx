"use client";

import React, { useRef } from "react";
import { Printer, Download } from "lucide-react";
import Barcode from "react-barcode";
import { Delivery } from "@/utils/formTypes";

interface DeliveryBarcodePrintCardProps {
  delivery: Delivery;
  onAddAnother: () => void;
}

export default function DeliveryBarcodePrintCard({
  delivery,
  onAddAnother,
}: DeliveryBarcodePrintCardProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Delivery ID - ${delivery.deliveryPersonName}</title>
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
              background: #d97706;
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
            <div class="header">Delivery Identification Card</div>
            <div class="content">
              <div class="name">${delivery.deliveryPersonName}</div>
              <div class="field"><span class="label">NIC/ID:</span> ${delivery.deliveryPersonNIC}</div>
              <div class="field"><span class="label">Company:</span> ${delivery.deliveryCompany}</div>
              <div class="barcode-container">
                <svg id="barcode"></svg>
              </div>
              <div class="footer">
                Official Delivery Identification<br/>Secure Facility Access
              </div>
            </div>
          </div>
          <script>
            JsBarcode("#barcode", "${delivery.deliveryPersonNIC}", {
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
      link.href = canvas.toDataURL("image/png");
      link.download = `delivery-${delivery.deliveryPersonNIC}.png`;
      link.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        ref={barcodeRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-[#d97706]"
      >
        {/* Header */}
        <div className="bg-[#d97706] text-white p-4 text-center">
          <h2 className="text-sm font-bold tracking-widest uppercase">
            Delivery ID Card
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-3">
          <div className="text-2xl font-bold text-[#d97706]">
            {delivery.deliveryPersonName}
          </div>

          <div className="text-xs text-gray-600 space-y-1">
            <div>
              <span className="font-bold">NIC/ID:</span> {delivery.deliveryPersonNIC}
            </div>
            <div>
              <span className="font-bold">Company:</span> {delivery.deliveryCompany}
            </div>
          </div>

          {/* Barcode */}
          <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
            <Barcode value={delivery.deliveryPersonNIC} format="CODE128" />
          </div>

          <div className="text-[8px] text-gray-500 uppercase tracking-wide">
            Official Delivery Identification Card
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-[#d97706] hover:bg-[#c26f1f] text-white font-bold rounded-lg transition-all shadow-md"
        >
          Print Card
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all shadow-md"
        >
          Download
        </button>

        <button
          onClick={onAddAnother}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md"
        >
          Add Another
        </button>
      </div>
    </div>
  );
}
