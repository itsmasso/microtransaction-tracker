import React, { useState } from "react";
import "./InputEmail.css";
import { useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const InputEmail = ({nextStep, setParentEmail}) => {
  const navigate = useNavigate();
  const [accountFound, setAccountFound] = useState(false);
   const [inputEmail, setInputEmail] = useState("");
  const missingField = inputEmail.trim() === "";
  const sendResetPasswordOtp = async (e) => {
    e.preventDefault();

    if (!inputEmail) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/send-reset-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: inputEmail }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.message === "User not found.") setAccountFound(false);
        return;
      } else {
        setAccountFound(true);
        setParentEmail(inputEmail);
        nextStep();
        console.log("Reset OTP sent!");
      }
    } catch (err) {
      console.error("Error sending reset OTP:", err);
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <section className="login-card">
          <header className="login-top code-top">
            <h2 className="signup-title">Forgot your password?</h2>
            <p className="signup-subtitle verify-description">
              Enter your email address so we can send you a verification code.
            </p>
          </header>
          <section className="login-bot">
            <form onSubmit={sendResetPasswordOtp}>
              <div className="login-field">
                <input
                  id="otp-email"
                  type="text"
                  name="otp-email"
                  placeholder="Enter your email"
                  className={`code-input login-input full-width ${
                    accountFound ? "input-error" : ""
                  }`}
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                {accountFound ? (
                  <p className="input-error-text">
                    No account found with that email.
                  </p>
                ) : null}
              </div>
              <div className="code-bot">
                <button
                  type="submit"
                  disabled={missingField}
                  className="blue-button "
                >
                  Send Email
                </button>

                <button
                  className="back-button"
                  onClick={() => navigate("/login")}
                >
                  <FontAwesomeIcon icon={faArrowLeft} size="m" />
                  Back to Login
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>
    </section>
  );
};

export default InputEmail;
