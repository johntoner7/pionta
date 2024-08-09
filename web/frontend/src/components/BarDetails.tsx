import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { MarkerType } from "../PintsContext";

interface BarDetailsProps {
  selectedMarker: MarkerType;
}

const BarDetails: React.FC<BarDetailsProps> = ({ selectedMarker }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
      className="mt-2"
      style={{ backgroundColor: "#E3F2FD", color: "#0D47A1" }}
    >
      <Card.Body>
        <Card.Title style={{ fontFamily: "serif" }}>
          {selectedMarker.name}
        </Card.Title>
        <Card.Text style={{ fontFamily: "serif" }}>
          {selectedMarker.description}
        </Card.Text>
        <ListGroup variant="flush">
          {currentItems.map((pintPrice, index) => (
            <ListGroup.Item
              key={index}
              style={{ backgroundColor: "#E3F2FD", color: "#0D47A1" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{pintPrice.name}</span>
                <span>£{pintPrice.price.toFixed(2)}</span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div
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
        </div>
      </Card.Body>
    </Card>
  );
};

export default BarDetails;
