import React, { useContext, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";
import styles from "./AddBar.module.scss";
import { PintsContext } from "../../PintsContext";

const AddBar: React.FC = () => {
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>();

  const context = useContext(PintsContext);

  const getMapboxToken = async () => {
    try {
      const response = await fetch("https://pionta.onrender.com/api/mapbox", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve mapbox access token");
      }
      const data = await response.json();
      setMapboxAccessToken(data);
    } catch (error) {
      context?.setError("Failed to retrieve mapbox access token");
    }
  };

  useEffect(() => {
    getMapboxToken();
  }, []);

  const handleAddBar = async (event: React.FormEvent) => {
    event?.preventDefault();
    try {
      await fetch("https://pionta.onrender.com/api/bar", {
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
      context?.setSuccess("The new bar was added successfully.");
    } catch (error) {
      context?.setError("Failed to add new bar.");
    }
  };

  const handleSelectResult = (result: any) => {
    const [name] = result.place_name.split(",");
    const { coordinates } = result.geometry;
    setName(name);
    setLongitude(coordinates[0]);
    setLatitude(coordinates[1]);
  };

  const handleAddressLookup = async () => {
    if (!mapboxAccessToken) return;

    const mapboxClient = mapboxSdk({ accessToken: mapboxAccessToken });
    const geocodingClient = geocoding(mapboxClient);

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: address,
          limit: 5,
          countries: ["gb"],
          types: ["place", "address", "poi"],
          bbox: [-8.199, 54.074, -5.431, 55.378],
        })
        .send();

      setSearchResults(response.body.features);
    } catch (error) {
      context?.setError("Failed to perform address lookup.");
    }
  };

  return (
    <Card variant="outlined" className={styles.card}>
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
            label="Enter bar name or address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddressLookup}
            className="mb-2 text-white"
          >
            Search
          </Button>
          <List>
            {searchResults.map((result, index) => (
              <ListItem
                key={index}
                button
                onClick={() => {
                  handleSelectResult(result);
                }}
              >
                <ListItemText primary={result.place_name} />
              </ListItem>
            ))}
          </List>
          <Button
            className="mb-2 text-white"
            type="submit"
            variant="contained"
            color="primary"
            disabled={!(latitude && longitude)}
          >
            Add Bar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBar;
