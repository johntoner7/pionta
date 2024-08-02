import React from "react";
import { MarkerType } from "../pages/App";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";

interface BarsListProps {
  markers: MarkerType[];
  selectedMarker: MarkerType | null;
  setSelectedMarker: (marker: MarkerType) => void;
}

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "white",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const BarsList: React.FC<BarsListProps> = ({
  markers,
  selectedMarker,
  setSelectedMarker,
}) => {
  const handleBarClick = (marker: MarkerType) => {
    setSelectedMarker(marker);
  };

  return (
    <List>
      {markers.map((marker) => (
        <StyledListItem
          key={marker.name}
          selected={selectedMarker === marker}
          onClick={() => handleBarClick(marker)}
          style={{ color: "black" }}
        >
          <ListItemText primary={marker.name} />
        </StyledListItem>
      ))}
    </List>
  );
};

export default BarsList;
