import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import Select from "react-select";

import { MarkerType } from "../pages/App";

interface AddPintFormProps {
  markers: MarkerType[];
  setMarkers: (markers: MarkerType[]) => void;
  selectedMarker: MarkerType | undefined;
  newPintName: string;
  setNewPintName: (newPintName: string) => void;
  newBarName: string;
  setNewBarName: (newBarName: string) => void;
}

const AddPintForm: React.FC<AddPintFormProps> = ({
  markers,
  setMarkers,
  selectedMarker,
  newPintName,
  setNewPintName,
  newBarName,
  setNewBarName,
}) => {
  const [newPintPrice, setNewPintPrice] = useState<string>("");

  const handleSave = () => {
    // Add the new pint price to the selected marker
    if (selectedMarker) {
      const updatedMarkers = markers.map((marker) =>
        marker.id === selectedMarker.id
          ? {
              ...marker,
              pintPrices: [
                ...marker.pintPrices,
                { name: newPintName, price: parseFloat(newPintPrice) },
              ],
            }
          : marker
      );
      setMarkers(updatedMarkers);
    }

    // Data to be sent in the request body
    const pintData = {
      pintName: newPintName,
      barName: newBarName,
      price: newPintPrice,
    };

    // Fetch data from the API
    fetch("http://localhost:8080/api/pint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pintData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Pint added:", data);
      })
      .catch((error) => {
        console.error("Error adding pint:", error);
      });
  };

  const existingPints = [
    ...new Set(
      markers.flatMap((marker) => marker.pintPrices.map((pint) => pint.name))
    ),
  ];
  const handleSelectChange = (newValue: any, actionMeta: any) => {
    if (actionMeta.action === "create-option") {
      setNewPintName(newValue.value);
    } else {
      setNewPintName(newValue.label);
    }
  };

  const barOptions = markers.map((bar) => ({
    value: bar.name,
    label: bar.name,
  }));

  const pintOptions = existingPints.map((pint) => ({
    value: pint,
    label: pint,
  }));

  return (
    <div className="add-form mt-2">
      <div className="form-group">
        <label htmlFor="barSelect">Bar:</label>
        <Select
          className="form-control"
          options={barOptions}
          onChange={(selectedOption) =>
            setNewBarName(selectedOption ? selectedOption.value : "")
          }
          placeholder="Select a bar"
          value={newBarName ? { value: newBarName, label: newBarName } : null}
        />
      </div>
      <div>
        <label htmlFor="pintSelect">Pint:</label>
        <CreatableSelect
          id="pintSelect"
          onChange={handleSelectChange}
          options={pintOptions}
          className="form-control"
          placeholder="Select or add a new pint"
        />
      </div>
      <div className="form-group">
        <label htmlFor="pintPrice">Enter Pint Price:</label>
        <CurrencyInput
          id="pintPrice"
          name="pintPrice"
          className="form-control"
          value={newPintPrice}
          defaultValue={3}
          decimalsLimit={2}
          allowDecimals={true}
          decimalScale={2}
          prefix="£"
          onValueChange={(value: string | undefined) => {
            console.log("New Pint Price:", value);
            setNewPintPrice(value || "");
          }}
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
