import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Map, { Marker } from 'react-map-gl';
import ExpandedMap from './ExpandedMap';
import styles from './CompactMap.module.scss';
import { Bar } from '../../../../../shared/types/bar';

interface CompactMapProps {
  selectedPub: Bar | null;
  onPubSelect: (pub: { id: string; name: string }) => void;
  courseHoles: Array<{ pubId: string; pubName: string }>;
  allBars: Bar[];
}

const CompactMap: React.FC<CompactMapProps> = ({ selectedPub, onPubSelect, courseHoles, allBars }) => {
  const [expanded, setExpanded] = useState(false);
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/mapbox", {
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
        console.error("Failed to retrieve mapbox access token:", error);
      }
    };

    getMapboxToken();
  }, []);

  if (loading || !mapboxAccessToken) return null;

  // Default to Belfast city center if no pub is selected
  const defaultViewState = {
    longitude: -5.93804,
    latitude: 54.58567,
    zoom: 13
  };

  // If a pub is selected, center on that pub
  const viewState = selectedPub ? {
    longitude: parseFloat(selectedPub.longitude.toString()),
    latitude: parseFloat(selectedPub.latitude.toString()),
    zoom: 14
  } : defaultViewState;

  return (
    <>
      <Paper 
        className={styles.compactMap}
        elevation={3}
      >
        <Box className={styles.mapContainer}>
          <Map
            mapboxAccessToken={mapboxAccessToken}
            initialViewState={viewState}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {courseHoles.map((hole, index) => {
              // Find the full bar data for this hole
              const bar = allBars.find(b => b.id.toString() === hole.pubId);
              if (!bar) return null;
              
              return (
                <Marker
                  key={hole.pubId}
                  longitude={parseFloat(bar.longitude.toString())}
                  latitude={parseFloat(bar.latitude.toString())}
                  anchor="center"
                >
                  <div className={styles.courseMarker}>
                    {index + 1}
                  </div>
                </Marker>
              );
            })}
          </Map>
        </Box>
        <IconButton
          className={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
          size="small"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Paper>

      {expanded && (
        <ExpandedMap
          selectedPub={selectedPub}
          courseHoles={courseHoles}
          onClose={() => setExpanded(false)}
          onPubSelect={onPubSelect}
        />
      )}
    </>
  );
};

export default CompactMap; 