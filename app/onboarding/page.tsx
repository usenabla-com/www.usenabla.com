// app/onboarding/page.tsx (or .tsx where this lives)

import { Suspense } from "react";
import OnboardingClient from "./client"; // Adjust the path as necessary
// Keep Navbar/Footer imports as-is; they can be server or client components.
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Make the PAGE itself a (server) component and wrap the client child with Suspense.
export default function OnboardingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="container mx-auto px-4 md:px-6 py-10">Loading…</div>}>
        <OnboardingClient />
      </Suspense>
      <Footer />
    </main>
  );
}
