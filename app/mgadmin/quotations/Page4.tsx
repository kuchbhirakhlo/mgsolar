'use client';

import React from 'react';

interface Page4Props {
  panelDetails: string;
  inverterDetails: string;
  structureDetails: string;
}

const Page4: React.FC<Page4Props> = ({
  panelDetails,
  inverterDetails,
  structureDetails,
}) => {
  return (
    <div className="page">
      <h2 className="font-bold mb-4">Itemized Breakdown</h2>

      <p><b>Solar Panels:</b> {panelDetails}</p>
      <p><b>Inverter:</b> {inverterDetails}</p>
      <p><b>Structure:</b> {structureDetails}</p>
    </div>
  );
};

export default Page4;