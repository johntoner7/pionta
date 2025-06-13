import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Bar } from '../types/bar';
import styles from './CompactMap.module.scss';

interface CompactMapProps {
  selectedPub: Bar | null;
  onPubSelect: (pub: Bar) => void;
  courseHoles: { pubId: string; pubName: string }[];
  allBars: Bar[];
}

export const CompactMap: React.FC<CompactMapProps> = ({
  selectedPub,
  onPubSelect,
  courseHoles,
  allBars
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-6.2603, 53.3498], // Dublin coordinates
      zoom: 13
    });

    map.current.on('load', () => {
      // Add markers for all bars
      allBars.forEach(bar => {
        const isCourseHole = courseHoles.some(hole => hole.pubId === bar.id.toString());
        const marker = new mapboxgl.Marker({
          color: isCourseHole ? '#1976d2' : '#9e9e9e',
          scale: isCourseHole ? 1.2 : 0.8
        })
          .setLngLat([bar.longitude, bar.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="${styles.popup}">
              <h3>${bar.name}</h3>
              <p>${bar.address}</p>
            </div>
          `))
          .addTo(map.current!);

        marker.getElement().addEventListener('click', () => {
          onPubSelect(bar);
        });

        markers.current.push(marker);
      });

      // If there are course holes, fit bounds to show all of them
      if (courseHoles.length > 0 && map.current) {
        const bounds = new mapboxgl.LngLatBounds();
        courseHoles.forEach(hole => {
          const bar = allBars.find(b => b.id.toString() === hole.pubId);
          if (bar) {
            bounds.extend([bar.longitude, bar.latitude]);
          }
        });
        map.current.fitBounds(bounds, { padding: 50 });
      }
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, [allBars, courseHoles, onPubSelect]);

  useEffect(() => {
    if (!map.current || !selectedPub) return;

    // Update marker colors based on selection
    markers.current.forEach(marker => {
      const markerElement = marker.getElement();
      const isSelected = marker.getLngLat().lng === selectedPub.longitude && 
                        marker.getLngLat().lat === selectedPub.latitude;
      const isCourseHole = courseHoles.some(hole => hole.pubId === selectedPub.id.toString());

      if (isSelected) {
        markerElement.style.backgroundColor = '#d32f2f';
        markerElement.style.transform = 'scale(1.4)';
      } else if (isCourseHole) {
        markerElement.style.backgroundColor = '#1976d2';
        markerElement.style.transform = 'scale(1.2)';
      } else {
        markerElement.style.backgroundColor = '#9e9e9e';
        markerElement.style.transform = 'scale(0.8)';
      }
    });

    // Center map on selected pub
    map.current.flyTo({
      center: [selectedPub.longitude, selectedPub.latitude],
      zoom: 15,
      duration: 1000
    });
  }, [selectedPub, courseHoles]);

  return <div ref={mapContainer} className={styles.mapContainer} />;
}; 