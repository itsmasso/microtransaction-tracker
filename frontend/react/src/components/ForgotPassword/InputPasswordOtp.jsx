import React, { useEffect, useState } from "react";
import "./InputPasswordOtp.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope as faRegularEnvelope } from "@fortawesome/free-regular-svg-icons";
const InputPasswordOtp = ({ email, nextStep }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const missingField = !verificationCode;

  const [errors, setErrors] = useState({
    invalidCode: false,
    verificationCodeExpired: false,
  });

  const handleSubmitCode = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email, otp: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid code.")
          setErrors((prev) => ({ ...prev, invalidCode: true }));
        else if (data.message === "Verification code expired.")
          setErrors((prev) => ({ ...prev, verificationCodeExpired: true }));
        return;
      } else {
        console.log("Valid code. Proceeding to password reset.");
        nextStep();
      }
    } catch (err) {
      console.error("Error verifying otp.", err);
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <section className="login-card">
          <header className="login-top code-top">
            <FontAwesomeIcon
              icon={faRegularEnvelope}
              size="m"
              className="envelope-icon"
            />
            <h2 className="signup-title">Verify it's you.</h2>
            <p className="signup-subtitle verify-description">
              We sent a verification code to <span>{email}</span>. Please check
              your inbox and enter the code below.
            </p>
          </header>
          <section className="login-bot">
            <form onSubmit={handleSubmitCode}>
              <div className="login-field">
                <input
                  id="code"
                  type="number"
                  name="code"
                  placeholder="Enter 6-digits code"
                  className={`code-input login-input full-width ${
                    errors.invalidCode || errors.verificationCodeExpired
                      ? "input-error"
                      : ""
                  }`}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {errors.invalidCode ? (
                  <p className="input-error-text">Invalid verification code.</p>
                ) : errors.verificationCodeExpired ? (
                  <p className="input-error-text">
                    Verification code expired. Try again.
                  </p>
                ) : null}
              </div>
              <div className="code-bot">
                <button
                  type="submit"
                  disabled={missingField}
                  className="blue-button "
                >
                  Verify Code
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>
    </section>
  );
};

export default InputPasswordOtp;
