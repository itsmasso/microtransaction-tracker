import React, { useEffect, useState } from "react";
import "./VerifyEmail.css";
import { useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope as faRegularEnvelope } from "@fortawesome/free-regular-svg-icons";
const VerifyEmail = ({ user}) => {
    if(!user){
        return;
    }
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const missingField = !verificationCode;

  const handleResend = async () => {
    await sendVerificationCode(user.user._id);
    setCooldown(30);
  };
  const [errors, setErrors] = useState({
    invalidCode: false,
    verificationCodeExpired: false,
    accountAlreadyVerified: false,
  });
  // Cooldown countdown
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const sendVerificationCode = async (userId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/send-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ userId }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Account already verified.")
          setErrors((prev) => ({ ...prev, accountAlreadyVerified: true }));
        return;
      } else {
        console.log("Verification code sent!");
      }
    } catch (err) {
      console.error("Error sending verification email:", err);
    }
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    const userId = user._id;
    console.log(userId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: userId, otp: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid code.")
          setErrors((prev) => ({ ...prev, invalidCode: true }));
        else if (data.message === "Verification code expired.")
          setErrors((prev) => ({ ...prev, verificationCodeExpired: true }));
        return;
      } else {
        console.log("Email successfully Verified!");
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
          <header className="login-top code-top">
            <FontAwesomeIcon
              icon={faRegularEnvelope}
              size="m"
                className="envelope-icon"
            />
            <h2 className="signup-title">Verify it's you.</h2>
            <p className="signup-subtitle verify-description">
              We sent a verification code to <span>{user.email}</span>. Please check
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
                ) : errors.accountAlreadyVerified ? (
                  <p className="input-error-text">Account already verified.</p>
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
                <div className="login-redirect">
                  <p>Didn't receive an email?</p>
                  <button
                    className="resend-code"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                  >
                    {cooldown > 0 ? `Try again (${cooldown}s)` : "Try again"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </section>
      </div>
    </section>
  );
};

export default VerifyEmail;
