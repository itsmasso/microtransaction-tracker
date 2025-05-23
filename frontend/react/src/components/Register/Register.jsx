import React, { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate, Link } from "react-router";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    invalidEmail: false,
    emailInUse: false,
    passwordMismatch: false,
  });
  const missingFields =
    !formData.email || !formData.password || !formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailHasError = !emailRegex.test(formData.email);
    const passwordMismatchError = password !== confirmPassword;

    setErrors({
      invalidEmail: emailHasError,
      passwordMismatch: passwordMismatchError,
      emailInUse: false,
    });
    if (emailHasError || passwordMismatchError) return;

    try {
      const response = await fetch(`http://localhost:5000/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Email already in use.")
          setErrors((prev) => ({ ...prev, emailInUse: true }));
        return;
      } else {
        console.log("Successfully Registered!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error checking user info:", err);
    }
  };

  return (
    <section className="signup-wrapper">
      <div className="signup-container">
        <section className="signup-card">
          <aside className="signup-left">
            <h1 className="signup-welcome">Welcome</h1>
            <p className="signup-message">
              We're glad you're here. Let's get you set up.
            </p>
          </aside>
          <main className="signup-right">
            <header>
              <h2 className="signup-title">Join us</h2>
              <p className="signup-subtitle">
                Create your account and get started.
              </p>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="signup-field">
                <label htmlFor="email" className="signup-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`signup-input full-width ${
                    errors.invalidEmail ? "input-error" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.invalidEmail ? (
                  <p className="input-error-text">Invalid email format.</p>
                ) : errors.emailInUse ? (
                  <p className="input-error-text">
                    This email is already in use.
                  </p>
                ) : null}
              </div>
              <div className="signup-field">
                <label htmlFor="password" className="signup-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="signup-input full-width"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="signup-field">
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="signup-input full-width"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                {errors.passwordMismatch && (
                  <p className="input-error-text">Passwords do not match.</p>
                )}
              </div>

              <div className="signup-button-container">
                <button type="submit" disabled={missingFields}>
                  Signup
                </button>
                <div className="login-redirect">
                  <p>Already have an account?</p>
                  <Link to="/login" className="login-link">
                    Login here
                  </Link>
                </div>
              </div>
            </form>
          </main>
        </section>
      </div>
    </section>
  );
};

export default Signup;
