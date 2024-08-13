import React from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { MarkerType } from "../PintsContext";

interface PintFilterProps {
  selectedPint: string | null;
  onChange: (selectedOption: { value: string } | null) => void;
  markers: MarkerType[];
}

const PintFilter: React.FC<PintFilterProps> = ({
  selectedPint,
  onChange,
  markers,
}) => {
  const allPints: string[] = markers.reduce((acc: string[], marker) => {
    marker.pintPrices.forEach((pintPrice) => {
      if (!acc.includes(pintPrice.name)) {
        acc.push(pintPrice.name);
      }
    });
    return acc;
  }, []);

  const options = allPints.map((pintName) => ({
    value: pintName,
    label: pintName,
  }));

  const handleChange = (
    event: React.SyntheticEvent,
    value: { value: string } | null
  ) => {
    onChange(value);
  };

  return (
    <div>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={handleChange}
        value={
          selectedPint ? { value: selectedPint, label: selectedPint } : null
        }
        renderInput={(params) => (
          <TextField {...params} label="Filter By Pint" />
        )}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        clearOnEscape
        className="mt-2"
      />
    </div>
  );
};

export default PintFilter;
