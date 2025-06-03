import React from "react";
import "./Navbar.css";

const Navbar = (user) => {
  return (
    <nav className="navbar">
      <div className="navbar-left"><h1>Dashboard</h1></div>
      <div className="navbar-right">profile</div>
    </nav>
  );
};

export default Navbar;
