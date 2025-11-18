"use client"

import { PageLayout } from "@/components/page-layout"
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from "@/components/ui/image-comparison"
import { CTA } from "@/components/ui/call-to-action"
import { Code, Workflow, GitBranch, Zap, Check, X, User, FileText, Plug, BarChart3 } from "lucide-react"

export default function NablaVsParamifyPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-grey text-primary-foreground shadow hover:bg-primary/80">
                    <img
                      src="/logo.png"
                      alt="Nabla Logo"
                      className="h-4 w-4 mr-2 object-contain"
                    />  vs <img
                      src="https://d7umqicpi7263.cloudfront.net/img/product/df5aea50-c7eb-45f0-863b-570fd4ab3a03.com/d863d078679bdc220426b682ff8e6b06"
                      alt="Drata Logo"
                      className="h-4 w-4 ml-3 object-contain"
                    /> 
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter text-center font-normal">
                  A Evidence Fabric vs a documentation vault 
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  Paramify is a dashboard-first solution for solving many pain points in compliance management. Nabla is an API-first evidence fabric for continuous compliance context. 
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
                  href="https://cal.com/team/nabla/45-min-intro"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8"
                >
                  Schedule Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two different philosophies */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                Two different philosophies
              </h2>
              <p className="text-lg max-w-xl text-muted-foreground">
                Choose the approach that fits your team's workflow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Paramify Column */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <img
                      src="https://d7umqicpi7263.cloudfront.net/img/product/df5aea50-c7eb-45f0-863b-570fd4ab3a03.com/d863d078679bdc220426b682ff8e6b06"
                      alt="Paramify Logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">Paramify</h3>
                </div>
                <p className="text-muted-foreground">
                  "Automate compliance, manage risk, build trust." Centralized dashboard for tracking controls, risk posture, and audit readiness.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Dashboard-First</p>
                      <p className="text-sm text-muted-foreground">Log in to view and manage compliance status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Audit-Ready Documentation</p>
                      <p className="text-sm text-muted-foreground">Generate and manage evidence for control requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Plug className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Pre-Built Integrations</p>
                      <p className="text-sm text-muted-foreground">Connect to supported SaaS and cloud services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Continuous Monitoring</p>
                      <p className="text-sm text-muted-foreground">Track control readiness and reporting</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nabla Column */}
              <div className="flex flex-col gap-6 border-2 border-primary/20 rounded-xl p-6 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <img
                      src="/nabla.svg"
                      alt="Nabla Logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">Nabla</h3>
                </div>
                <p className="text-muted-foreground">
                  API-first compliance engine built for engineers. Generate evidence programmatically and integrate into your existing tools and workflows.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-background">
                    <Code className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">API-First</p>
                      <p className="text-sm text-muted-foreground">Generate evidence with HTTP requests from anywhere</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-background">
                    <Workflow className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Programmatic Evidence</p>
                      <p className="text-sm text-muted-foreground">Evidence as code — version controlled and automated</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-background">
                    <GitBranch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Bring Your Own Workflow</p>
                      <p className="text-sm text-muted-foreground">Integrate with CI/CD, Slack, Jira — whatever you use</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-background">
                    <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Real-Time Generation</p>
                      <p className="text-sm text-muted-foreground">Fresh evidence on-demand, not cached screenshots</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                Feature comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Nabla</th>
                    <th className="text-center p-4 font-semibold">Paramify</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">REST API</p>
                        <p className="text-sm text-muted-foreground">Programmatic evidence generation</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">CI/CD Integration</p>
                        <p className="text-sm text-muted-foreground">Run in GitHub Actions, GitLab CI, etc.</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm text-muted-foreground">Limited</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Infrastructure as Code Analysis</p>
                        <p className="text-sm text-muted-foreground">Terraform, Pulumi, CloudFormation</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Custom Evidence Types</p>
                        <p className="text-sm text-muted-foreground">Analyze any JSON/YAML artifact</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Firmware Analysis</p>
                        <p className="text-sm text-muted-foreground">Binary composition analysis</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Compliance Dashboard</p>
                        <p className="text-sm text-muted-foreground">Web UI for viewing status</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm text-muted-foreground">Build your own</span>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Developer SDK</p>
                        <p className="text-sm text-muted-foreground">Workflow for audit coordination</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <X className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">Policy Authoring</p>
                        <p className="text-sm text-muted-foreground">Write custom compliance policies</p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-sm text-muted-foreground">Roadmap</span>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Lifecycle (replaces Developer Experience + code block) */}
      <div className="w-full py-20 lg:py-40 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Evidence Lifecycle
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                From trigger to audit trail
              </h2>
              <p className="text-lg max-w-xl text-muted-foreground">
                Nabla slots into your systems to generate, verify, and persist evidence artifacts end-to-end.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border bg-background p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <GitBranch className="w-5 h-5" />
                </div>
                <p className="font-medium mb-1">1. Trigger</p>
                <p className="text-sm text-muted-foreground">Events in CI/CD, schedulers, or webhooks initiate evidence runs.</p>
              </div>
              <div className="rounded-xl border bg-background p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Code className="w-5 h-5" />
                </div>
                <p className="font-medium mb-1">2. Generate</p>
                <p className="text-sm text-muted-foreground">Nabla APIs analyze artifacts (e.g., Terraform, SBOMs, configs).</p>
              </div>
              <div className="rounded-xl border bg-background p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="font-medium mb-1">3. Persist</p>
                <p className="text-sm text-muted-foreground">Store evidence in your buckets, vaults, or data lake.</p>
              </div>
              <div className="rounded-xl border bg-background p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <p className="font-medium mb-1">4. Report</p>
                <p className="text-sm text-muted-foreground">Emit attestations and metrics to dashboards or auditors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <CTA
        badge="Ready to Try Nabla?"
        title="Start building compliance into your workflow"
        description="Join engineering teams that have moved from dashboard-driven compliance to API-first evidence generation. Get your API key and start automating today."
        primaryButtonText="Get API Access"
        secondaryButtonText="Compare Plans"
        primaryButtonHref="https://docs.usenabla.com"
        secondaryButtonHref="https://cal.com/team/nabla/45-min-intro"
      />
    </PageLayout>
  )
}

