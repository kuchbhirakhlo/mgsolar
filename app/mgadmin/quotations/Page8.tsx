'use client';

import React from 'react';

interface Page8Props {
  area: string;
  load: string;
  battery: string;
}

const Page8: React.FC<Page8Props> = ({ area, load, battery }) => {
  return (
    <div className="page">
      <h2 className="font-bold mb-4">Technical Details</h2>

      <p><b>Area Required:</b> {area}</p>
      <p><b>Load Capacity:</b> {load}</p>
      <p><b>Battery:</b> {battery}</p>
    </div>
  );
};

export default Page8;