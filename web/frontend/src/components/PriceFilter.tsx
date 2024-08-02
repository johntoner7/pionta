import React from "react";
import ReactSlider from "react-slider";

interface PriceFilterProps {
  minPrice: number;
  setMinPrice: (newMinPrice: number) => void;
  maxPrice: number;
  setMaxPrice: (newMinPrice: number) => void;
  maxValue: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  maxValue,
}) => {
  const handleSliderChange = (values: [number, number]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  return (
    <div>
      <h4>Filter by Price:</h4>
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="thumb"
        trackClassName="track"
        min={0.0}
        max={maxValue}
        step={0.05}
        value={[minPrice, maxPrice]}
        onChange={handleSliderChange}
        renderThumb={(props, state) => (
          <div {...props}>
            <div className="tooltip">£{state.valueNow.toFixed(2)}</div>
          </div>
        )}
      />
    </div>
  );
};

export default PriceFilter;
