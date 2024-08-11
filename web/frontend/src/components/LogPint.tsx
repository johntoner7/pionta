import React, { useState, useEffect } from "react";
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
  Autocomplete,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { NumericFormat } from "react-number-format";
import { MarkerType } from "../PintsContext";

interface LogPintFormProps {
  markers: MarkerType[];
  onLogPint: (log: {
    pintName: string;
    barId: number;
    rating?: number;
    description?: string;
    price?: number;
  }) => void;
}

const LogPintForm: React.FC<LogPintFormProps> = ({ markers, onLogPint }) => {
  const [pintName, setPintName] = useState<string>("");
  const [barId, setBarId] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [newPrice, setNewPrice] = useState<number | "">("");

  const allowedPints = markers
    .filter((marker) => marker.id === barId)
    .flatMap((marker) =>
      marker.pintPrices.map((pint) => ({ name: pint.name, price: pint.price }))
    );

  const selectedPint = allowedPints.find((pint) => pint.name === pintName);

  const handleSubmit = (e: React.FormEvent) => {
    console.log(newPrice !== selectedPint?.price && newPrice !== "");
    e.preventDefault();
    if (pintName && barId) {
      onLogPint({
        pintName,
        barId,
        rating: rating || undefined,
        description: description || undefined,
        price:
          newPrice !== selectedPint?.price && newPrice !== ""
            ? newPrice
            : undefined,
      });
    }
  };

  useEffect(() => {
    if (selectedPint?.name) {
      setNewPrice(selectedPint.price);
    }
  }, [selectedPint?.name, selectedPint?.price]);

  return (
    <Card
      variant="outlined"
      style={{ marginBottom: "16px", maxHeight: "553px", overflow: "auto" }}
    >
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
            <Autocomplete
              disabled={barId === ""}
              freeSolo
              options={allowedPints.map((pint) => pint.name)}
              value={pintName}
              onChange={(e: React.ChangeEvent<{}>, value: string | null) =>
                setPintName(value || "")
              }
              renderInput={(params) => <TextField {...params} label="Pint" />}
            />
          </FormControl>
          <Box>
            <NumericFormat
              disabled={pintName === ""}
              value={newPrice}
              thousandSeparator={true}
              prefix={"£"}
              decimalScale={2}
              fixedDecimalScale={true}
              customInput={TextField}
              fullWidth
              margin="normal"
              label="Price"
              isAllowed={(values: { floatValue: number | undefined }) =>
                values.floatValue === undefined || values.floatValue <= 20
              }
              onValueChange={(values: { floatValue: number | undefined }) => {
                setNewPrice(values.floatValue ?? "");
              }}
            />
          </Box>
          <InputLabel id="rating-label">Rating</InputLabel>
          <FormControl fullWidth margin="normal">
            <Slider
              disabled={pintName === ""}
              valueLabelDisplay="auto"
              value={rating || 0}
              onChange={(_, value) =>
                setRating(Array.isArray(value) ? value[0] : value ?? "")
              }
              min={0}
              max={10}
              step={1}
            />
          </FormControl>
          <TextField
            disabled={selectedPint === undefined}
            fullWidth
            margin="normal"
            label="Description (optional)"
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
