"use client";

import { StepProvider } from "../StepProvider";
import { Login } from "./_components/Login";
import { AuthProvider } from "@/app/_providers/AuthProvider";

export default function Home() {
  return (
    <StepProvider>
      <AuthProvider>
        <div className="w-full m-auto relative">
          <Login />
        </div>
      </AuthProvider>
    </StepProvider>
  );
}
