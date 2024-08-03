import React, { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFilter,
  faPencil,
  faPlusCircle,
  faRss,
} from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import PintFilter from "../components/PintFilter";
import AddPintForm from "../components/AddPintForm";
import BarDetails from "../components/BarDetails";
import PriceFilter from "../components/PriceFilter";
import BarsList from "../components/BarsList";
import LogPintForm from "../components/LogPint";
import PintLogsFeed from "../components/PintLogsFeed";
import MapComponent from "../components/Map";
import { Typography } from "@mui/material";

export interface PintPrice {
  name: string;
  price: number;
}

export interface MarkerType {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  description: string;
  pintPrices: PintPrice[];
}

export interface PintLog {
  id: number;
  pintName: string;
  barName: string;
  rating: number;
  description: string;
  logDate: Date;
}

function App() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [pintLogs, setPintLogs] = useState<PintLog[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType>();
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("add");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10);
  const [mostExpensivePint, setMostExpensivePint] = useState<number>(0);
  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:8080/api/bars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMarkers(data.bars);
        setMostExpensivePint(
          data.bars
            .map((bar: { pintPrices: any[] }) =>
              bar.pintPrices.map((pint) => pint.price)
            )
            .flat()
            .reduce((a: number, b: number) => Math.max(a, b))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    // Fetch logs from the API
    fetch("http://localhost:8080/api/pint/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("settings pint logs as ", data);
        setPintLogs(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFilterChange = (selectedOption: { value: string } | null) => {
    setSelectedPint(selectedOption ? selectedOption.value : null);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredMarkers = (selectedPint: string) => {
    return markers.filter((marker) => {
      if (selectedPint) {
        // Check if the selected pint is within the price range
        return marker.pintPrices.some(
          (pintPrice) =>
            pintPrice.name === selectedPint &&
            pintPrice.price >= minPrice &&
            pintPrice.price <= maxPrice
        );
      } else {
        // Check if any pint is within the price range
        return marker.pintPrices.some(
          (pintPrice) =>
            pintPrice.price >= minPrice && pintPrice.price <= maxPrice
        );
      }
    });
  };
  const filteredMarkerList = filteredMarkers(selectedPint ?? "");

  // Define the function to get the minimum pint price
  const getPintPrice = (marker: MarkerType) => {
    // Check if there is a filtered pint price
    const filteredPint = marker.pintPrices.find(
      (pint) => pint.name === selectedPint
    );
    if (filteredPint?.price) {
      return filteredPint.price.toFixed(2);
    }

    // Filter pint prices based on min and max price if they are set
    const filteredPrices: PintPrice[] = marker.pintPrices.filter((pint) => {
      if (minPrice && maxPrice) {
        return pint.price >= minPrice && pint.price <= maxPrice;
      }
      return true;
    });

    // Calculate the minimum pint price from the filtered prices
    const cheapestPint = filteredPrices.reduce(
      (min, p) => (p.price < min ? p.price : min),
      filteredPrices[0]?.price || 0
    );
    if (cheapestPint) {
      return cheapestPint.toFixed(2);
    } else {
      return "";
    }
  };

  const handleLogPint = async (log: {
    pintName: string;
    barId: number;
    rating?: number;
    description?: string;
  }) => {
    try {
      const response = await fetch("http://localhost:8080/api/pint/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to log pint");
      }

      alert("Pint logged successfully");
    } catch (error) {
      console.error("Error logging pint:", error);
      alert("Failed to log pint");
    }
  };

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
          <MapComponent
            filteredMarkerList={filteredMarkerList}
            getPintPrice={getPintPrice}
            handleTabClick={handleTabClick}
            setSelectedMarker={setSelectedMarker}
          />
        </div>
        <div className="col-md-4">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === "filter" ? "active" : ""}`}
              onClick={() => handleTabClick("filter")}
              title="Filter Pints"
            >
              <FontAwesomeIcon icon={faFilter} />
            </button>
            <button
              className={`tab-button ${activeTab === "barDetails" ? "active" : ""}`}
              onClick={() => handleTabClick("barDetails")}
              title="Bar Details"
            >
              <FontAwesomeIcon icon={faBuilding} />
            </button>
            <button
              className={`tab-button ${activeTab === "feed" ? "active" : ""}`}
              onClick={() => handleTabClick("feed")}
              title="Feed"
            >
              <FontAwesomeIcon icon={faRss} />
            </button>
            <button
              className={`tab-button ${activeTab === "logPint" ? "active" : ""}`}
              onClick={() => handleTabClick("logPint")}
              title="Log Pint"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>
          <div
            className={`tab-pane ${activeTab === "feed" ? "active" : ""}`}
            id="feed"
          >
            <PintLogsFeed pintLogs={pintLogs} />
          </div>
          <div
            className={`tab-pane ${activeTab === "filter" ? "active" : ""}`}
            id="filter"
          >
            <PintFilter
              selectedPint={selectedPint}
              onChange={handleFilterChange}
              markers={markers}
            />
            <PriceFilter
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              maxValue={mostExpensivePint}
            />
          </div>
          <div
            className={`tab-pane ${activeTab === "logPint" ? "active" : ""}`}
            id="logPint"
          >
            <LogPintForm markers={markers} onLogPint={handleLogPint} />
          </div>
          <div
            className={`tab-pane ${activeTab === "barDetails" ? "active" : ""}`}
            id="barDetails"
          >
            <BarsList
              markers={filteredMarkerList}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
            />
            {selectedMarker && <BarDetails selectedMarker={selectedMarker} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
