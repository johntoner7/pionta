import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from "@mui/material";

const AddBar: React.FC = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");

  const handleAddBar = async (event: React.FormEvent) => {
    event?.preventDefault();
    // Add your logic here to handle adding a new bar
    try {
      await fetch("http://localhost:8080/api/bar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          latitude: latitude,
          longitude: longitude,
          description: description,
        }),
      });
      alert("Pint logged successfully");
    } catch (error) {
      console.error("Error logging pint:", error);
      alert(error);
    }
  };

  return (
    <Card
      variant="outlined"
      style={{ marginBottom: "16px", height: "553px", overflow: "auto" }}
    >
      <CardHeader
        avatar={<Avatar aria-label="user-avatar">JT</Avatar>}
        title="New Bar"
        subheader="Add a new bar"
      />
      <CardContent>
        <form onSubmit={handleAddBar} className="form-container">
          <TextField
            fullWidth
            margin="normal"
            label="Bar Name"
            rows={4}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            type="number"
            fullWidth
            margin="normal"
            label="Latitude"
            rows={4}
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
          />
          <TextField
            type="number"
            fullWidth
            margin="normal"
            label="Longitude"
            rows={4}
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
          />
          <TextField
            type="text"
            fullWidth
            margin="normal"
            label="Description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add Bar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBar;
