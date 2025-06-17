import "./LandingNavbar.css";
import { useNavigate } from "react-router";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogo = () => {
    navigate("/");
  };
  return (
    <nav className="landing-navbar">
      <button className="landing-logo" onClick={handleLogo}>MtxTracker</button>
      <div className="nav-buttons">
        <button className="blue-button-outline" onClick={handleLogin}>
          Login
        </button>
        <button className="blue-button" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};
export default LandingNavbar;
