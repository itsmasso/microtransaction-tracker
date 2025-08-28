import React, { createContext, useState, useContext } from 'react';

const SignupModalContext = createContext();

export const useSignupModal = () => {
  return useContext(SignupModalContext);
};

export const SignupModalProvider = ({ children }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <SignupModalContext.Provider value={{ isSignupModalOpen, openSignupModal, closeSignupModal }}>
      {children}
    </SignupModalContext.Provider>
  );
};
