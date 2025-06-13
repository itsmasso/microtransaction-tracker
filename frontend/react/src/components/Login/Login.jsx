import React from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import { checkAuth } from "../../util/userAuthUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleButton from "./GoogleButton";
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const missingFields = !email || !password;

  const [error, setError] = useState({
    invalidCredentials: false,
    unknownCredentials: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = await checkAuth();
        setUser(userData);
        navigate("/");
      }
      if (response.status === 401) {
        if (data.message === "This account does not exist.")
          setError((prev) => ({ ...prev, unknownCredentials: true }));
        else if (data.message === "Invalid password.")
          setError((prev) => ({ ...prev, invalidCredentials: true }));
      } else {
        console.error("Login error:", data.message || "Unexpected error");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <section className="login-card">
          <div className="login-top">
            <h1 className="login-welcome">Welcome Back</h1>
            <div className="login-message">
              <span>Don't have an account?</span>
              <Link to="/register">
                <p className="register-link">Sign up</p>
              </Link>
            </div>
          </div>
          <section className="login-bot">
            <form onSubmit={handleSubmit}>
              <fieldset className="login-grid">
                <div className="login-field">
                  <label htmlFor="email" className="login-label">
                    Email
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      size="m"
                      className="input-icon"
                    />
                    <input
                      id="email"
                      type="text"
                      name="email"
                      placeholder="Email"
                      className="login-input full-width"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="login-field">
                  <label htmlFor="password" className="login-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faLock}
                      size="m"
                      className="input-icon"
                    />

                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="login-input full-width"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error.invalidCredentials && (
                    <p className="input-error-text">
                      Invalid email or password.
                    </p>
                  )}
                </div>
              </fieldset>
              <div className="login-submit">
                <button type="submit" disabled={missingFields}>
                  Sign in
                </button>
              </div>
            </form>
            <div className="or-div">
              <span>OR</span>
            </div>
            <div className="google-login-button">
              <GoogleButton></GoogleButton>
            </div>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Login;
