import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import StepWizard from "react-step-wizard";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";

const SignupWizard = () => {
  const [searchParams] = useSearchParams();
  const wizardRef = useRef();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stepParam = parseInt(searchParams.get("step")) || 1;
    if (wizardRef.current) {
      wizardRef.current.goToStep(stepParam);
    }
  }, [searchParams]);

  return (
    <StepWizard instance={(wizard) => (wizardRef.current = wizard)}>
      <Register setUser={setUser} />
      <VerifyEmail user={user} />
    </StepWizard>
  );
};

export default SignupWizard;
