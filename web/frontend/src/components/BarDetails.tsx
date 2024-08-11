import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItemText,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MarkerType } from "../PintsContext";

interface BarDetailsProps {
  selectedMarker: MarkerType;
}

const BarDetails: React.FC<BarDetailsProps> = ({ selectedMarker }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(selectedMarker.pintPrices.length / itemsPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = selectedMarker.pintPrices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Card
      variant="outlined"
      className="mt-2"
      style={{ marginBottom: "16px", maxHeight: "543px", overflow: "auto" }}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="bar-avatar">
            {selectedMarker.name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={selectedMarker.name}
        subheader={selectedMarker.description}
      />
      <CardContent>
        <List>
          {currentItems.map((pintPrice, index) => (
            <ListItemText key={index}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{pintPrice.name}</span>
                <span>£{pintPrice.price.toFixed(2)}</span>
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
  );
};

export default BarDetails;
