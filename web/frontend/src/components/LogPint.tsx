import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Slider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
    <Card variant="outlined" style={{ marginBottom: "16px" }}>
      <CardHeader
        avatar={<Avatar aria-label="user-avatar">JT</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="John Toner"
        subheader="Log a new pint"
      />
      <CardContent>
        <form onSubmit={handleSubmit} className="form-container">
          <FormControl fullWidth margin="normal">
            <InputLabel id="bar-label">Bar</InputLabel>
            <Select
              label="Bar"
              labelId="bar-label"
              value={barId}
              onChange={(e) => setBarId(e.target.value as number)}
              style={{ color: "black" }}
            >
              {markers.map((bar) => (
                <MenuItem key={bar.id} value={bar.id}>
                  {bar.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="pint-label">Pint</InputLabel>
            <Select
              label="Pint"
              labelId="pint-label"
              value={pintName}
              onChange={(e) => setPintName(e.target.value as string)}
            >
              {allowedPints.map((pint) => (
                <MenuItem key={pint} value={pint}>
                  {pint}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InputLabel id="rating-label">Rating</InputLabel>
          <FormControl fullWidth margin="normal">
            <Slider
              valueLabelDisplay="auto"
              value={rating || undefined}
              onChange={(_, value) =>
                setRating(Array.isArray(value) ? value[0] : value ?? "")
              }
              min={0}
              max={10}
              step={1}
            />
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Description (optional)"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            disabled={!pintName || !barId}
            type="submit"
            variant="contained"
            color="primary"
          >
            Log Pint
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LogPintForm;
