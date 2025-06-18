import React, { useEffect, useState } from "react";
import "./SetNewPassword.css";
import { useNavigate, Link } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";

const SetNewPassword = ({ email }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    passwordMismatch: false,
    passwordTooShort: false,
  });
  const missingFields = !formData.password || !formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    const passwordMismatchError = password !== confirmPassword;
    const passwordTooShort = password.length < 8;

    setErrors({
      passwordMismatch: passwordMismatchError,
      passwordTooShort: passwordTooShort,
    });
    if (passwordMismatchError || passwordTooShort) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, newPassword: password }),
        }
      );

      if (response.ok) {
        console.log("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <section className="login-card">
          <header className="login-top signup-top">
            <h2 className="signup-title">Password Reset</h2>
            <p className="signup-subtitle">Set your new password.</p>
          </header>
          <section className="login-bot">
            <form onSubmit={handleSubmit}>
              <fieldset className="login-grid">
                <div className="password-field">
                  <div className="login-field">
                    <label htmlFor="password" className="login-label">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="login-input full-width"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <small className="password-description">
                      Minimum of 8 characters
                    </small>
                    {errors.passwordTooShort && (
                      <p className="input-error-text">
                        Password must be at least 8 characters.
                      </p>
                    )}
                  </div>
                  <div className="login-field">
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      className="login-input full-width"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                    {errors.passwordMismatch && (
                      <p className="input-error-text">
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              <div className="login-submit">
                <button
                  type="submit"
                  disabled={missingFields}
                  className="blue-button"
                >
                  Confirm
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>
    </section>
  );
};

export default SetNewPassword;
