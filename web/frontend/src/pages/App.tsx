import React, { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFilter,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import PintFilter from "../components/PintFilter";
import AddPintForm from "../components/AddPintForm";
import BarDetails from "../components/BarDetails";

interface PintPrice {
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPint(event.target.value);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredMarkers = (selectedPint: string) => {
    if (selectedPint === "") {
      return markers;
    }
    return markers.filter((marker) =>
      marker.pintPrices.some((pintPrice) => pintPrice.name === selectedPint)
    );
  };

  const filteredMarkerList = filteredMarkers(selectedPint ?? "");

  // Define the function to get the minimum pint price
  const getPintPrice = (marker: MarkerType) => {
    // Check if there is a filtered pint price
    const filteredPint = marker.pintPrices.find(
      (pint) => pint.name === selectedPint
    );
    if (filteredPint) {
      return filteredPint.price.toFixed(2);
    }

    // Calculate the minimum pint price
    const minPrice = marker.pintPrices.reduce(
      (min, p) => (p.price < min ? p.price : min),
      marker.pintPrices[0].price
    );

    return minPrice.toFixed(2);
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
