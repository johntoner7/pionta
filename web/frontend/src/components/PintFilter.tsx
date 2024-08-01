import React from 'react';
import { MarkerType } from '../pages/App';

interface PintFilterProps {
  selectedPint: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  markers: MarkerType[];
}

const PintFilter: React.FC<PintFilterProps> = ({
  selectedPint,
  onChange,
  markers
}) => {
  const allPints: string[] = markers.reduce((acc: string[], marker) => {
    marker.pintPrices.forEach((pintPrice) => {
      if (!acc.includes(pintPrice.name)) {
        acc.push(pintPrice.name);
      }
    });
    return acc;
  }, []);

  return (
    <div className="filter">
      <h4>Filter by Pint:</h4>
      <select onChange={onChange} value={selectedPint ?? ''}>
        <option value="">All</option>
        {allPints.map((pintName) => (
          <option key={pintName} value={pintName}>
            {pintName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PintFilter;
