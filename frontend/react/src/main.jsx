import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SignupModalProvider } from './context/SignupModalContext.jsx'; // Import SignupModalProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SignupModalProvider> {/* Wrap App with SignupModalProvider */}
        <App />
      </SignupModalProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
