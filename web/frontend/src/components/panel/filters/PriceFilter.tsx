import React from "react";
import { Slider, Typography, Box } from "@mui/material";

interface PriceFilterProps {
  minPrice: number;
  setMinPrice: (newMinPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (newMaxPrice: number) => void;
  maxValue: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  maxValue,
}) => {
  const handleSliderChange = (event: Event, values: number | number[]) => {
    const [newMinPrice, newMaxPrice] = values as number[];
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };

  return (
    <Box padding={1} className="mt-2">
      <Typography variant="h6">Price Range</Typography>
      <Slider
        value={[minPrice, maxPrice]}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0.0}
        max={maxValue}
        step={0.05}
        valueLabelFormat={(value) => `£${value.toFixed(2)}`}
      />
    </Box>
  );
};

export default PriceFilter;
