import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router";

import "./PageLayout.css";
const PageLayout = ({onLogout}) => {
  return (
    <div className="layout">
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>
      <div className="layout-right">
        <div className="navbar-wrapper">
          <Navbar onLogout={onLogout}/>
        </div>
        <div className="main-content-wrapper">
          <div className="main-content-inner">
            <Outlet /> {/* This renders nested child routes */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
