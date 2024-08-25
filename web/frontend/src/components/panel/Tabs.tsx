import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFilter,
  faBuilding,
  faRss,
  faPencil,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { PintsContext } from "../../PintsContext";

const TabButtons: React.FC = () => {
  const context = useContext(PintsContext);

  if (!context) {
    return null;
  }

  const { activeTab, setActiveTab } = context;

  const tabData = [
    { tab: "filter", icon: faFilter, title: "Filter Pints" },
    { tab: "feed", icon: faRss, title: "Feed" },
    { tab: "logPint", icon: faPencil, title: "Log Pint" },
    { tab: "addBar", icon: faBuilding, title: "Add Bar" },
    { tab: "auth", icon: faUser, title: "Login" },
  ];

  return (
    <div className="tab-buttons mx-2">
      {tabData.map((tabDetails) => (
        <button
          key={tabDetails.tab}
          className={`tab-button ${activeTab === tabDetails.tab ? "active" : ""}`}
          onClick={() => setActiveTab(tabDetails.tab)}
          title={tabDetails.title}
        >
          <FontAwesomeIcon icon={tabDetails.icon as IconDefinition} />
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
