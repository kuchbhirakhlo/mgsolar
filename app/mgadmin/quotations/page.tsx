"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import html2pdf from "html2pdf.js";

export default function QuotationPage() {

  const [form, setForm] = useState({
    quotationNo: "",
    date: "",
    customerName: "",
    address: "",
    price: "",
    mobileNumber: "",
    email: "",
    systemType: "",
    kilowatt: "",
    panelCompanyName: "",
    inverterCompanyName: "",
    referredBy: "",
  });



  useEffect(() => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const quotationNo = `MGE/${Math.floor(Date.now() / 1000)}/2026`;
    setForm(prev => ({ ...prev, date: dateStr, quotationNo }));
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCustomer = async () => {
    if (form.mobileNumber.length === 10) {
      try {
        const response = await fetch(`/api/customers/${form.mobileNumber}`);
        const data = await response.json();
        if (data.success) {
          const customer = data.customer;
          // Extract only numbers from kilowatt (remove 'kw' text)
          const kilowattValue = customer.kilowatt ? customer.kilowatt.toString().replace(/[^\d.]/g, '') : "";
          setForm(prev => ({
            ...prev,
            customerName: customer.customerName || "",
            address: customer.address || "",
            email: customer.email || "",
            systemType: customer.systemType || "",
            kilowatt: kilowattValue,
            panelCompanyName: customer.panelCompanyName || "",
            inverterCompanyName: customer.inverterCompanyName || "",
            referredBy: customer.referredBy || "",
            price: customer.quotationPrice || "",
          }));
        } else {
          alert("Customer not found");
          // Reset if not found
          setForm(prev => ({
            ...prev,
            customerName: "",
            address: "",
            email: "",
            systemType: "",
            kilowatt: "",
            panelCompanyName: "",
            inverterCompanyName: "",
            referredBy: "",
            price: "",
          }));
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        alert("Error fetching customer");
      }
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("pdf-content");

    html2pdf()
      .from(element!)
      .set({
        margin: 0,
        filename: "quotation.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="bg-gray-200 p-6">

      {/* 🔧 FORM */}
      <div className="max-w-4xl mx-auto bg-white p-4 mb-6 shadow text-sm">
        <h2 className="font-bold mb-3">Edit Quotation</h2>

        <div className="grid grid-cols-2 gap-2">
          <input name="quotationNo" value={form.quotationNo} onChange={handleChange} className="border p-2" disabled placeholder="Quotation No"/>
          <input name="date" value={form.date} onChange={handleChange} className="border p-2" disabled placeholder="Date"/>
          <div className="col-span-2 flex gap-2">
            <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Mobile Number" className="border p-2 flex-1"/>
            <button onClick={fetchCustomer} className="bg-blue-500 text-white px-4 py-2">Fetch Customer</button>
          </div>
          <input name="customerName" value={form.customerName} onChange={handleChange} placeholder="Customer Name" className="border p-2"/>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2"/>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2"/>
          <input name="kilowatt" value={form.kilowatt} onChange={handleChange} placeholder="Kilowatt" className="border p-2"/>
          <input name="systemType" value={form.systemType} onChange={handleChange} placeholder="System Type" className="border p-2"/>
          <input name="panelCompanyName" value={form.panelCompanyName} onChange={handleChange} placeholder="Panel Company" className="border p-2"/>
          <input name="inverterCompanyName" value={form.inverterCompanyName} onChange={handleChange} placeholder="Inverter Company" className="border p-2"/>
          <input name="referredBy" value={form.referredBy} onChange={handleChange} placeholder="Referred By" className="border p-2"/>
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2"/>
        </div>

        <button onClick={downloadPDF} className="mt-3 bg-black text-white px-4 py-2">
          Download PDF
        </button>
      </div>

      {/* 📄 PDF */}
      <div className="flex justify-center">
        <div id="pdf-content" className="bg-white">

          {/* ================= PAGE 1 ================= */}
          <div className="w-[794px] h-[1123px] p-10 relative border-2 border-black">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Image src="/mgsolarlogo.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <Image src="/mgsolarheader.png" alt="header" width={754} height={100} className="w-full" loading="eager"/>
            </div>

            {/* TO SECTION */}
            <div className="mt-6 text-sm space-y-1">
              <p>To,</p>
              <p>Customer Name: {form.customerName}</p>
              <p>Address: {form.address}</p>
               <p>
                 Subject: {form.kilowatt} KW Solar Quotation for Supply & Installation of Rooftop System
               </p>
              <p>Dear Sir/Madam,</p>
            </div>

            {/* BODY TEXT */}
            <p className="mt-4 text-sm">
              With reference to your requirement, we are pleased to submit our quotation for Supply,
              Installation, Testing & Commissioning of a {form.kilowatt} KW Grid-Connected Solar Rooftop System at your premises.
            </p>

            {/* SYSTEM DETAILS */}
            <div className="mt-6 text-sm">
              <h2 className="font-semibold mb-2">SYSTEM DETAILS</h2>

              <table className="w-full border">
                <thead>
                  <tr>
                    <th className="border p-2">S.No.</th>
                    <th className="border p-2">Particulars</th>
                    <th className="border p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border p-2">1</td><td className="border p-2">System Capacity</td><td className="border p-2">{form.kilowatt} KW ({form.systemType})</td></tr>
                  <tr><td className="border p-2">2</td><td className="border p-2">Solar Panels</td><td className="border p-2">{form.panelCompanyName} </td></tr>
                  <tr><td className="border p-2">3</td><td className="border p-2">Inverter</td><td className="border p-2">{form.inverterCompanyName}</td></tr>
                  <tr><td className="border p-2">4</td><td className="border p-2">Structure</td><td className="border p-2">GI / Aluminium Rooftop</td></tr>
                  <tr><td className="border p-2">5</td><td className="border p-2">Generation</td><td className="border p-2">{form.kilowatt ? (() => {
                    const kw = parseFloat(form.kilowatt.replace(/[^\d.]/g, '')) || 0;
                    const min = kw * 4;
                    const max = kw * 5;
                    return `${min}–${max} Units per Day`;
                  })() : "Units per Day"}</td></tr>
                  <tr><td className="border p-2">6</td><td className="border p-2">ACDB & DCDB</td><td className="border p-2">Polycab / Havells</td></tr>
                  <tr><td className="border p-2">7</td><td className="border p-2">Wire</td><td className="border p-2">Polycab (4 sq mm)</td></tr>
                  <tr><td className="border p-2">8</td><td className="border p-2">Earthing</td><td className="border p-2">Green (4 sq mm)</td></tr>
                  <tr><td className="border p-2">9</td><td className="border p-2">Warranty</td><td className="border p-2">Panel: 25+ Years, Inverter: 5–10 Years</td></tr>
                </tbody>
              </table>
            </div>

            {/* FOOTER PAGE 1 */}
            <div className="absolute bottom-6 left-10 right-10">
              <Image src="/mgsolarfooter.png" alt="footer" width={754} height={50} className="w-full"/>
            </div>
          </div>

          {/* Gap between pages */}
          <div className="h-8"></div>

          {/* ================= PAGE 2 ================= */}
          <div className="w-[794px] h-[1123px] p-10 relative border-2 border-black">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Image src="/mgsolarlogo.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <Image src="/mgsolarheader.png" alt="header" width={754} height={100} className="w-full" loading="eager"/>
            </div>

            {/* PRICE BREAKUP */}
            <div className="text-sm">
              <h2 className="font-semibold mb-2">PRICE BREAKUP</h2>

              <table className="w-full border">
                <tbody>
                  <tr><td className="border p-2">{form.kilowatt} KW Solar Rooftop System</td><td className="border p-2">₹ {form.price}/-</td></tr>
                  <tr><td className="border p-2">Installation & Commissioning</td><td className="border p-2">Included</td></tr>
                  <tr><td className="border p-2">Transportation</td><td className="border p-2">Not Included</td></tr>
                  <tr><td className="border p-2">Net Metering Assistance</td><td className="border p-2">Included</td></tr>
                  <tr><td className="border p-2">GST</td><td className="border p-2">Included</td></tr>
                  <tr className="font-bold"><td className="border p-2">Total Amount Payable</td><td className="border p-2">₹ {form.price}/-</td></tr>
                </tbody>
              </table>

              <p className="mt-2">
                (Amount in words: Rupees One Lakh Seventy Thousand Only)
              </p>
            </div>

            {/* TERMS AND BANK SIDE BY SIDE */}
            <div className="flex gap-4 mt-6">
              <div className="flex-1 text-sm">
                <h2 className="font-semibold">TERMS & CONDITIONS</h2>
                <p>Validity of quotation: 15 days</p>
                <p>Installation Timeline: 15–25 Working Days</p>
                <p>Net metering subject to DISCOM approval.</p>
                <p>System generation depends on sunlight & site conditions. Payment Terms: 70% Advance, 20% Before Installation, 10% After Commissioning</p>
                <p>Operation & maintenance charges are not included in this price.</p>
              </div>

              <div className="flex-1 text-sm">
                <h2 className="font-bold">Company Bank Details</h2>
                <span className="font-bold">
                <p>Bank Name: Punjab National Bank</p>
                <p>Account No.: 6193002100003379</p>
                <p>IFSC: PUNB0619300</p>
                <p>Branch: Vibhuti Khand, Gomti Nagar, Lucknow</p>
                </span>
              </div>
            </div>

            {/* DECLARATION */}
            <div className="mt-6 text-sm">
              <h2 className="font-semibold">DECLARATION</h2>
              <p>
              We hereby declare that the above quotation is true and correct. 
              All materials supplied will be new and of standard quality. 
              Installation will be carried out as per site conditions and applicable norms. 
              Warranties shall be as per manufacturer terms. 
              Prices and approvals are subject to applicable rules and regulations.
              </p>
            </div>

            {/* SIGNATURE */}
            <div className="mt-16 flex justify-between text-sm">
              <div>
                <p>Consumer Name:</p>
                <p>Signature:</p>
              </div>

              <div className="text-right">
                <p>Authorized Signatory</p>
                <p className="font-semibold">M.G. ENTERPRISES</p>
              </div>
            </div>

            {/* FOOTER PAGE 2 */}
            <div className="absolute bottom-6 left-10 right-10">
              <Image src="/mgsolarfooter.png" alt="footer" width={754} height={50} className="w-full"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}