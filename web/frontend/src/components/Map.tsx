import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { MarkerType } from "../PintsContext";
import { Box, Typography } from "@mui/material";

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

  return (
    <Map
      mapboxAccessToken="pk.eyJ1Ijoiam9obm1hcGJveDIwMjQiLCJhIjoiY2x1YnMyZmtrMGdjaTJrcDkweWRremgxNyJ9.WHBMuZJ2qyp_6uANSpk3Ug"
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
  );
};

export default MapComponent;
