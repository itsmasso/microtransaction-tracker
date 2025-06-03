import React from "react";
import Sidebar from "../Sidebar/sidebar";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router";

import './PageLayout.css'
const PageLayout = () => {
  return (
    <div className="layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="layout-right">
        <div className="navbar-wrapper">
          <Navbar />
        </div>
        <div className="main-content-wrapper">
          <Outlet /> {/* This renders nested child routes */}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
