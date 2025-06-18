import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./GoogleButton.css";
import googleIcon from "../../assets/icons8-google.svg";

const GoogleButton = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google using the access_token
        const resGoogle = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const user = await resGoogle.json();

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: user.email,
              googleId: user.sub,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          onSuccess(data.user);
        } else {
          console.error("Google login failed:", data.message);
        }
      } catch (err) {
        console.error("Error logging in with Google:", err);
      }
    },
  });

  return (
    <button className="google-button" onClick={() => login()}>
      <img src={googleIcon} alt="google icon" className="google-icon" />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleButton;
