// app/onboarding/page.tsx
import { Suspense } from "react";
import OnboardingContent from "./component";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}