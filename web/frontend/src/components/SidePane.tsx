import React, { useContext } from "react";
import PintLogsFeed from "./PintLogsFeed"; // Adjust the path as necessary
import LogPintForm from "./LogPint"; // Adjust the path as necessary
import AddBar from "./AddBar";
import Filters from "./Filters";
import { PintsContext } from "../PintsContext";
import AuthForm from "./AuthForm";

const SidePane: React.FC = () => {
  const context = useContext(PintsContext);
  if (!context) {
    return null;
  }
  const { activeTab } = context;
  const handleButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "johntoner404@gmail.com",
          password: "Lfc6times",
        }),
      });
      if (response.ok) {
        console.log("response", response);
      } else {
        console.log("error", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      <div className={`tab-pane ${activeTab === "auth" ? "active" : ""}`}>
        <AuthForm />
      </div>
    </>
  );
};

export default SidePane;
