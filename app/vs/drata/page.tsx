"use client"

import { PageLayout } from "@/components/page-layout"
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from "@/components/ui/image-comparison"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { Code, Workflow, GitBranch, Zap, Check, X, User, FileText, Plug, BarChart3 } from "lucide-react"

export default function NablaVsDrataPage() {
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
                      className="h-4 w-4 object-contain"
                    />  vs <img
                      src="https://d3cfmt5dlbf1me.cloudfront.net/app_ecosystem/apps/logos/000/000/103/original/Drata-Logo.svg?1609778497"
                      alt="Drata Logo"
                      className="h-4 w-4 object-contain"
                    /> 
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter text-center font-normal">
                  {'Programmability > Dashboards'}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  While Drata focuses on compliance managers, Nabla is built API-first for engineering teams. Integrate compliance into your existing workflows instead of adopting another dashboard.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <a
                  href="https://docs.joindelta.com"
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


      {/* Philosophy Difference */}
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
              {/* Drata Column */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                    <img
                      src="https://d3cfmt5dlbf1me.cloudfront.net/app_ecosystem/apps/logos/000/000/103/original/Drata-Logo.svg?1609778497"
                      alt="Drata Logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">Drata</h3>
                </div>
                <p className="text-muted-foreground">
                  Compliance platform built for compliance managers. Centralized dashboard for tracking controls, policies, and audit readiness.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Dashboard-First</p>
                      <p className="text-sm text-muted-foreground">Login to web UI to check compliance status</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Manual Evidence Upload</p>
                      <p className="text-sm text-muted-foreground">Upload screenshots and documents through UI</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Plug className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Pre-Built Integrations</p>
                      <p className="text-sm text-muted-foreground">Connect via OAuth to supported platforms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border bg-background">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Compliance Scoring</p>
                      <p className="text-sm text-muted-foreground">View readiness percentages in dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nabla Column */}
              <div className="flex flex-col gap-6 border-2 border-primary/20 rounded-xl p-6 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <img
                      src="/logo.png"
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
                      <p className="text-sm text-muted-foreground">Evidence as code - version controlled and automated</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-primary/20 bg-background">
                    <GitBranch className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Bring Your Own Workflow</p>
                      <p className="text-sm text-muted-foreground">Integrate with CI/CD, Slack, Jira - whatever you use</p>
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
                    <th className="text-center p-4 font-semibold">Drata</th>
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
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
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

      {/* When to Choose Each */}
      <div className="w-full py-20 lg:py-40 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                When to choose each platform
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-background border rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Choose Drata if you...</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Have a dedicated compliance team managing audits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Need workflow management for audit coordination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Want a turnkey dashboard for executives</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Prefer clicking through a UI over writing code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Need extensive SaaS integration out-of-the-box</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">Choose Nabla if you...</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Are engineer-led and want compliance as code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Need to integrate compliance into CI/CD pipelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Want to build evidence generation into your tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Have custom artifacts that need compliance analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Prefer APIs and automation over dashboards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Developer Experience
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                Compliance that fits your workflow
              </h2>
              <p className="text-lg max-w-xl text-muted-foreground">
                With Nabla's API, compliance evidence generation becomes just another step in your deployment pipeline
              </p>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden border">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-slate-400">.github/workflows/compliance.yml</span>
              </div>
              <div className="p-6">
                <pre className="text-sm text-slate-100 font-mono overflow-x-auto">
                  <code>{`name: Generate Compliance Evidence

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  evidence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate Terraform Evidence
        run: |
          curl -X POST https://api.joindelta.com/v1/evidence/terraform \\
            -H "X-Customer-Key: \${{ secrets.NABLA_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d @terraform.json

      - name: Generate SBOM
        run: |
          curl -X POST https://api.joindelta.com/v1/evidence/sbom \\
            -H "X-Customer-Key: \${{ secrets.NABLA_API_KEY }}" \\
            -F "firmware=@firmware.bin"

      - name: Upload to S3
        run: aws s3 cp evidence/ s3://compliance-evidence/ --recursive

      - name: Notify Slack
        run: |
          curl -X POST \${{ secrets.SLACK_WEBHOOK }} \\
            -d '{"text": "Compliance evidence generated successfully"}'`}</code>
                </pre>
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
        primaryButtonHref="https://docs.joindelta.com"
        secondaryButtonHref="https://cal.com/team/nabla/45-min-intro"
      />
    </PageLayout>
  )
}
