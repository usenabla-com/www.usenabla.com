import { PageLayout } from "@/components/page-layout"
import { ExcelComparisonFeature } from "@/components/ui/excel-comparison-feature"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { FileSpreadsheet, Zap, Code, Clock, Shield, RefreshCw } from "lucide-react"

export default function ExcelAutomationPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Excel Automation
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter text-center font-regular">
                  Automate 80% of your technical controls
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  Replace manual Excel evidence collection with a single API call. Transform hours of spreadsheet work into seconds of automated compliance.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <a
                  href="https://docs.usenabla.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
                >
                  Get API Access
                </a>
                <a
                  href="https://docs.usenabla.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8"
                >
                  View Documentation
                </a>
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
        secondaryButtonHref="https://cal.com/team/nabla/nabla-pilot-interest-call"
      />
    </PageLayout>
  )
}
