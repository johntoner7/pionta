import React from 'react';
import { Button } from 'react-bootstrap';

import { MarkerType } from '../pages/App';

interface AddPintFormProps {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
  selectedMarker: MarkerType | undefined;
  newPintName: string;
  setNewPintName: (newPintName: string) => void;
  newPintPrice: number;
  setNewPintPrice: (newPintPrice: number) => void;
  newBarName: string;
  setNewBarName: (newBarName: string) => void;
}

const AddPintForm: React.FC<AddPintFormProps> = ({
  markers,
  setMarkers,
  selectedMarker,
  newPintName,
  setNewPintName,
  newPintPrice,
  setNewPintPrice,
  newBarName,
  setNewBarName
}) => {
  const handleSave = () => {
    // Add the new pint price to the selected marker
    if (selectedMarker) {
      const updatedMarkers = markers.map((marker) =>
        marker.id === selectedMarker.id
          ? {
              ...marker,
              pintPrices: [
                ...marker.pintPrices,
                { name: newPintName, price: newPintPrice }
              ]
            }
          : marker
      );
      setMarkers(updatedMarkers);
    }

    // Data to be sent in the request body
    const pintData = {
      pintName: newPintName,
      barName: newBarName,
      price: newPintPrice
    };

    // Fetch data from the API
    fetch('http://localhost:8080/api/pint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pintData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Pint added:', data);
      })
      .catch((error) => {
        console.error('Error adding pint:', error);
      });
  };

  return (
    <div className="add-form mt-2">
      <div className="form-group">
        <label htmlFor="barSelect">Bar:</label>
        <select
          id="barSelect"
          className="form-control"
          onChange={(e) => setNewBarName(e.target.value)}
        >
          <div className="d-flex flex-row">
            <Button onClick={handleSave} className="mt-2">
              Save
            </Button>
          </div>
          <option value="">Select a bar</option>
          {markers.map((marker) => (
            <option key={marker.id} value={marker.name}>
              {marker.name}
            </option>
          ))}
        </select>
        <label htmlFor="pintName">Pint:</label>
        <input
          type="text"
          id="pintName"
          value={newPintName}
          onChange={(e) => setNewPintName(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="pintPrice">Enter Pint Price:</label>
        <input
          type="number"
          id="pintPrice"
          className="form-control"
          value={newPintPrice}
          onChange={(e) => setNewPintPrice(parseFloat(e.target.value))}
        />
      </div>
      <div className="d-flex flex-row">
        <Button onClick={handleSave} className="mt-2">
          Save
        </Button>
      </div>
    </div>
  );
};

export default AddPintForm;
