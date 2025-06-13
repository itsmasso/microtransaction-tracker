import React, { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate, Link } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    invalidEmail: false,
    emailInUse: false,
    passwordMismatch: false,
    passwordTooShort: false,
  });
  const missingFields =
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !recaptchaToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailHasError = !emailRegex.test(formData.email);
    const passwordMismatchError = password !== confirmPassword;
    const passwordTooShort = password.length < 8;

    setErrors({
      invalidEmail: emailHasError,
      passwordMismatch: passwordMismatchError,
      emailInUse: false,
      passwordTooShort: passwordTooShort,
    });
    if (emailHasError || passwordMismatchError || passwordTooShort) return;

    try {
      const response = await fetch(`http://localhost:5000/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, recaptchaToken }),
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
    <section className="login-wrapper">
      <div className="login-container">
        <section className="login-card">
          <header className="login-top signup-top">
            <h2 className="signup-title">Join us</h2>
            <p className="signup-subtitle">
              Create your account and get started.
            </p>
          </header>
          <section className="login-bot">
            <form onSubmit={handleSubmit}>
              <fieldset className="login-grid">
                <div className="login-field">
                  <label htmlFor="email" className="login-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`login-input full-width ${
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
                    <small className="password-description">Minimum of 8 characters</small>
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
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                    className="recaptcha"
                />
                <button type="submit" disabled={missingFields}>
                  Signup
                </button>
                <div className="login-redirect">
                  <p>Already have an account?</p>
                  <Link to="/login">
                    <p className="register-link">Login here</p>
                  </Link>
                </div>
              </div>
            </form>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Signup;
