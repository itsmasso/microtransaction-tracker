import React from 'react';
import './SignupModal.css';

const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sign Up to Save Your Data!</h2>
        <p>Love what you see? Create an account to save your progress and unlock all features.</p>
        <div className="modal-buttons">
          <button onClick={onClose} className="modal-cancel-btn">Maybe Later</button>
          <button onClick={() => window.location.href = '/register'} className="modal-signup-btn">Sign Up Now</button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
