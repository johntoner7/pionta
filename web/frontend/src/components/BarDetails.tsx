import React from 'react';

import { MarkerType } from '../pages/App';

interface BarDetailsProps {
  selectedMarker: MarkerType;
}

const BarDetails: React.FC<BarDetailsProps> = ({ selectedMarker }) => (
  <div
    className="selected-marker p-4 mt-2"
    style={{
      backgroundColor: '#0D47A1',
      fontFamily: 'serif',
      color: '#FFFFFF',
      minHeight: '100vh'
    }}
  >
    <h2>{selectedMarker.name}</h2>
    <p>{selectedMarker.description}</p>
    <table className="table" style={{ color: 'white' }}>
      <thead>
        <tr>
          <th style={{ color: '#0D47A1' }}>Pint Name</th>
          <th style={{ color: '#0D47A1' }}>Price (£)</th>
        </tr>
      </thead>
      <tbody>
        {selectedMarker.pintPrices.map((pintPrice, index) => (
          <tr key={index}>
            <td style={{ color: '#0D47A1' }}>{pintPrice.name}</td>
            <td style={{ color: '#0D47A1' }}>£{pintPrice.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BarDetails;
