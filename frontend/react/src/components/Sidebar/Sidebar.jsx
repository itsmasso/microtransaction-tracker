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
        </div>
        <h2>settings</h2>
      </div>
    </aside>
  );
};
export default Sidebar;
