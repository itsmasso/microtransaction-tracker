import { React, useState, useEffect } from "react";
import "./Settings.css";
import { useNavigate } from "react-router-dom";
const Settings = ({ user }) => {
  const [email, setEmail] = useState(user.user.email);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    passwordMismatch: false,
    passwordTooShort: false,
    invalidPassword: false,
    emailInUse: false,
    invalidEmail: false,
  });
  const initialErrors = {
    passwordMismatch: false,
    passwordTooShort: false,
    invalidPassword: false,
    emailInUse: false,
    invalidEmail: false,
  };

  const missingFields = !newPassword || !confirmPassword || !currentPassword;

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (editingEmail) setNewEmail("");
    setErrors(initialErrors);
  }, [editingEmail]);

  useEffect(() => {
    if (editingPassword) {
      setNewPassword("");
      setCurrentPassword("");
      setConfirmPassword("");
    }
    setErrors(initialErrors);
  }, [editingPassword]);

  const updateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailHasError = !emailRegex.test(email);
    setErrors({
      invalidEmail: emailHasError,
      emailInUse: false,
    });
    if (emailHasError) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/change-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id, newEmail: newEmail }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setEmail(newEmail);
        setEditingEmail(false);
      } else {
        if (data.message === "Email already in use.") {
          setErrors((prev) => ({ ...prev, emailInUse: true }));
          return;
        }
      }
    } catch (err) {
      console.error("Error updating email:", err);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    const passwordMismatchError = newPassword !== confirmPassword;
    const passwordTooShort = newPassword.length < 8;

    setErrors({
      passwordMismatch: passwordMismatchError,
      passwordTooShort: passwordTooShort,
    });
    if (passwordMismatchError || passwordTooShort) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: user._id,
            passwordInput: currentPassword,
            newPassword: newPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Password reset successfully!");
        setEditingPassword(false);
      } else {
        if (data.message === "Invalid password.") {
          setErrors((prev) => ({ ...prev, invalidPassword: true }));
        } else if (data.message === "Email already in use.") {
          setErrors((prev) => ({ ...prev, emailInUse: true }));
        }
      }
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/user/delete-account`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      }
    );

    if (res.ok) {
      navigate("/login");
    }
  };
  return (
    <div className="page-card settings">
      <h2>Account Settings</h2>

      <div className="settings-section">
        <div className="settings-header">
          <h3>Email</h3>
          <p>{email}</p>
        </div>
        {editingEmail ? (
          <>
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email"
            />
            {errors.invalidEmail ? (
              <p className="input-error-text">Invalid email format.</p>
            ) : errors.emailInUse ? (
              <p className="input-error-text">This email is already in use.</p>
            ) : null}
            <button onClick={updateEmail}>Save Email</button>
            <button onClick={() => setEditingEmail(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditingEmail(true)}>Edit Email</button>
        )}
      </div>

      <div className="settings-section">
        <div className="settings-header">
          <h3>Password</h3>
          <p>•••••••••</p>
        </div>
        {editingPassword ? (
          <>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <small className="password-description">
              Minimum of 8 characters
            </small>
            {errors.passwordTooShort ? (
              <p className="input-error-text">
                Password must be at least 8 characters.
              </p>
            ) : errors.invalidPassword ? (
              <p className="input-error-text">Invalid password.</p>
            ) : null}
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errors.passwordMismatch && (
              <p className="input-error-text">Passwords do not match.</p>
            )}
            <button onClick={updatePassword} disabled={missingFields}>
              Save Password
            </button>
            <button onClick={() => setEditingPassword(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditingPassword(true)}>
            Edit Password
          </button>
        )}
      </div>

      <div className="settings-section danger">
        <h3>Delete Account</h3>
        <button onClick={deleteAccount} className="delete-btn">
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
