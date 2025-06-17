import { useEffect, useRef, useState } from "react";
import StepWizard from "react-step-wizard";
import InputEmail from "./InputEmail";
import InputPasswordOtp from "./InputPasswordOtp";
import SetNewPassword from "./SetNewPassword";
const SignupWizard = () => {
    const [email, setEmail] = useState("");
  return (
    <StepWizard>
      <InputEmail setParentEmail={setEmail}/>
      <InputPasswordOtp email={email}/>
      <SetNewPassword email={email}/>
    </StepWizard>
  );
};

export default SignupWizard;
