"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import html2pdf from "html2pdf.js";
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Quotation {
  id: string;
  customerId: string;
  quotationNo: string;
  date: string;
  customerName: string;
  address: string;
  price: string;
  mobileNumber: string;
  email: string;
  systemType: string;
  kilowatt: string;
  panelCompanyName: string;
  inverterCompanyName: string;
  referredBy: string;
  createdAt: string;
}

export default function QuotationPage() {
  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [form, setForm] = useState({
    quotationNo: "",
    date: "",
    customerId: "",
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



  const { isLoading, submitForm } = useFormSubmit();

  useEffect(() => {
    const employeeDataStr = sessionStorage.getItem('employeeData');
    if (employeeDataStr) {
      setIsEmployee(true);
      setEmployeeData(JSON.parse(employeeDataStr));
    }

    // Load quotations from Firestore
    let unsubscribe: (() => void) | undefined;

    const loadQuotations = async () => {
      const quotationsRef = collection(db, 'quotations');
      unsubscribe = onSnapshot(quotationsRef, async (snapshot: QuerySnapshot<DocumentData>) => {
        const quotationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Quotation[];

        // Filter quotations based on employee permissions
        let filteredQuotations = quotationsData;

        // Check if user is employee by reading sessionStorage directly
        const employeeDataStr = sessionStorage.getItem('employeeData');
        if (employeeDataStr) {
          const empData = JSON.parse(employeeDataStr);
          // For employees, only show quotations for customers they created
          const customersRef = collection(db, 'customers');
          const customersSnapshot = await getDocs(query(customersRef, where('createdBy', '==', empData.empId)));
          const employeeCustomerIds = customersSnapshot.docs.map(doc => doc.id);

          filteredQuotations = quotationsData.filter(quotation =>
            employeeCustomerIds.includes(quotation.customerId)
          );
        }

        setQuotations(filteredQuotations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      });
    };

    loadQuotations().catch(console.error);

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const quotationNo = `MGE/${Math.floor(Date.now() / 1000)}/2026`;
    setForm(prev => ({ ...prev, date: dateStr, quotationNo }));

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchCustomer = async () => {
    if (form.mobileNumber.length === 10) {
      try {
        // Build URL with employee ID if user is an employee
        const url = employeeData
          ? `/api/customers/${form.mobileNumber}?employeeId=${employeeData.empId}`
          : `/api/customers/${form.mobileNumber}`;

        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          const customer = data.customer;
          // Extract only numbers from kilowatt (remove 'kw' text)
          const kilowattValue = customer.kilowatt ? customer.kilowatt.toString().replace(/[^\d.]/g, '') : "";
          setForm(prev => ({
            ...prev,
            customerId: customer.id,
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
            customerId: "",
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
        if (!(error instanceof Error) || error.name !== 'AbortError') {
          alert("Error fetching customer");
        }
      }
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return "Zero";

    const belowTwenty = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const helper = (n: number): string => {
      if (n < 20) return belowTwenty[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
      if (n < 1000) return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + helper(n % 100) : "");
      if (n < 100000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + helper(n % 1000) : "");
      if (n < 10000000) return helper(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + helper(n % 100000) : "");
      return helper(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + helper(n % 10000000) : "");
    };

    return helper(num);
  };

  const handleSubmit = async () => {
    const submitQuotation = async () => {
      const quotationData = {
        ...form,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'quotations'), quotationData);
    };

    if (validateForm()) {
      submitForm(
        submitQuotation,
        'Quotation saved successfully!'
      );
    }
  };

  const validateForm = () => {
    if (!form.customerName.trim()) {
      alert('Customer name is required');
      return false;
    }
    if (!form.mobileNumber.trim()) {
      alert('Mobile number is required');
      return false;
    }
    if (!form.price.trim()) {
      alert('Price is required');
      return false;
    }
    return true;
  };

  const downloadPDF = (quotationData?: Quotation) => {
    const element = document.getElementById("pdf-content");

    if (!element) {
      alert("PDF content not found");
      return;
    }

    // Temporarily update the form data if using quotation data
    const originalForm = { ...form };
    const dataToUse = quotationData || form;

    if (quotationData) {
      setForm(quotationData);
      // Wait for state update
      setTimeout(() => generatePDF(dataToUse, element), 100);
      return;
    }

    generatePDF(dataToUse, element);

    function generatePDF(data: any, pdfElement: HTMLElement) {
      // Clone the element to avoid modifying the original
      const clonedElement = pdfElement.cloneNode(true) as HTMLElement;

      // Add CSS override for unsupported color functions
      const styleOverride = document.createElement('style');
      styleOverride.textContent = `
        * {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }
        .bg-gray-200 { background-color: #f3f4f6 !important; }
        .text-sm { color: #000000 !important; }
        .font-bold { font-weight: bold !important; }
        .font-semibold { font-weight: 600 !important; }
        @page { size: A4; margin: 0; }
      `;
      clonedElement.insertBefore(styleOverride, clonedElement.firstChild);

      // Force recompute styles
      clonedElement.style.display = 'block';
      clonedElement.offsetHeight; // Trigger reflow

      // Wait for images to load
      const images = clonedElement.querySelectorAll("img");
      const imagePromises = Array.from(images).map(img => {
        return new Promise((resolve, reject) => {
          if (img.complete) {
            resolve(void 0);
          } else {
            img.onload = resolve;
            img.onerror = reject;
          }
        });
      });

      Promise.all(imagePromises).then(() => {
        try {
          html2pdf()
            .from(clonedElement)
            .set({
              margin: [0, 0, 0, 0],
              filename: `quotation_${data.quotationNo.replace(/\//g, '_')}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                removeContainer: true,
                foreignObjectRendering: false,
                logging: false,
                width: 794,
                height: 2256, // Height for 2 pages (1123 * 2)
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
              },
              jsPDF: {
                unit: 'px',
                format: [794, 2256], // A4 width, 2 pages height
                orientation: 'portrait'
              },
            })
            .save()
            .then(() => {
              // Restore original form data
              if (quotationData) {
                setForm(originalForm);
              }
            });
        } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Failed to generate PDF. Please try again.");
          // Restore original form data
          if (quotationData) {
            setForm(originalForm);
          }
        }
      }).catch(() => {
        alert("Failed to load images for PDF. Please try again.");
        // Restore original form data
        if (quotationData) {
          setForm(originalForm);
        }
      });
    }
  };

  return (
    <div className="bg-gray-200 p-6">

      {/* 🔧 FORM - Only visible to admins */}
      {!isEmployee && (
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

        <div className="flex gap-4 mt-3">
          <button onClick={() => downloadPDF()} className="bg-black text-white px-4 py-2">
            Download PDF
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Quotation'}
          </button>
        </div>
      </div>
      )}

      {/* 📄 PDF - Always rendered but hidden for employees */}
      <div className={`flex justify-center ${isEmployee ? 'hidden' : ''}`}>
        <div id="pdf-content" className="bg-white">

          {/* ================= PAGE 1 ================= */}
          <div className="w-[794px] h-[1123px] p-10 relative border-2 border-black">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <img src="/mgsolarlogo.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/mgsolarheader.png" alt="header" width={754} height={100} className="w-full"/>
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
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={50} className="w-full"/>
            </div>
          </div>

          {/* Gap between pages */}
          <div className="h-8"></div>

          {/* ================= PAGE 2 ================= */}
          <div className="w-[794px] h-[1123px] p-10 relative border-2 border-black">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <img src="/mgsolarlogo.png" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <img src="/mgsolarheader.png" alt="header" width={754} height={100} className="w-full"/>
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
                (Amount in words: Rupees {numberToWords(parseInt(form.price || '0'))} Only)
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
                <p>Consumer Name: {form.customerName}</p>
                <p>Signature:</p>
              </div>

              <div className="text-right">
                <p>Authorized Signatory</p>
                <p className="font-semibold">M.G. ENTERPRISES</p>
              </div>
            </div>

            {/* FOOTER PAGE 2 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={50} className="w-full"/>
            </div>
          </div>
        </div>
      </div>

      {/* QUOTATIONS TABLE - Visible to both admins and employees */}
      <div className="max-w-7xl mx-auto bg-white p-6 shadow mt-6">
        <h2 className="text-2xl font-bold mb-4">Saved Quotations</h2>

        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {quotations.map((quotation) => (
            <div key={quotation.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{quotation.customerName}</h3>
                  <p className="text-sm text-gray-600">{quotation.quotationNo}</p>
                </div>
                <button
                  onClick={() => downloadPDF(quotation)}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                >
                  Print PDF
                </button>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Mobile:</span> {quotation.mobileNumber}</p>
                <p><span className="font-medium">System:</span> {quotation.kilowatt} KW</p>
                <p><span className="font-medium">Price:</span> ₹{quotation.price}</p>
                <p><span className="font-medium">Date:</span> {new Date(quotation.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation No</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell>{quotation.quotationNo}</TableCell>
                  <TableCell>{quotation.customerName}</TableCell>
                  <TableCell>{quotation.mobileNumber}</TableCell>
                  <TableCell>{quotation.kilowatt} KW</TableCell>
                  <TableCell>₹{quotation.price}</TableCell>
                  <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        downloadPDF(quotation);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Print PDF
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {quotations.length === 0 && (
          <p className="text-center text-gray-500 py-8">No quotations saved yet.</p>
        )}
      </div>
    </div>
  );
}