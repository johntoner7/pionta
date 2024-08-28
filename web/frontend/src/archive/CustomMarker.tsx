import React from "react";
import { Marker } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBeer } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "../../../../shared/types/bar";
import styles from "./CustomMarker.module.scss";

interface CustomMarkerProps {
  bar: Bar;
  onClick: (marker: Bar) => void;
  selectedPint: string | null;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  bar,
  onClick,
  selectedPint,
}) => {
  const { id, longitude, latitude, pintPrices } = bar;

  return (
    <Marker
      key={id}
      longitude={longitude}
      latitude={latitude}
      anchor="center"
      draggable={false}
      onClick={() => onClick(bar)}
    >
      <div className="d-flex flex-row">
        <FontAwesomeIcon icon={faBeer} color="#0D47A1" size="2x" />
        <p className={styles.marker}>
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
