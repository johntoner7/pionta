import React, { useState, useEffect, useMemo } from "react";
import { MarkerType, BarDistance } from "../PintsContext";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItemText,
  Pagination,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface FiltersProps {
  markers: MarkerType[];
  selectedMarker: MarkerType | undefined;
  setSelectedMarker: (marker: MarkerType | undefined) => void;
  selectedPint: string | null;
  onPintChange: (selectedOption: { value: string } | null) => void;
  minPrice: number;
  setMinPrice: (newMinPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (newMaxPrice: number) => void;
  maxValue: number;
  walkingDistances: BarDistance[];
  maxDistance: number;
  setMaxDistance: (distance: number) => void;
}

const Filters: React.FC<FiltersProps> = ({
  markers,
  selectedMarker,
  setSelectedMarker,
  selectedPint,
  onPintChange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  maxValue,
  walkingDistances,
  maxDistance,
  setMaxDistance,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = selectedMarker
    ? Math.ceil(selectedMarker.pintPrices.length / itemsPerPage)
    : 0;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = selectedMarker?.pintPrices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDeletePint = async (
    barId: number,
    pintId: number,
    price: number
  ) => {
    try {
      const response = await fetch("http://localhost:8080/api/price", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ barId, pintId, price }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete price");
      }

      alert("Price deleted successfully");
    } catch (error) {
      console.error("Error deleting price:", error);
      alert("Failed to delete price");
    }
  };

  const allPints: string[] = useMemo(() => {
    return markers.reduce((acc: string[], marker) => {
      marker.pintPrices.forEach((pintPrice) => {
        if (!acc.includes(pintPrice.name)) {
          acc.push(pintPrice.name);
        }
      });
      return acc;
    }, []);
  }, [markers]);

  const pintOptions = allPints.map((pintName) => ({
    value: pintName,
    label: pintName,
  }));

  const handlePintChange = (
    event: React.SyntheticEvent,
    value: { value: string } | null
  ) => {
    onPintChange(value);
  };

  const handleSliderChange = (event: Event, values: number | number[]) => {
    const [newMinPrice, newMaxPrice] = values as number[];
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  };

  const handleDistanceChange = (event: Event, value: number | number[]) => {
    setMaxDistance(value as number);
  };

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const distance = walkingDistances.find(
        (distance) => distance.barId === marker.id
      )?.distance;
      return distance !== undefined && distance <= maxDistance;
    });
  }, [markers, walkingDistances, maxDistance]);

  return (
    <Card
      variant="outlined"
      className="mt-2"
      style={{ marginBottom: "16px", maxHeight: "543px", overflow: "auto" }}
    >
      <CardContent>
        <Typography variant="h6">Filters</Typography>
        <Autocomplete
          options={pintOptions}
          getOptionLabel={(option) => option.label}
          onChange={handlePintChange}
          value={
            selectedPint ? { value: selectedPint, label: selectedPint } : null
          }
          renderInput={(params) => <TextField {...params} label="Pint" />}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          clearOnEscape
          className="mt-2"
        />
        <Typography variant="h6" className="mt-2">
          Price Range
        </Typography>
        <Box padding={1}>
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
        <Typography variant="h6" className="mt-2">
          Distance (km)
        </Typography>
        <Box padding={1}>
          <Slider
            value={maxDistance}
            onChange={handleDistanceChange}
            valueLabelDisplay="auto"
            min={0}
            max={20}
            step={0.5}
            valueLabelFormat={(value) => `${value} km`}
          />
        </Box>
        <Typography variant="h6">Price List</Typography>
        <Autocomplete
          className="mt-1"
          options={filteredMarkers}
          getOptionLabel={(option) => option.name}
          value={selectedMarker || null}
          onChange={(event, newValue) => {
            setSelectedMarker(newValue ?? undefined);
          }}
          renderInput={(params) => <TextField {...params} label="Bar" />}
        />
        <List>
          {currentItems?.map((pintPrice, index) => (
            <ListItemText key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: 1 }}>
                  <span>{pintPrice.name}</span>
                </div>
                <span style={{ marginLeft: "auto", marginRight: "16px" }}>
                  £{pintPrice.price.toFixed(2)}
                </span>
                <IconButton
                  onClick={() =>
                    handleDeletePint(
                      selectedMarker?.id || 0,
                      pintPrice.id,
                      pintPrice.price
                    )
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </ListItemText>
          ))}
        </List>
        {currentItems && (
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Filters;
