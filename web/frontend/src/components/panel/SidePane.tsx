import React, { useContext } from "react";
import PintLogsFeed from "./PintLogsFeed";
import LogPintForm from "./LogPint";
import AddBar from "./AddBar";
import Filters from "./filters/Filters";
import { PintsContext } from "../../PintsContext";
import AuthForm from "./AuthForm";

const SidePane: React.FC = () => {
  const context = useContext(PintsContext);
  if (!context) {
    return null;
  }
  const { activeTab } = context;

  return (
    <div className="side-pane-container mx-2">
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
      <div className={`tab-pane ${activeTab === "auth" ? "active" : ""}`}>
        <AuthForm />
      </div>
    </div>
  );
};

export default SidePane;
