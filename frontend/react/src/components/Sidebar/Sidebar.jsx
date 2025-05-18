import React from "react";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <aside>
      <div className="sidebar">
        <h2>Menu</h2>
        <a href="#">Dashboard</a>
        <a href="#">Transactions</a>
        <a href="#">Settings</a>
        <a href="#">Logout</a>
      </div>

    </aside>
  );
};
export default Sidebar;
