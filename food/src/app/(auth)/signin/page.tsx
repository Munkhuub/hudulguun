"use client";

import { StepProvider } from "../StepProvider";
import { Login } from "./_components/Login";

export default function Home() {
  return (
    <StepProvider>
      {/* Uses the root AuthProvider from app/layout.tsx — a nested one here
          created a second, separate login state and a /signin ⇄ /admin loop. */}
      <div className="w-full m-auto relative">
        <Login />
      </div>
    </StepProvider>
  );
}
