'use client';

import React from 'react';

const Page9: React.FC = () => {
  return (
    <div className="page">
      <h2 className="font-bold mb-4">Payment Terms</h2>

      <ul className="list-disc pl-5">
        <li>70% Advance</li>
        <li>20% After Installation</li>
        <li>10% Final</li>
      </ul>

      <h3 className="mt-6 font-bold">Bank Details</h3>
      <p>Punjab National Bank</p>
      <p>A/C: 6193002100003379</p>

      <div className="mt-6 text-center">
        <p>Contact: +91-8736915465</p>
        <p>Thank You</p>
      </div>
    </div>
  );
};

export default Page9;