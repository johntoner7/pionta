import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faFilter,
  faBuilding,
  faRss,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

interface TabButtonsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabButtons: React.FC<TabButtonsProps> = ({ activeTab, setActiveTab }) => {
  const tabData = [
    { tab: "filter", icon: faFilter, title: "Filter Pints" },
    { tab: "barDetails", icon: faBuilding, title: "Bar Details" },
    { tab: "feed", icon: faRss, title: "Feed" },
    { tab: "logPint", icon: faPencil, title: "Log Pint" },
  ];

  return (
    <div className="tab-buttons">
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
