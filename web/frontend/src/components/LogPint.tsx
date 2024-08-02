import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { MarkerType, PintPrice } from "../pages/App";

interface LogPintFormProps {
  markers: MarkerType[];
  onLogPint: (log: {
    pintName: string;
    barId: number;
    rating?: number;
    description?: string;
  }) => void;
}

const LogPintForm: React.FC<LogPintFormProps> = ({ markers, onLogPint }) => {
  const [pintName, setPintName] = useState<string>("");
  const [barId, setBarId] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [allowedPints, setAllowedPints] = useState<string[]>([
    ...new Set(
      markers.flatMap((marker) =>
        marker.pintPrices.map((pint: PintPrice) => pint.name)
      )
    ),
  ]);

  useEffect(() => {
    if (barId) {
      setAllowedPints(
        markers.filter((m) => m.id === barId)[0].pintPrices.map((p) => p.name)
      );
    }
  }, [barId, markers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pintName && barId) {
      onLogPint({
        pintName,
        barId,
        rating: rating || undefined,
        description: description || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormControl fullWidth margin="normal">
        <InputLabel id="bar-label">Bar</InputLabel>
        <Select
          label="Bar"
          labelId="bar-label"
          value={barId}
          onChange={(e) => setBarId(e.target.value as number)}
        >
          {markers.map((bar) => (
            <MenuItem key={bar.id} value={bar.id}>
              {bar.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        freeSolo
        options={allowedPints}
        value={pintName}
        onChange={(event, newValue) => setPintName(newValue ?? "")}
        renderInput={(params) => (
          <TextField {...params} label="Pint" variant="outlined" />
        )}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Rating (optional)"
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description (optional)"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" variant="contained" color="primary">
        Log Pint
      </Button>
    </form>
  );
};

export default LogPintForm;
