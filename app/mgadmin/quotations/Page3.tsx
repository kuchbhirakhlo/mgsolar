'use client';

import React from 'react';

interface Page3Props {
  subtotal: number;
}

const Page3: React.FC<Page3Props> = ({ subtotal }) => {
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  return (
    <div className="page">
      <h2 className="font-bold mb-4">Cost Summary</h2>

      <div className="border p-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (5%)</span>
          <span>₹{gst}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span>₹{total}</span>
        </div>
      </div>
    </div>
  );
};

export default Page3;