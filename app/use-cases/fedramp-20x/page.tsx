"use client"
import { PageLayout } from "@/components/page-layout"
import { ExcelComparisonFeature } from "@/components/ui/excel-comparison-feature"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { FileSpreadsheet, Zap, Code, Clock, Shield, RefreshCw, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ExcelAutomationPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});
    const titles = useMemo(
      () => [".tfstate", "firmware binaries", "Azure Context", "And more?" ],
      []
    );
  
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
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Zapier + Paramify
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter text-center font-normal">
                  What if Zapier and Paramify had a consultant baby?
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  Automate and visually build complex (And simple) workflows to power FedRamp 20x Trust Center
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <Link href="https://docs.usenabla.com">
                  <Button
                    size="lg"
                    className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                    variant="outline"
                  >
                    See the Node Registry <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                >
                  {loading ? "Redirecting…" : "Start a 14-day trial"} <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Comparison Feature */}
      <ExcelComparisonFeature />

      {/* Feature Advantages */}
      <Feature
        badge="Why API-First?"
        title="Modern compliance evidence collection built for automation"
        description="Stop wasting time on manual spreadsheet updates. Our API turns complex evidence gathering into a simple, repeatable process."
        features={[
          {
            title: "Instant Evidence",
            description: "Generate comprehensive compliance evidence in seconds, not hours. No more manual data entry or formula errors."
          },
          {
            title: "Always Current",
            description: "Real-time data ensures your evidence is never stale. Pull fresh compliance data whenever auditors need it."
          },
          {
            title: "Version Control",
            description: "Every API call is tracked and timestamped. Complete audit trail of all evidence generation built-in."
          },
          {
            title: "CI/CD Integration",
            description: "Embed compliance evidence collection directly into your deployment pipelines. Shift-left your security posture."
          },
          {
            title: "Multi-Format Output",
            description: "Get evidence in JSON, CSV, or Excel formats. Whatever your auditor needs, we've got you covered."
          },
          {
            title: "Scalable & Reliable",
            description: "From startups to enterprises. Our API handles everything from a few requests to thousands per day."
          }
        ]}
      />

      {/* Benefits Section */}
      <div className="w-full py-20 lg:py-40 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  The Difference
                </span>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                  What you gain by going API-first
                </h2>
                <p className="text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                  Real ROI from modernizing your compliance workflow
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">95% Time Savings</h3>
                <p className="text-muted-foreground leading-relaxed">
                  What took 2 hours in Excel now takes 2 minutes via API. Stop being a human copy-paste machine.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Zero Human Error</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No more typos, missed rows, or broken formulas. Programmatic evidence is consistent every time.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Continuous Compliance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Evidence collection becomes an automated background task. Your compliance posture is always audit-ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <CTA
        badge="Ready to Automate?"
        title="Start generating evidence via API today"
        description="Join forward-thinking companies that have eliminated manual Excel evidence collection. Get your API key and start automating compliance in minutes."
        primaryButtonText="Get API Access"
        secondaryButtonText="Talk to Sales"
        primaryButtonHref="https://docs.usenabla.com"
        secondaryButtonHref="https://cal.com/team/nabla/45-min-intro"
      />
    </PageLayout>
  )
}
