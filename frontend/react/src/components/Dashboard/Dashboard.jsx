import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <Gamecard />
        <Gamecard />
        <Gamecard />
        <Gamecard />
      </div>
    </div>
  );
};
export default Dashboard;
