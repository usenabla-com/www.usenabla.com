"use client"
import { Hero } from "@/components/ui/animated-hero"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { PilotScheduler } from "@/components/pilot-scheduler"
import { Blog8 } from "@/components/blocks/blog8"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useAnalytics } from '@/hooks/use-analytics'
import { useEffect, useState } from "react"
import { getCalApi } from "@calcom/embed-react";
import { PricingCard } from "@/components/ui/pricing-card-1"
import CisaDirectiveCountdownBanner from "@/components/ui/cisa-ed-banner"

export default function Home() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});

    useEffect(() => {
      // Capture PostHog identifiers for checkout metadata and return params
      const ph = (window as any).posthog;
      const posthogId = ph?.get_distinct_id?.();
      const sessionId = ph?.get_session_id?.();
      setPosthogInfo({ id: posthogId, sessionId });
    }, []);

    const handleCheckout = () => {
      try {
        setLoading(true);
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (posthogInfo.id && !params.has("posthog_id")) params.set("posthog_id", posthogInfo.id);
        if (posthogInfo.sessionId && !params.has("session_id")) params.set("session_id", posthogInfo.sessionId);
        const qs = params.toString();
        router.push(`/onboarding${qs ? `?${qs}` : ""}`);
      } finally {
        setLoading(false);
      }
    };
  useAnalytics().page()
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Main content */}
      <main className="relative z-10">
        <Navbar />
        
        {/* Hero Section with enhanced spacing */}
        <section className="relative">
          <Hero />
        </section>
        
        {/* Features Section with subtle separation */}
        <section className="relative py-8 lg:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
          <div className="relative z-10">
            <Features />
          </div>
        </section>

        {/* Pricing Section with subtle separation */}
        <section className="relative py-8 lg:py-12">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
          <div className="relative z-10">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Simple, transparent pricing
                </h2>
                <p className="mx-auto max-w-2xl text-muted-foreground text-base sm:text-lg">
                  Choose a plan that fits your team. No hidden fees.
                </p>
              </div>

              <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-2 mt-10">
                <PricingCard
                  title="Relay"
                  price="$4500/mo"
                  description="Per month, billed annually"
                  features={[
                    "Unlimited API calls",
                    "Regular updates",
                    "All Control Frameworks",
                    "Standard SLAs",
                    "Email support",
                  ]}
                  buttonText="Start a 14-day trial"
                  onClick={handleCheckout}
                  buttonHref="/onboarding"
                  className="h-full"
                  imageSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-odVnLFkrL5eGiSzOAkNOacimjB4f3H.png&w=1000&q=75"
                  imageAlt="Starter Plan"
                />

                <PricingCard
                  title="Fabric"
                  price="$9,450"
                  priceDescription="Per month, billed annually"
                  description="Everything you need for firmware security at scale."
                  features={[
                    "Custom API integrations",
                    "Dashboard Creation (We do this manually)",
                    "Cloud connectors",
                    "Binary CFG generation",
                    "Priority support",
                  ]}
                  buttonText="Start a 14-day trial"
                  onClick={handleCheckout}
                  buttonHref="/onboarding"
                  className="h-full"
                  imageSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-2x1NIEDETqhyZz9kxfkDV3pTJ7v0eI.png&w=1000&q=75"
                  imageAlt="Professional Plan"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section with distinct background */}
        <section className="relative py-8 lg:py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="absolute inset-0 bg-dot-black/[0.1] dark:bg-dot-white/[0.1] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <PilotScheduler />
          </div>
        </section>

        {/* Footer with smooth transition */}
        <section className="relative bg-gradient-to-b from-muted/30 to-background">
          <Footer />
        </section>
      </main>
      
      {/* Decorative elements */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
    </div>
  )
}
