import React from "react";
import { Marker } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBeer } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "../../../../shared/types/bar";

const CustomMarker: React.FC<{
  marker: Bar;
  onClick: (marker: Bar) => void;
  selectedPint: string | null;
}> = ({ marker, onClick, selectedPint }) => {
  const { id, longitude, latitude, pintPrices } = marker;

  return (
    <Marker
      key={id}
      longitude={longitude}
      latitude={latitude}
      anchor="center"
      draggable={false}
      onClick={() => onClick(marker)}
    >
      <div className="d-flex flex-row">
        <FontAwesomeIcon icon={faBeer} color="#0D47A1" size="2x" />
        <p style={{ color: "#0D47A1" }}>
          £
          {!selectedPint
            ? pintPrices
                .reduce(
                  (minPrice, pint) => Math.min(minPrice, pint.price),
                  Infinity
                )
                .toFixed(2)
            : pintPrices
                .find((pint) => pint.name === selectedPint)
                ?.price.toFixed(2)}
        </p>
      </div>
    </Marker>
  );
};

export default CustomMarker;
