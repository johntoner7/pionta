import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import mapboxSdk from "@mapbox/mapbox-sdk";
import geocoding from "@mapbox/mapbox-sdk/services/geocoding";

const AddBar: React.FC = () => {
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>(
    "YOUR_MAPBOX_ACCESS_TOKEN"
  );

  const getMapboxToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/mapbox", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve mapbox access token");
      }
      const data = await response.json();
      setMapboxAccessToken(data);
    } catch (error) {
      console.error("Error retrieving mapbox access token:", error);
      alert("Failed to retrieve mapbox access token");
    }
  };

  useEffect(() => {
    getMapboxToken();
  }, []);

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
      console.error("Error performing address lookup:", error);
      alert("Failed to perform address lookup");
    }
  };

  return (
    <Card variant="outlined">
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
            className="mb-2"
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
          {latitude && longitude && (
            <Button type="submit" variant="contained" color="primary">
              Add Bar
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBar;
