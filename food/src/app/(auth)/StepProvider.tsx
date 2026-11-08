import { createContext, PropsWithChildren, useState } from "react";

export type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type StepContextType = {
  values: FormValues;
  setValues: React.Dispatch<React.SetStateAction<FormValues>>;
};

export const StepContext = createContext<StepContextType | undefined>(
  undefined
);

export const StepProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <StepContext.Provider value={{ values, setValues }}>
      {children}
    </StepContext.Provider>
  );
};
