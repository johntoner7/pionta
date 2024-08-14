import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { MarkerType } from "../PintsContext";
import { Box, CircularProgress, Typography } from "@mui/material";

interface MapComponentProps {
  filteredMarkerList: MarkerType[];
  getPintPrice: (marker: MarkerType) => string;
  setActiveTab: (tab: string) => void;
  setSelectedMarker: (marker: MarkerType) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  filteredMarkerList,
  getPintPrice,
  setActiveTab,
  setSelectedMarker,
}) => {
  const [hoveredMarker, setHoveredMarker] = useState<MarkerType>();
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const handleMarkerHover = (marker: MarkerType) => {
    setHoveredMarker(marker);
  };

  const handleMarkerLeave = () => {
    setHoveredMarker(undefined);
  };

  const handleMarkerClick = (marker: MarkerType) => {
    setActiveTab("barDetails");
    setSelectedMarker(marker);
  };

  useEffect(() => {
    getMapboxToken();
  }, []);

  const getMapboxToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/mapbox", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to retrieve mapbox access token");
      }
      const data = await response.json();
      setMapboxAccessToken(data);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving mapbox access token:", error);
      alert("Failed to retrieve mapbox access token");
    }
  };

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="600px"
        >
          <CircularProgress />
        </Box>
      ) : mapboxAccessToken ? (
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: -5.93804,
            latitude: 54.58567,
            zoom: 14,
          }}
          style={{ width: "100%", height: "600px" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {filteredMarkerList.map((marker) => (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="center"
              onClick={() => handleMarkerClick(marker)}
            >
              <div
                className="marker-content"
                onMouseEnter={() => handleMarkerHover(marker)}
                onMouseLeave={() => handleMarkerLeave()}
                style={{ color: "black" }}
              >
                <div className="marker-price">£{getPintPrice(marker)}</div>
              </div>
            </Marker>
          ))}
          {hoveredMarker && (
            <Popup
              longitude={hoveredMarker.longitude}
              latitude={hoveredMarker.latitude}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
            >
              <Box>
                <Typography color="black" variant="h6">
                  {hoveredMarker.name}
                </Typography>
              </Box>
            </Popup>
          )}
        </Map>
      ) : (
        <Typography variant="body1">
          Failed to retrieve mapbox access token
        </Typography>
      )}
    </>
  );
};

export default MapComponent;
