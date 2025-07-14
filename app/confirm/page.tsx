// app/onboarding/page.tsx
import { Suspense } from "react";
import ConfirmPage from "./component";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}