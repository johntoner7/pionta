import React from "react";
import { Card, ListGroup } from "react-bootstrap";
import { MarkerType } from "../pages/App";

interface BarDetailsProps {
  selectedMarker: MarkerType;
}

const BarDetails: React.FC<BarDetailsProps> = ({ selectedMarker }) => (
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
        {selectedMarker.pintPrices.map((pintPrice, index) => (
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
    </Card.Body>
  </Card>
);

export default BarDetails;
