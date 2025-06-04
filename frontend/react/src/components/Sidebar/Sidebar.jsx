import React from "react";
import { Link, NavLink } from "react-router";
import "./Sidebar.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
const Sidebar = () => {
  return (
    <aside>
      <div className="sidebar">
        <div className="sidebar-logo">LOGO</div>
        <div className="sidebar-nav-links">
          <NavLink
            to="/"
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
            <span>Games</span>
          </NavLink>
          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <span>Purchases</span>
          </NavLink>
          <NavLink
            to="/subscriptions"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <span>Subscriptions</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-button${isActive ? " active" : ""}`
            }
          >
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
