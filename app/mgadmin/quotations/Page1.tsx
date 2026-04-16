"use client";

import Image from "next/image";

export default function QuotationPage() {
  return (
    <div className="flex justify-center bg-gray-200 py-10">
      
      {/* A4 Page */}
      <div
        id="pdf-content"
        className="relative bg-white w-[794px] h-[1123px] p-10 shadow-lg"
      >
        {/* 🔥 Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <Image
            src="/mgsolarlogo.png"
            alt="watermark"
            width={400}
            height={400}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">QUOTATION</h1>
            <p className="text-sm">S. No: MGE/121</p>
            <p className="text-sm">Date: 23/Feb/2026</p>
          </div>

          <div className="text-right">
            <Image
              src="/mgsolarlogo.png"
              alt="logo"
              width={120}
              height={60}
            />
            <p className="text-sm font-semibold mt-2">
              M.G. ENTERPRISES
            </p>
          </div>
        </div>

        {/* Client Info */}
        <div className="relative z-10 mt-6 space-y-1 text-sm">
          <p><strong>Client Name:</strong> ____________</p>
          <p><strong>Project Address:</strong> ____________</p>
          <p><strong>Contact Information:</strong> ____________</p>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-6">
          <h2 className="text-lg font-semibold">
            Proposal for 75.0 KW Commercial Hybrid Solar Power System
          </h2>
        </div>

        {/* Table */}
        <div className="relative z-10 mt-6">
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Item / Component</th>
                <th className="border p-2">Details</th>
                <th className="border p-2">Make</th>
                <th className="border p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Solar Panels</td>
                <td className="border p-2">
                  590/620 W, Topcon Bifacial Modules
                </td>
                <td className="border p-2">
                  VIKRAM / UTL / RenewSys
                </td>
                <td className="border p-2">121 Nos</td>
              </tr>

              <tr>
                <td className="border p-2">Hybrid Inverter</td>
                <td className="border p-2">
                  40 KW Hybrid with WiFi
                </td>
                <td className="border p-2">UTL</td>
                <td className="border p-2">2 Unit</td>
              </tr>

              <tr>
                <td className="border p-2">Structure</td>
                <td className="border p-2">
                  Galvanized Mounting Structure
                </td>
                <td className="border p-2">—</td>
                <td className="border p-2">1 Set</td>
              </tr>

              <tr>
                <td className="border p-2">Battery Bank</td>
                <td className="border p-2">
                  Lithium 100AH (240V)
                </td>
                <td className="border p-2">UTL</td>
                <td className="border p-2">2 Set</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cost Section */}
        <div className="relative z-10 mt-6 text-sm">
          <h3 className="font-semibold mb-2">
            Total Cost for 75 KW System
          </h3>

          <div className="border p-4 space-y-1">
            <p>Subtotal: ₹56,25,000</p>
            <p>GST (5%): ₹2,81,250</p>
            <p>Transport: Not Included</p>

            <hr />

            <p className="font-bold text-lg">
              GRAND TOTAL: ₹56,25,000
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 absolute bottom-10 left-10 right-10 text-xs text-center">
          <p>
            Note: Prices include GST. Transportation not included.
          </p>
        </div>
      </div>
    </div>
  );
}