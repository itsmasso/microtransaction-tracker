import React, { useContext } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { Outlet, useNavigate } from "react-router";
import { DEMO_USER } from "../../util/demoData";
import SignupModal from "../SignupModal/SignupModal";
import { useSignupModal } from "../../context/SignupModalContext";

import "./PageLayout.css";
const PageLayout = ({ onLogout, user, isDemo }) => {
  const navigate = useNavigate();
  const { isSignupModalOpen, openSignupModal, closeSignupModal } = useSignupModal();

  const handleDemoSignup = () => {
    navigate('/register');
  };

  const handleDemoExit = () => {
    navigate('/');
  };

  return (
    <div className="layout">
      {isDemo && (
        <div className="demo-banner">
          <div className="demo-banner-content">
            <span>You're in Demo Mode, signup if you want to add and delete data.</span>
            <div className="demo-banner-buttons">
              <button onClick={handleDemoSignup} className="demo-signup-btn">
                Sign Up
              </button>
              <button onClick={handleDemoExit} className="demo-exit-btn">
                Exit Demo
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sidebar-wrapper">
        <Sidebar isDemo={isDemo} />
      </div>
      <div className="layout-right">
        <div className="navbar-wrapper">
          <Navbar 
            onLogout={onLogout} 
            user={isDemo ? DEMO_USER : user}
            isDemo={isDemo}
          />
        </div>
        <div className="main-content-wrapper">
          <div className="main-content-inner">
            <Outlet /> {/* This renders nested child routes */}
          </div>
        </div>
      </div>
      {/* Render the SignupModal */}
      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />
    </div>
  );
};

export default PageLayout;
