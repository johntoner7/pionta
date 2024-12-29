import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import MapComponent from "../components/map/Map";
import { Typography } from "@mui/material";
import TabButtons from "../components/panel/Tabs";
import SidePane from "../components/panel/SidePane";
import styles from "./App.module.scss";
import { useEffect, useState } from "react";
import Mobile from "../components/Mobile";

function App() {
  const [isIphone, setIsIphone] = useState(false);
  console.log(isIphone);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIphone(/iphone/.test(userAgent));
  }, []);

  return isIphone === true ? <Mobile /> : (
    <div className={`${styles.app} container-fluid p-4 ${isIphone ? styles.iphone : ""}`}>
      <Typography variant="h2" align="center">
        Pionta
      </Typography>
      <div className={styles.content}>
        <div className={styles.map}>
          <MapComponent />
        </div>
        <div className={styles.sidePanel}>
          {isIphone === false ? <TabButtons /> : null}
          <SidePane />
        </div>
      </div>
    </div>
  );
}

export default App;
