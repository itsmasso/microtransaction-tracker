import React from "react";
import "./Navbar.css";
import { useLocation } from "react-router";
const Navbar = (user) => {
  const location = useLocation();
  const pageTitle = (path) => {
    switch (path) {
      case "/":
        return "Dashboard";
      case "/games":
        return "Games";
      case "/purchases":
        return "Purchases";
      case "/analytics":
        return "Statistics"
      case "/settings":
        return "Settings";
      default:
        return "Unknown page";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>{pageTitle(location.pathname)}</h1>
      </div>
      <div className="navbar-right">profile</div>
    </nav>
  );
};

export default Navbar;
