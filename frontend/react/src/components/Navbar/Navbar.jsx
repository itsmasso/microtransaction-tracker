import { React, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const toggleProfileMenu = () => setIsMenuOpen(!isMenuOpen);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        console.log("Logged out successfully");
        onLogout();
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout error: ", err);
    }
  };

  const handleSettings = async () =>{
    navigate('/settings');
};
  const location = useLocation();
  const pageTitle = (path) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/games":
        return "Games";
      case "/purchases":
        return "Purchases";
      case "/analytics":
        return "Statistics";
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
      <div className="navbar-right">
        <div className="profile-menu-wrapper" ref={menuRef}>
          <button className="profile-button" onClick={toggleProfileMenu}>
            <FontAwesomeIcon icon={faUser} size="2x" />
          </button>
          {isMenuOpen && (
            <div className="profile-dropdown">
              <button className="logout-btn" onClick={handleSettings}>
                <FontAwesomeIcon icon={faGear} size="m" /> Settings
              </button>
              <hr />
              <button className="logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} size="m" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
