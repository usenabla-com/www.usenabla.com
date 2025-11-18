"use client"
import { useMemo } from "react"
import { PageLayout } from "@/components/page-layout"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { Button } from "@/components/ui/button"
import { Shield, Users, FileCheck, Target, Wrench, GraduationCap, Search, Clock, CheckCircle2, AlertTriangle, Calendar, BookOpen, RocketIcon } from "lucide-react"
import Link from "next/link"
import { Typewriter } from "@/components/ui/typewriter-text"

export default function ProfessionalServicesPage() {
  const titles = useMemo(
    () => ["OSCAL Conversion", "VEX Enrichment", "SSP Analysis", "NIST BOD Fetching", ],
    []
  )
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Internal Tool Development
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-normal">
                  Tooling development support for{" "}
                  <span className="inline-block min-w-[280px] text-left" style={{ color: '#FF5F1F' }}>
                    <Typewriter
                      text={titles}
                      speed={80}
                      deleteSpeed={50}
                      delay={2000}
                      loop={true}
                      cursor="|"
                      className="inline-block"
                    />
                  </span>
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  Lean on our team for your GRC Engineering project planning and implemention support. We can build with anything that has an endpoint. 
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 px-4">
                <Link href="/blog">
                  <Button
                    size="lg"
                    className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                    variant="outline"
                  >
                    View Blog <BookOpen className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="https://cal.com/team/nabla/nabla-intro">
                  <Button
                    size="lg"
                    className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                  >
                    Schedule Consultation <Calendar className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Process */}
      <div className="w-full py-20 lg:py-40 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  The JSON must flow
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                From simple webhooks for complex workers
              </h2>
              <p className="text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                Our proven methodology can get your evidence going everywhere it needs to go. 
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <Search className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-normal mb-2">1. Analyze Goals </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Assess your current goals and what you want to assess and compile
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        • Framework mapping
                        <br />
                        • Control assessment
                        <br />
                        • Gap identification
                        <br />
                        • Enrichment plan
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-normal mb-2">2. Identify Targets </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Plan your targets and where you want to send your data once it's mapped
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        • Destination planning
                        <br />
                        • Solidify Goals
                        <br />
                        • Plan automation schema
                        <br />
                        • Map artifacts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <FileCheck className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-normal mb-2">3. Plan workflows + Functions</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Plan the workflows and function schemas that will be implemented in your evidence engine
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        • Data mapping
                        <br />
                        • API planning
                        <br />
                        • Predicate planning
                        <br />
                        • Project scaffolding
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <RocketIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-normal mb-2">4. Implement solution</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                       Implement, deploy, and support automation solution into production for ConMon 
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        • Continuous monitoring
                        <br />
                        • Evidence automation
                        <br />
                        • Annual readiness
                        <br />
                        • Change management
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Offerings */}
      <Feature
        badge="What We Offer"
        title="Comprehensive GRC automation services"
        description="Highly technical GRC automation support to accelerate your ConMon goals and maintain continuous compliance with automated evidence collection."
        features={[
          {
            title: "System Security Plan (SSP) Analysis",
            description: "Automated generation of comprehensive SSPs tailored to your framework requirements. We help document your security controls, system architecture, and compliance posture in audit-ready format."
          },
          {
            title: "Asset Inventory & Discovery",
            description: "Complete visibility into your infrastructure with automated asset discovery and inventory management. Track cloud resources, servers, containers, and SaaS applications across your entire environment."
          },
          {
            title: "Vulnerability Management",
            description: "Continuous vulnerability scanning and remediation tracking aligned with compliance requirements. Automated evidence collection showing your vulnerability management program in action."
          },
          {
            title: "Continuous Monitoring Setup",
            description: "Implement automated continuous monitoring for ongoing compliance. Real-time evidence collection, automated control validation, and continuous compliance posture assessment."
          },
          {
            title: "Gap Assessment & Remediation",
            description: "Comprehensive gap analysis against your target framework (SOC 2, FedRAMP, ISO 27001, HIPAA). Clear remediation roadmap with prioritized action items to achieve compliance."
          },
          {
            title: "Audit Support & Response",
            description: "Expert guidance during your audit engagement. We help prepare evidence packages, respond to auditor requests, and ensure smooth audit completion with minimal delays."
          }
        ]}
      />

      {/* Who We Serve */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Who We Serve
                </span>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                  Frameworks we support
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">FedRAMP</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Federal Risk and Authorization Management Program compliance for cloud service providers. Complete SSP generation, continuous monitoring implementation, and authorization support for Low, Moderate, and High impact levels.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">CMMC</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Cybersecurity Maturity Model Certification for Department of Defense contractors. Gap assessments, control implementation, evidence collection, and assessment preparation for CMMC Level 1, 2, and 3 certification.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">ISO 27001</h3>
                <p className="text-muted-foreground leading-relaxed">
                  International standard for information security management systems (ISMS). Complete ISMS implementation, risk assessment, statement of applicability development, and certification audit preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <CTA
        badge="Ready to Get Started?"
        title="Accelerate your compliance journey with expert support"
        description="Schedule a consultation to discuss your audit preparation needs. Our team combines deep compliance expertise with automated evidence collection to get you audit-ready faster."
        primaryButtonText="Schedule Consultation"
        secondaryButtonText="Read Our Blog"
        primaryButtonHref="https://cal.com/team/nabla/nabla-intro"
        secondaryButtonHref="https://docs.joindelta.com"
      />
    </PageLayout>
  )
}
