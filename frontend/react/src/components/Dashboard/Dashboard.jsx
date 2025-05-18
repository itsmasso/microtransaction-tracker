import React from "react";
import "./Dashboard.css";
import Gamecard from "../Gamecard/Gamecard";
const Dashboard = () => {
  return (
    <main className="dashboard">
      <div className="card-grid">
        <Gamecard />
        <Gamecard />
        <Gamecard />
        <Gamecard />
      </div>
    </main>
  );
};
export default Dashboard;
