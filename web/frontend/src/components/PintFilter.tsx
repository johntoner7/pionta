import React from "react";
import Select from "react-select";
import { MarkerType } from "../pages/App";

interface PintFilterProps {
  selectedPint: string | null;
  onChange: (selectedOption: { value: string } | null) => void;
  markers: MarkerType[];
}

const PintFilter: React.FC<PintFilterProps> = ({
  selectedPint,
  onChange,
  markers,
}) => {
  const allPints: string[] = markers.reduce((acc: string[], marker) => {
    marker.pintPrices.forEach((pintPrice) => {
      if (!acc.includes(pintPrice.name)) {
        acc.push(pintPrice.name);
      }
    });
    return acc;
  }, []);

  const options = allPints.map((pintName) => ({
    value: pintName,
    label: pintName,
  }));

  const handleChange = (selectedOption: { value: string } | null) => {
    onChange(selectedOption);
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
      borderColor: "black",
      color: "black",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "black",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "gray",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "lightgray" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "lightgray",
      },
    }),
  };
  return (
    <div>
      <h4>Filter by Pint:</h4>
      <Select
        options={options}
        onChange={handleChange}
        value={
          selectedPint ? { value: selectedPint, label: selectedPint } : null
        }
        placeholder="All"
        isClearable
        styles={customStyles}
      />
    </div>
  );
};

export default PintFilter;
