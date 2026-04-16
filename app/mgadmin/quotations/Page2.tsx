'use client';

import React from 'react';

interface Item {
  name: string;
  details: string;
  make: string;
  qty: number;
}

interface Page2Props {
  items: Item[];
}

const Page2: React.FC<Page2Props> = ({ items }) => {
  return (
    <div className="page">
      <h2 className="font-bold mb-4">System Overview</h2>

      <table>
        <thead>
          <tr>
            <th>Item / Component</th>
            <th>Details</th>
            <th>Make</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.details}</td>
              <td>{item.make}</td>
              <td>{item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page2;