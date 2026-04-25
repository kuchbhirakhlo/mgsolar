"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import QuotationPDF from '@/components/QuotationPDF';

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
  const abortControllerRef = useRef<AbortController | null>(null);

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

        // Compute next quotation number
        let nextNumber = 201;
        if (filteredQuotations.length > 0) {
          const numbers = filteredQuotations.map(q => {
            const match = q.quotationNo.match(/^MGE(\d+)$/);
            return match ? parseInt(match[1]) : 200;
          });
          const maxNumber = Math.max(...numbers);
          nextNumber = maxNumber + 1;
        }

        const today = new Date();
        const dateStr = today.toLocaleDateString('en-GB'); // DD/MM/YYYY
        const quotationNo = `MGE${nextNumber}`;
        setForm(prev => ({ ...prev, date: dateStr, quotationNo }));
      });
    };

    loadQuotations().catch(console.error);

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      try {
        // Build URL with employee ID if user is an employee
        const url = employeeData
          ? `/api/customers/${form.mobileNumber}?employeeId=${employeeData.empId}`
          : `/api/customers/${form.mobileNumber}`;

        const response = await fetch(url, { signal: abortControllerRef.current.signal });
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
      // Check if quotation already exists for this mobile number
      const normalizedMobile = form.mobileNumber.replace(/\D/g, '');
      const existingQuotation = await getDocs(query(collection(db, 'quotations'), where('mobileNumber', '==', normalizedMobile)));
      if (!existingQuotation.empty) {
        throw new Error('A quotation already exists for this mobile number.');
      }

      const quotationData = {
        ...form,
        mobileNumber: form.mobileNumber.replace(/\D/g, ''),
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

  const printQuotation = (quotationData?: Quotation) => {
    const element = document.getElementById("pdf-content");

    if (!element) {
      alert("Print content not found");
      return;
    }

    // Temporarily update the form data if using quotation data
    const originalForm = { ...form };
    if (quotationData) {
      setForm(quotationData);
      // Wait for state update
      setTimeout(() => performPrint(element), 100);
      return;
    }

    performPrint(element);

    function performPrint(printElement: HTMLElement) {
      const originalDisplay = printElement.style.display;
      printElement.style.display = 'block';

      // Clone the element to avoid modifying the original
      const clonedElement = printElement.cloneNode(true) as HTMLElement;

      // Add print CSS
      const styleOverride = document.createElement('style');
      styleOverride.textContent = `
        @media print {
          * {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #000000 !important;
            font-family: Arial, sans-serif !important;
            page-break-inside: avoid !important;
          }
          p {
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1.4 !important;
          }
          .watermark {
            display: block !important;
          }
          .watermark img {
            opacity: 0.3 !important;
          }
          @page { size: A4; margin: 0; }
        }
      `;
      clonedElement.insertBefore(styleOverride, clonedElement.firstChild);

      // Open a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        alert('Unable to open print window. Please allow popups and try again.');
        printElement.style.display = originalDisplay;
        return;
      }

      // Write the print content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quotation Print</title>
          </head>
          <body>
            ${clonedElement.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      // Restore original display
      printElement.style.display = originalDisplay;

      // Restore original form data
      if (quotationData) {
        setForm(originalForm);
      }
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
          <button onClick={() => printQuotation()} className="bg-black text-white px-4 py-2">
            Print
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Quotation'}
          </button>
        </div>
      </div>
      )}

      {/* 📄 PDF - Always rendered but hidden for employees */}
      <div className={`flex justify-center ${isEmployee ? 'hidden' : ''}`}>
        <QuotationPDF form={form} isEmployee={isEmployee} />
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
                  onClick={() => printQuotation(quotation)}
                  className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
                >
                  Print
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
                        printQuotation(quotation);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Print
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