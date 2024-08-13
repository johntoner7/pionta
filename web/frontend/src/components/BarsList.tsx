import React, { useState } from "react";
import { MarkerType } from "../PintsContext";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItemText,
  Pagination,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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

  return (
    <div>
      <Card
        variant="outlined"
        className="mt-2"
        style={{ marginBottom: "16px", maxHeight: "543px", overflow: "auto" }}
      >
        <CardContent>
          <Autocomplete
            className="mt-1"
            options={markers}
            getOptionLabel={(option) => option.name}
            value={selectedMarker || null}
            onChange={(event, newValue) => {
              setSelectedMarker(newValue ?? undefined);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select a Bar" />
            )}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BarsList;
