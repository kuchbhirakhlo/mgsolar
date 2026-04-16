'use client';

import React, { useState } from 'react';
import { QuotationData } from './types';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import Page8 from './Page8';
import Page9 from './Page9';

interface FullQuotationProps {
  initialData?: Partial<QuotationData>;
}

const FullQuotation: React.FC<FullQuotationProps> = ({ initialData }) => {
  const [data, setData] = useState<QuotationData>({
    serialNumber: initialData?.serialNumber || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    clientName: initialData?.clientName || '',
    projectAddress: initialData?.projectAddress || '',
    contactInfo: initialData?.contactInfo || '',
    capacityKW: initialData?.capacityKW || 5,
    systemType: initialData?.systemType || 'Hybrid',
    items: initialData?.items || [],
    subtotal: initialData?.subtotal || 0,
    panelDetails: initialData?.panelDetails || '',
    inverterDetails: initialData?.inverterDetails || '',
    structureDetails: initialData?.structureDetails || '',
    area: initialData?.area || '',
    load: initialData?.load || '',
    battery: initialData?.battery || '',
  });

  const handleChange = (field: keyof QuotationData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const exportToPDF = async () => {
    try {
      // Try html2pdf.js first
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-content');
      if (!element) {
        alert('PDF content not found. Please try again.');
        return;
      }

      const opt = {
        margin: 0.5,
        filename: `quotation-${data.serialNumber || 'draft'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      alert('PDF exported successfully!');
    } catch (error) {
      console.error('PDF export failed:', error);

      // Fallback: Use browser print
      const element = document.getElementById('pdf-content');
      if (element) {
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Quotation - ${data.serialNumber || 'Draft'}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 20px; }
                  .page { page-break-after: always; margin-bottom: 20px; }
                  table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                  th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                  th { background-color: #f5f5f5; }
                  @media print {
                    body { margin: 0; }
                    .page { margin-bottom: 0; }
                  }
                </style>
              </head>
              <body>
                ${element.innerHTML}
                <script>
                  window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 1000);
                  }
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } else {
        alert('PDF export requires html2pdf.js. Please run:\nnpm install html2pdf.js\n\nThen refresh the page and try again.');
      }
    }
  };

  return (
    <div className="min-h-full bg-gray-100 py-4 px-6 overflow-auto">
      <div className="w-full mb-6 flex justify-end pr-4">
        <button
          onClick={exportToPDF}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
        >
          Export to PDF
        </button>
      </div>

      <div id="pdf-content" className="bg-white shadow-xl w-full rounded-lg">
        <Page1
          serialNumber={data.serialNumber}
          date={data.date}
          clientName={data.clientName}
          projectAddress={data.projectAddress}
          contactInfo={data.contactInfo}
          capacityKW={data.capacityKW}
          systemType={data.systemType}
        />
        <Page2 items={data.items} />
        <Page3 subtotal={data.subtotal} />
        <Page4
          panelDetails={data.panelDetails}
          inverterDetails={data.inverterDetails}
          structureDetails={data.structureDetails}
        />
        <Page5 />
        <Page6 />
        <Page7 />
        <Page8
          area={data.area}
          load={data.load}
          battery={data.battery}
        />
        <Page9 />
      </div>
    </div>
  );
};

export default FullQuotation;