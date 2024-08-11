import React from "react";
import PintLogsFeed from "./PintLogsFeed"; // Adjust the path as necessary
import PintFilter from "./PintFilter"; // Adjust the path as necessary
import PriceFilter from "./PriceFilter"; // Adjust the path as necessary
import LogPintForm from "./LogPint"; // Adjust the path as necessary
import BarsList from "./BarsList"; // Adjust the path as necessary
import BarDetails from "./BarDetails"; // Adjust the path as necessary
import AddBar from "./AddBar";
interface SidePaneProps {
  activeTab: string;
  pintLogs: any[];
  selectedPint: any;
  handleFilterChange: (filter: any) => void;
  markers: any[];
  minPrice: number;
  setMinPrice: (price: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  mostExpensivePint: number;
  handleLogPint: (pint: any) => void;
  filteredMarkerList: any[];
  selectedMarker: any;
  setSelectedMarker: (marker: any) => void;
}

const SidePane: React.FC<SidePaneProps> = ({
  activeTab,
  pintLogs,
  selectedPint,
  handleFilterChange,
  markers,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  mostExpensivePint,
  handleLogPint,
  filteredMarkerList,
  selectedMarker,
  setSelectedMarker,
}) => {
  return (
    <>
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
      <div className={`tab-pane ${activeTab === "addBar" ? "active" : ""}`}>
        <AddBar />
      </div>
    </>
  );
};

export default SidePane;
