import React from "react";
import { Link } from "react-router";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <aside>
      <div className="sidebar">
        <h2>Menu</h2>
        <Link to="/">Dashboard</Link>
        <Link to="/Games">Games</Link>
        <a href="#">Settings</a>
        <a href="#">Logout</a>
      </div>
    </aside>
  );
};
export default Sidebar;
