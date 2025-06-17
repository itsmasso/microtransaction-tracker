import React from "react";
import { Link, NavLink } from "react-router";
import "./Sidebar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faMoneyCheckDollar } from "@fortawesome/free-solid-svg-icons";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
const Sidebar = () => {
  return (
    <aside>
      <div className="sidebar">
        <div className="sidebar-logo"><h1>MtxTracker</h1></div>
        <div className="sidebar-nav-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon icon={faHome} size="m" className="sidebar-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/games"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon
              icon={faGamepad}
              size="m"
              className="sidebar-icon"
            />
            <span>Games</span>
          </NavLink>
          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              size="m"
              className="sidebar-icon"
            />
            <span>Purchases</span>
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon
              icon={faChartSimple}
              size="m"
              className="sidebar-icon"
            />
            <span>Statistics</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon
              icon={faGear}
              size="m"
              className="sidebar-icon"
            />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
