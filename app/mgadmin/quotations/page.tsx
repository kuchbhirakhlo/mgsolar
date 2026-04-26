"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
            opacity: 0.1 !important;
          }
          @page { size: A4; margin: 0; }
        }
      `;
      clonedElement.insertBefore(styleOverride, clonedElement.firstChild);

      // Store original body content
      const originalBody = document.body.innerHTML;

      // Replace body with print content
      document.body.innerHTML = clonedElement.outerHTML;

      // Print
      window.print();

      // Restore original body
      document.body.innerHTML = originalBody;

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
        <div id="pdf-content" className="bg-white">

          {/* ================= PAGE 1 ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10">
              <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* Quotation Number */}
            <div className="absolute top-6 right-6 text-sm font-bold z-20">
              Quotation No: {form.quotationNo}
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
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 2 ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

             {/* Header Image */}
             <div className="relative z-10 mb-6">
               <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
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
            <div className="flex gap-4">
              <div className="flex-1 text-sm">
                <h2 className="font-semibold">TERMS & CONDITIONS</h2>
                <p>Validity of quotation: 15 days</p>
                <p>Installation Timeline: 15–25 Working Days</p>
                <p>Net metering subject to DISCOM approval.</p>
                <p>System generation depends on sunlight & site conditions.</p>
                <p>Payment Terms: 70% Advance, 20% Before Installation, 10% After Commissioning</p>
                <p>Operation & maintenance charges are not included in this price.</p>
              </div>

              <div className="flex-1 text-sm border border-gray-300 p-2 bg-gray-50">
                <h2 className="font-bold">Company Bank Details</h2>
                <p>Bank Name: Punjab National Bank</p>
                <p>Account No.: 6193002100003379</p>
                <p>IFSC: PUNB0619300</p>
                <p>Branch: Vibhuti Khand, Gomti Nagar, Lucknow</p>
              </div>
            </div>

            {/* DECLARATION */}
            <div className="mt-6 text-sm">
              <h2 className="font-semibold">DECLARATION</h2>
              <p>We hereby declare that the above quotation is true and correct.</p>
              <p>All materials supplied will be new and of standard quality.</p>
              <p>Installation will be carried out as per site conditions and applicable norms.</p>
              <p>Warranties shall be as per manufacturer terms.</p>
              <p>Prices and approvals are subject to applicable rules and regulations.</p>
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
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {!isEmployee && (
          <>
          {/* ================= PAGE 3 - ANNEXURE 2 ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* ANNEXURE 2 TITLE */}
            <div className="text-center text-sm font-bold mb-4">
              ANNEXURE 2
            </div>

            {/* AGREEMENT TITLE */}
            <div className="text-center text-sm font-semibold mb-4">
              Model Draft Agreement between Consumer & Vendor for installation of grid connected rooftop solar (RTS) project under PM – Surya Ghar: Muft Bijli Yojana
            </div>

            {/* AGREEMENT CONTENT */}
            <div className="text-sm space-y-2">
              <p>This agreement is executed on {form.date} for design, supply, installation, commissioning and 5-year comprehensive maintenance of RTS project/system along with warranty under PM Surya Ghar: Muft Bijli Yojana.</p>

              <p><strong>Between</strong></p>
              <p>{form.customerName} address {form.address}, (hereinafter referred to as first Party i.e.)</p>

              <p><strong>And</strong></p>
              <p>M.G. ENTERPRISES having registered office at D - 62, 2nd Floor Vibhuti khand gomti nagar, Lucknow U.P. 226010, Phone :- +91- 8736915465, 9415336145.</p>

              <p><strong>Whereas</strong></p>
              <p>First Party wishes to installation Grid Connected Rooftop Solar Plant on the rooftop of the residential building of the Consumer under PM Surya Ghar: Muft Bijli Yojana.</p>

              <p><strong>And whereas</strong></p>
              <p>Second Party has verified availability of appropriate roof and found it feasible to install a Grid Connected Roof Top Solar plant and that the second party is willing to design, supply, install, test, commission and carry out Operation & Maintenance of the Rooftop Solar plant for 5 year period On this day, the First Party and Second Party agree to the following:</p>

              <p><strong>The First Party here by undertakes to perform the following activities:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Submission of online application at National Portal for installation of RTS project/system, Submission of application for net-metering and system inspection and upload of the relevant documents on the National Portal of the scheme.</li>
                <li>Provide secure storage of the material of the RTS plant delivered at the premises till handover of the system.</li>
                <li>Provide access to the Roof Top during installation of the plant, operation & maintenance, testing of the plant and equipment and for meter reading from solar meter, inverter etc.</li>
                <li>Provide electricity during plant installation and water for cleaning of the panels.</li>
                <li>Report any malfunctioning of the plant to the Vendor during the warranty period.</li>
                <li>Pay the amount as per the payment schedule as mutually agreed with the vendor, including any additional amount to the second party for any additional work</li>
              </ol>
            </div>

            {/* FOOTER PAGE 3 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 4 - ANNEXURE 2 CONTINUATION ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT CONTINUATION */}
            <div className="text-sm space-y-2">
              <p>/customization required depending upon the building condition</p>

              <p><strong>The Second Party hereby undertakes to perform the following activities:</strong></p>

              <ol className="list-decimal list-inside space-y-2">
                <li>The Vendor must follow all the standards and safety guidelines prescribed under state regulations and technical standards prescribed by MNRE for RTS projects, failing which the vendor is liable for blacklisting from participation in the govt. project/ scheme and other penal actions in accordance with the law. The responsibility of supply, installation and commissioning of the rooftop solar project/system in complete compliance with MNRE scheme guidelines lies with the Vendor.</li>
                <li>Site Survey: Site visit, survey and development of detailed project report for installation of RTS system. This also includes, feasibility study of roof, strength of roof and shadow free area. If any additional work or customization is involved for the plant installation as per site condition and requirement of the consumer building, the Vendor shall prepare an estimate and can raise separate invoice including GST in addition to the amount towards standard plant cost. The consumer shall pay the amount for such additional work directly to the Vendor.</li>
                <li>Design & Engineering: Design of plant along with drawings and selection of components as per standard provided by the DISCOM/SERC/MNRE for best performance and safety of the plant.</li>
                <li>Module and Inverter: The solar modules, including the solar cells, should be manufactured in India. Both the solar modules and inverters shall conform to the relevant standards and specifications prescribed by MNRE. Any other requirement, viz. star labeling (solar modules), quality control orders and standards & labeling (inverters) etc., shall also be complied.</li>
                <li>Procurement & Supply: Procurement of complete system as per BIS/IS/IEC standard (whatever applicable) & safety guidelines for installation of rooftop solar plants. The supplied materials should comply with all MNRE standards for release of subsidy.</li>
                <li>Installation & Civil work: Complete civil work, structure work and electrical work (including drawings) following all the safety and relevant BIS standards.</li>
                <li>Documentation (Technical Catalogues/Warranty Certificates/BIS certificates/other test reports etc): All such documents shall be provided to the consumer for online uploading and submission of technical specifications, IEC/BIS report, Sr. Nos, Warranty card of Solar Panel & Inverter, Layout & Electrical SLD, Structure Design and Drawing,</li>
              </ol>
            </div>

            {/* FOOTER PAGE 4 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 5 - ANNEXURE 2 CONTINUATION ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT CONTINUATION */}
            <div className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1" start={7}>
                <li>Cable and other detailed documents.</li>
                <li>Project completion report (PCR): Assisting the consumer in filling and uploading of signed documents (Consumer & Vendor) on the national portal.</li>
                <li>Warranty: System warranty certificates should be provided to the consumer. The complete system should be warranted for 5 years from the date of commissioning by DISCOM. Individual component warranty documents provided by the manufacturer shall be provided to the consumer and all possible assistance should be extended to the consumer for claiming the warranty from the manufacturer.</li>
                <li>NET meter & Grid Connectivity: Net meter supply/procurement, testing and approvals shall be in the scope of vendor. Grid connection of the plant shall be in the scope of the vendor.</li>
                <li>Testing and Commissioning: The vendor shall be present at the time of testing and commissioning by the DISCOM. Operation & Maintenance: Five (5) years Comprehensive Operation and Maintenance including overhauling, wear and tear and regular checking of healthiness of system at proper interval shall be in the scope of vendor. The vendor shall also educate the consumer on best practices for cleaning of the modules and system maintenance.</li>
                <li>Insurance: Any insurance cost pertaining to material transfer/storage before commissioning of the system shall be in the scope of the vendor.</li>
                <li>Applicable Standard: The system must meet the technical standards and specifications notified by MNRE. The vendor is solely responsible to supply component and service which meets the technical standards and specification prescribed by MNRE and State DISCOMs.</li>
                <li>Project/system cost & payment terms: The cost of the plant and payment schedule should be mutually discussed and decided between the vendor and consumer. The consumer may opt for milestone-based payment to the vendor and the same shall be included in the agreement</li>
                <li>Dispute: In-case of any dispute between consumer and vendor (in supply/installation/maintenance of system or payment terms), both parties must settle the same mutually or as per law. MNRE/DISCOM shall not be liable for, and would not be a party to any dispute arising between vendor and consumer.</li>
                <li>Subsidy / Project Related Documents: Vendor must provide all the documents to consumer and help in uploading the same to National Portal for smooth release of subsidy.</li>
              </ol>
            </div>

            {/* FOOTER PAGE 5 */}
            <div className="absolute bottom-6 left-10 right-10">
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>

          {/* ================= PAGE 6 - ANNEXURE 2 CONTINUATION ================= */}
          <div className="w-[794px] h-[1123px] p-6 relative">

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 watermark">
              <img src="/mgsolarlogo.jpeg" alt="logo" width={400} height={400}/>
            </div>

            {/* Header Image */}
            <div className="relative z-10 mb-6">
              <img src="/mgsolarheader.png" alt="header" width={754} height={50} className="w-full"/>
            </div>

            {/* AGREEMENT CONTENT CONTINUATION */}
            <div className="text-sm space-y-2">
              <ol className="list-decimal list-inside space-y-1" start={11}>
                <li>Performance of Plant: The Performance Ratio (PR) of Plant must be 75% at the time of commissioning of the project by DISCOM or its authorized agency. Vendor must provide (returnable basis) radiation sensor with valid calibration certificate of any NABL/International laboratory at the time of commissioning/testing of the plant. Vendor must maintain the PR of the plant till warranty of project i.e. 5 years from the date of commissioning.</li>
              </ol>

              <h2 className="text-blue-600 font-semibold">19. Mutually Agreed Terms of Pay</h2>

              <p>Total system cost: ₹ {form.price}/- (to be filled based on invoice)</p>
              <p>Payment Schedule: 100% advance payment before installation.</p>

              <div className="flex justify-between mt-4">
                <div className="text-center">
                  <p><strong>First Party</strong></p>
                  <p>{form.customerName}</p>
                  <p className="mt-4">Sign:</p>
                  <p>___________________________</p>
                </div>
                <div className="text-center">
                  <p><strong>Second Party</strong></p>
                  <p>M.G. ENTERPRISES</p>
                  <p className="mt-4">Sign:</p>
                  <p>___________________________</p>
                </div>
              </div>
            </div>

            {/* FOOTER PAGE 6 */}
            <div className="absolute bottom-4 left-10 right-10">
              <img src="/mgsolarfooter.png" alt="footer" width={754} height={20} className="w-full"/>
            </div>
          </div>
          </>
          )}
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