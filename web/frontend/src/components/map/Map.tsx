import React, { useContext, useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { PintsContext } from "../../PintsContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import mapboxSdk from "@mapbox/mapbox-sdk";
import directions from "@mapbox/mapbox-sdk/services/directions";
import { FaBeer } from "react-icons/fa";
import { Bar } from "../../../../../shared/types/bar";
import styles from "./Map.module.scss";

const MapComponent: React.FC = () => {
  const context = useContext(PintsContext);

  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<Bar | undefined>(
    undefined
  );

  useEffect(() => {
    getMapboxToken();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (
      mapboxAccessToken &&
      userLocation &&
      context &&
      context?.bars?.length > 0
    ) {
      const mapboxClient = mapboxSdk({ accessToken: mapboxAccessToken });
      const directionsClient = directions(mapboxClient);

      const fetchDistances = async () => {
        const distances = await Promise.all(
          context.bars.map(async (bar) => {
            const response = await directionsClient
              .getDirections({
                profile: "walking",
                waypoints: [
                  {
                    coordinates: [
                      userLocation.longitude,
                      userLocation.latitude,
                    ],
                  },
                  {
                    coordinates: [
                      parseFloat(bar.longitude.toString()),
                      parseFloat(bar.latitude.toString()),
                    ],
                  },
                ],
              })
              .send();

            const distance = response.body.routes[0].distance / 1000;
            return { barId: bar.id, distance: distance };
          })
        );
        context?.setWalkingDistances(distances);
      };

      fetchDistances();
    }
  }, [mapboxAccessToken, userLocation, context?.bars]);

  if (!context) {
    return null;
  }

  const { filteredBarList, getPintPrice, setActiveTab, setSelectedBar } =
    context;

  const handleMarkerHover = (marker: Bar) => {
    setHoveredMarker(marker);
  };

  const handleMarkerLeave = () => {
    setHoveredMarker(undefined);
  };

  const handleMarkerClick = (marker: Bar) => {
    setActiveTab("filter");
    setSelectedBar(marker);
  };

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
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving mapbox access token:", error);
      alert("Failed to retrieve mapbox access token");
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Failed to get user location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : mapboxAccessToken ? (
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: userLocation ? userLocation.longitude : -5.93804,
            latitude: userLocation ? userLocation.latitude : 54.58567,
            zoom: 14,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="center"
            >
              <LocationOnIcon className={styles.userLocation} />
            </Marker>
          )}
          {filteredBarList.map((marker) => (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="center"
              onClick={() => handleMarkerClick(marker)}
            >
              <div
                className="marker-content text-black"
                onMouseEnter={() => handleMarkerHover(marker)}
                onMouseLeave={() => handleMarkerLeave()}
              >
                {getPintPrice(marker) !== "" ? (
                  <div className="marker-price">£{getPintPrice(marker)}</div>
                ) : (
                  <div className="marker-price">
                    <FaBeer size={16} />
                  </div>
                )}
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
