import React, { useContext } from "react";
import PintLogsFeed from "./PintLogsFeed"; // Adjust the path as necessary
import LogPintForm from "./LogPint"; // Adjust the path as necessary
import AddBar from "./AddBar";
import Filters from "./Filters";
import { PintsContext } from "../PintsContext";

const SidePane: React.FC = () => {
  const context = useContext(PintsContext);
  if (!context) {
    return null;
  }
  const { activeTab } = context;
  return (
    <>
      <div
        className={`tab-pane ${activeTab === "feed" ? "active" : ""}`}
        id="feed"
      >
        <PintLogsFeed />
      </div>
      <div
        className={`tab-pane ${activeTab === "filter" ? "active" : ""}`}
        id="filter"
      >
        <Filters />
      </div>
      <div
        className={`tab-pane ${activeTab === "logPint" ? "active" : ""}`}
        id="logPint"
      >
        <LogPintForm />
      </div>
      <div className={`tab-pane ${activeTab === "addBar" ? "active" : ""}`}>
        <AddBar />
      </div>
    </>
  );
};

export default SidePane;
