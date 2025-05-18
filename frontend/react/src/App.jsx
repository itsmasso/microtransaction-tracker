import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar/sidebar";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
function App() {
  return (
    <div>
      <div className="layout">
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>
        <div className="layout-right">
          <div className="navbar-wrapper">
            <Navbar />
          </div>
          <div className="dashboard-wrapper">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
