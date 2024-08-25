import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapComponent from "../components/Map";
import { Typography } from "@mui/material";
import TabButtons from "../components/Tabs";
import SidePane from "../components/SidePane";

function App() {
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
          <TabButtons />
          <SidePane />
        </div>
      </div>
    </div>
  );
}

export default App;
