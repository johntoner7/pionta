import React, { useContext } from "react";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapComponent from "../components/Map";
import { Typography } from "@mui/material";
import TabButtons from "../components/Tabs";
import SidePane from "../components/SidePane";
import { PintsContext } from "../PintsContext";

function App() {
  const context = useContext(PintsContext);

  if (!context) {
    return null;
  }

  const { activeTab, setActiveTab } = context;

  return (
    <div
      className="container-fluid p-4 h-100"
      style={{
        backgroundColor: "#0D47A1",
        fontFamily: "serif",
        color: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h2" align="center">
        Pionta
      </Typography>
      <div className="row">
        <div className="col-md-8">
          <MapComponent />
        </div>
        <div className="col-md-4">
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidePane />
        </div>
      </div>
    </div>
  );
}

export default App;
