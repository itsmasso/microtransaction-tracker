import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./GoogleButton.css"; 
import googleIcon from "../../assets/icons8-google.svg"

const GoogleButton = ({ onSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const user = jwtDecode(tokenResponse.credential);
      console.log(user);
      onSuccess(user);
    },
    onError: () => console.log('Login Failed'),
  });

  return (
    <button className="google-button" onClick={() => login()}>
      <img src={googleIcon} alt="google icon" className='google-icon' />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleButton;