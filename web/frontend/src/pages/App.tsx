import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapComponent from "../components/map/Map";
import { Typography } from "@mui/material";
import TabButtons from "../components/panel/Tabs";
import SidePane from "../components/panel/SidePane";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={`${styles.app} container-fluid p-4`}>
      <Typography variant="h2" align="center">
        Pionta
      </Typography>
      <div className={styles.content}>
        <div className={styles.map}>
          <MapComponent />
        </div>
        <div className={styles.sidePanel}>
          <TabButtons />
          <SidePane />
        </div>
      </div>
    </div>
  );
}

export default App;
