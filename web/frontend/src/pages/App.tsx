import React, { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFilter,
  faPencil,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import PintFilter from "../components/PintFilter";
import AddPintForm from "../components/AddPintForm";
import BarDetails from "../components/BarDetails";
import PriceFilter from "../components/PriceFilter";
import BarsList from "../components/BarsList";
import LogPintForm from "../components/LogPint";

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

function App() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerType>();
  const [hoveredMarker, setHoveredMarker] = useState<MarkerType>();
  const [selectedPint, setSelectedPint] = useState<string | null>(null);
  const [newBarName, setNewBarName] = useState<string>("");
  const [newPintName, setNewPintName] = useState<string>("");
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
    fetch("http://localhost:8080/api/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleMarkerHover = (marker: MarkerType) => {
    setHoveredMarker(marker);
  };

  const handleMarkerLeave = () => {
    setHoveredMarker(undefined);
  };

  const handleMarkerClick = (marker: MarkerType) => {
    handleTabClick("barDetails");
    setSelectedMarker(marker);
  };

  const handleFilterChange = (selectedOption: { value: string } | null) => {
    setSelectedPint(selectedOption ? selectedOption.value : null);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredMarkers = (selectedPint: string) => {
    return markers.filter((marker) => {
      const hasSelectedPint =
        selectedPint === "" ||
        marker.pintPrices.some((pintPrice) => pintPrice.name === selectedPint);
      const withinPriceRange = marker.pintPrices.some(
        (pintPrice) =>
          pintPrice.price >= minPrice && pintPrice.price <= maxPrice
      );
      return hasSelectedPint && withinPriceRange;
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
      return 0;
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
      <h1 className="text-center">Pionta</h1>
      <div className="row">
        <div className="col-md-8">
          <Map
            mapboxAccessToken="pk.eyJ1Ijoiam9obm1hcGJveDIwMjQiLCJhIjoiY2x1YnMyZmtrMGdjaTJrcDkweWRremgxNyJ9.WHBMuZJ2qyp_6uANSpk3Ug"
            initialViewState={{
              longitude: -5.93804,
              latitude: 54.58567,
              zoom: 14,
            }}
            style={{ width: "100%", height: "600px" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {filteredMarkerList.map((marker) => (
              <Marker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor="center"
                onClick={() => handleMarkerClick(marker)}
              >
                <div
                  className="marker-content"
                  onMouseEnter={() => handleMarkerHover(marker)}
                  onMouseLeave={() => handleMarkerLeave()}
                  style={{ color: "black" }}
                >
                  <div className="marker-price">£{getPintPrice(marker)}</div>
                </div>
              </Marker>
            ))}
            {hoveredMarker && (
              <Popup
                longitude={hoveredMarker.longitude}
                latitude={hoveredMarker.latitude}
                closeButton={false}
                closeOnClick={false}
                anchor="bottom"
              >
                <div
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    padding: "1px",
                  }}
                >
                  <h5>{hoveredMarker.name}</h5>
                </div>
              </Popup>
            )}
          </Map>
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
              className={`tab-button ${activeTab === "add" ? "active" : ""}`}
              onClick={() => handleTabClick("add")}
              title="Add Pint"
            >
              <FontAwesomeIcon icon={faPlusCircle} />
            </button>
            <button
              className={`tab-button ${activeTab === "barDetails" ? "active" : ""} ${
                selectedMarker === undefined ? "disabled" : ""
              }`}
              onClick={() => handleTabClick("barDetails")}
              title="Bar Details"
            >
              <FontAwesomeIcon icon={faBuilding} />
            </button>
            <button
              className={`tab-button ${activeTab === "logPint" ? "active" : ""} ${
                selectedMarker === undefined ? "disabled" : ""
              }`}
              onClick={() => handleTabClick("logPint")}
              title="Log Pint"
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
          </div>
          <div
            className={`tab-pane ${activeTab === "add" ? "active" : ""}`}
            id="add"
          >
            <AddPintForm
              markers={markers}
              setMarkers={setMarkers}
              selectedMarker={selectedMarker}
              newPintName={newPintName}
              setNewPintName={setNewPintName}
              newBarName={newBarName}
              setNewBarName={setNewBarName}
            />
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
            <BarsList
              markers={markers}
              selectedMarker={selectedMarker ?? null}
              setSelectedMarker={handleMarkerClick}
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
            {selectedMarker && <BarDetails selectedMarker={selectedMarker} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
