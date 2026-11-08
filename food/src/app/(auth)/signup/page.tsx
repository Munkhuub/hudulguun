"use client";

import { useState } from "react";
import { Step1 } from "./_components/Step1";
import { Step2 } from "./_components/Step2";
import { StepProvider } from "../StepProvider";

export default function Home() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setStep((prevStep) => prevStep - 1);
  };
  return (
    <StepProvider>
      <div className="lg:w-full m-auto relative">
        {step === 0 && <Step1 handleNext={handleNext} />}
        {step === 1 && <Step2 handlePrev={handlePrev} />}
      </div>
    </StepProvider>
  );
}
