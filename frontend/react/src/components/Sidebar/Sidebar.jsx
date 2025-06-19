import React, { useState } from "react";
import { NavLink } from "react-router";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faHome,
  faMoneyCheckDollar,
  faChartSimple,
  faGear,

} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {

  return (
    <>

      {/* Sidebar Container */}
      <aside className={"sidebar-container"}>
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>MtxTracker</h1>
          </div>
          <div className="sidebar-nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-button${isActive ? " active" : ""}`}>
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/games" className={({ isActive }) => `sidebar-button${isActive ? " active" : ""}`}>
              <FontAwesomeIcon icon={faGamepad} className="sidebar-icon" />
              <span>Games</span>
            </NavLink>
            <NavLink to="/purchases" className={({ isActive }) => `sidebar-button${isActive ? " active" : ""}`}>
              <FontAwesomeIcon icon={faMoneyCheckDollar} className="sidebar-icon" />
              <span>Purchases</span>
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => `sidebar-button${isActive ? " active" : ""}`}>
              <FontAwesomeIcon icon={faChartSimple} className="sidebar-icon" />
              <span>Statistics</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-button${isActive ? " active" : ""}`}>
              <FontAwesomeIcon icon={faGear} className="sidebar-icon" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
