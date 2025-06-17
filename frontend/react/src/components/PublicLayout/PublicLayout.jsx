import React from "react";
import LandingNavbar from "../LandingNavbar/LandingNavbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <LandingNavbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
