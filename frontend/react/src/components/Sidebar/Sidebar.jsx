import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGamepad,
  faHome,
  faMoneyCheckDollar,
  faChartSimple,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import M_logo from "../../assets/mtxtracker_logo.png";
const Sidebar = () => {
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  const routePrefix = isDemo ? '/demo' : '';
  return (
    <>
      {/* Sidebar Container */}
      <aside className={"sidebar-container"}>
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1 className="sidebar-logo-text">MtxTracker</h1>
            <img src={M_logo} alt="M logo" className="sidebar-logo-img-mobile" />
          </div>
          <div className="sidebar-nav-links">
            <NavLink
              to={`${routePrefix}/dashboard`}
              className={({ isActive }) =>
                `sidebar-button${isActive ? " active" : ""}`
              }
            >
              <FontAwesomeIcon icon={faHome} className="sidebar-icon" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to={`${routePrefix}/games`}
              className={({ isActive }) =>
                `sidebar-button${isActive ? " active" : ""}`
              }
            >
              <FontAwesomeIcon icon={faGamepad} className="sidebar-icon" />
              <span>Games</span>
            </NavLink>
            <NavLink
              to={`${routePrefix}/purchases`}
              className={({ isActive }) =>
                `sidebar-button${isActive ? " active" : ""}`
              }
            >
              <FontAwesomeIcon
                icon={faMoneyCheckDollar}
                className="sidebar-icon"
              />
              <span>Purchases</span>
            </NavLink>
            <NavLink
              to={`${routePrefix}/analytics`}
              className={({ isActive }) =>
                `sidebar-button${isActive ? " active" : ""}`
              }
            >
              <FontAwesomeIcon icon={faChartSimple} className="sidebar-icon" />
              <span>Statistics</span>
            </NavLink>
            <NavLink
              to={`${routePrefix}/settings`}
              className={({ isActive }) =>
                `sidebar-button${isActive ? " active" : ""}`
              }
            >
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
