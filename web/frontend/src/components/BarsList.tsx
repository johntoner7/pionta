import React from "react";
import { MarkerType } from "../PintsContext";
import { Autocomplete, TextField, Typography } from "@mui/material";

interface BarsListProps {
  markers: MarkerType[];
  selectedMarker: MarkerType | undefined;
  setSelectedMarker: (marker: MarkerType | undefined) => void;
}

const BarsList: React.FC<BarsListProps> = ({
  markers,
  selectedMarker,
  setSelectedMarker,
}) => {
  return (
    <div>
      <Typography variant="h6">Filter by Bar:</Typography>
      <Autocomplete
        className="mt-1"
        options={markers}
        getOptionLabel={(option) => option.name}
        value={selectedMarker || null}
        onChange={(event, newValue) => {
          setSelectedMarker(newValue ?? undefined);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a Bar"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
          />
        )}
      />
    </div>
  );
};

export default BarsList;
