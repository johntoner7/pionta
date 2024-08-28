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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PintPrice from "../../../../shared/types/pintPrice";
import { Bar } from "../../../../shared/types/bar";

interface LogPintFormProps {
  bars: Bar[];
  onLogPint: (log: {
    pintName: string;
    barId: number;
    rating?: number;
    description?: string;
  }) => void;
}

const LogPintForm: React.FC<LogPintFormProps> = ({ bars, onLogPint }) => {
  const [pintName, setPintName] = useState<string>("");
  const [barId, setBarId] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [allowedPints, setAllowedPints] = useState<string[]>([
    ...new Set(
      bars.flatMap((bar) => bar.pintPrices.map((pint: PintPrice) => pint.name))
    ),
  ]);

  useEffect(() => {
    if (barId) {
      setAllowedPints(
        bars.filter((m) => m.id === barId)[0].pintPrices.map((p) => p.name)
      );
    }
  }, [barId, bars]);

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
    <Card variant="outlined">
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
            >
              {bars.map((bar) => (
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
      </CardContent>
    </Card>
  );
};

export default LogPintForm;
