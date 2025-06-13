import React, { useState, useContext, useEffect } from 'react';
import { Box, IconButton, Paper, Typography, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ListIcon from '@mui/icons-material/List';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import { Bar } from '../../../../../shared/types/bar';
import { PintsContext, PintsContextType } from '../../PintsContext';
import styles from './ExpandedMap.module.scss';
import mapboxgl from 'mapbox-gl';
import mapboxSdk from '@mapbox/mapbox-sdk';
import directions from '@mapbox/mapbox-sdk/services/directions';
import { Feature, FeatureCollection, LineString } from 'geojson';

interface ExpandedMapProps {
  selectedPub: Bar | null;
  courseHoles: Array<{ pubId: string; pubName: string }>;
  onClose: () => void;
  onPubSelect: (pub: { id: string; name: string }) => void;
}

const ExpandedMap: React.FC<ExpandedMapProps> = ({
  selectedPub,
  courseHoles,
  onClose,
  onPubSelect
}) => {
  const context = useContext(PintsContext) as PintsContextType;
  const [showPubList, setShowPubList] = useState(false);
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState<FeatureCollection | null>(null);

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

  useEffect(() => {
    const getWalkingRoutes = async () => {
      if (!mapboxAccessToken || !context?.bars) return;

      const mapboxClient = mapboxSdk({ accessToken: mapboxAccessToken });
      const directionsService = directions(mapboxClient);

      const coordinates = courseHoles.map(hole => {
        const pub = context.bars.find((b: Bar) => b.id.toString() === hole.pubId);
        if (!pub) return null;
        return [pub.longitude, pub.latitude] as [number, number];
      }).filter((coord): coord is [number, number] => coord !== null);

      if (coordinates.length < 2) return;

      try {
        const routePromises = [];
        for (let i = 0; i < coordinates.length - 1; i++) {
          const request = directionsService.getDirections({
            profile: 'walking',
            waypoints: [
              { coordinates: coordinates[i] },
              { coordinates: coordinates[i + 1] }
            ],
            alternatives: false,
            geometries: 'geojson'
          });

          routePromises.push(request.send());
        }

        const responses = await Promise.all(routePromises);
        const routes = responses.map(response => response.body.routes[0].geometry);

        const routeFeatures: Feature<LineString>[] = routes.map((geometry, index) => ({
          type: 'Feature',
          properties: {
            id: index,
            color: '#0080ff'
          },
          geometry: geometry as LineString
        }));

        setRouteData({
          type: 'FeatureCollection',
          features: routeFeatures
        });
      } catch (error) {
        console.error('Error fetching walking routes:', error);
      }
    };

    getWalkingRoutes();
  }, [mapboxAccessToken, context?.bars, courseHoles]);

  const routeLayer = {
    id: 'route',
    type: 'line' as const,
    paint: {
      'line-color': '#0080ff',
      'line-width': 3,
      'line-dasharray': [2, 2]
    }
  };

  if (loading || !mapboxAccessToken || !context) {
    return null;
  }

  return (
    <Box className={styles.expandedMap}>
      <Box className={styles.mapContainer}>
        <Map
          mapboxAccessToken={mapboxAccessToken}
          initialViewState={{
            longitude: selectedPub ? parseFloat(selectedPub.longitude.toString()) : -5.93804,
            latitude: selectedPub ? parseFloat(selectedPub.latitude.toString()) : 54.58567,
            zoom: 14
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {courseHoles.map((hole, index) => {
            const pub = context.bars.find((b: Bar) => b.id.toString() === hole.pubId);
            if (!pub) return null;
            return (
              <Marker
                key={hole.pubId}
                longitude={pub.longitude}
                latitude={pub.latitude}
                anchor="center"
              >
                <div className={styles.courseMarker}>
                  {index + 1}
                </div>
              </Marker>
            );
          })}

          {routeData && (
            <Source type="geojson" data={routeData}>
              <Layer {...routeLayer} />
            </Source>
          )}
        </Map>

        <Box className={styles.controls}>
          <IconButton
            className={styles.listButton}
            onClick={() => setShowPubList(true)}
            size="large"
          >
            <ListIcon />
          </IconButton>
          <IconButton
            className={styles.closeButton}
            onClick={onClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Drawer
        anchor="bottom"
        open={showPubList}
        onClose={() => setShowPubList(false)}
        classes={{
          paper: styles.pubListDrawer
        }}
      >
        <Box className={styles.pubList}>
          <Typography variant="h6" className={styles.pubListTitle}>
            Course Holes
          </Typography>
          {courseHoles.map((hole, index) => (
            <Box key={hole.pubId} className={styles.pubListItem}>
              <div className={styles.holeNumber}>{index + 1}</div>
              <Typography variant="subtitle1">
                {hole.pubName}
              </Typography>
            </Box>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
};

export default ExpandedMap; 