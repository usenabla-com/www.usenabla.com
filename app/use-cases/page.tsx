import { PageLayout } from "@/components/page-layout"
import { Feature108 } from "@/components/blocks/shadcnblocks-com-feature108"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { Search, Shield, FileText, Code, Zap, Users } from "lucide-react"

export default function FeaturesPage() {
  return (
    <PageLayout>
      <Feature108 
        badge="Product Features"
        heading="Comprehensive Firmware Security Analysis"
        description="Deep binary composition analysis with vulnerability detection, SBOM generation, and security insights for embedded systems and IoT devices."
        tabs={[
          {
            value: "analysis",
            icon: <Search className="h-auto w-4 shrink-0" />,
            label: "Binary Analysis",
            content: {
              badge: "Core Engine",
              title: "Deep binary composition analysis",
              description: "Extract and analyze components, dependencies, and security attributes from firmware binaries. Support for multiple formats including ELF, PE, and embedded file systems.",
              buttonText: "Try Analysis",
              imageSrc: "/shield.png",
              imageAlt: "Binary analysis visualization"
            }
          },
          {
            value: "vulnerabilities",
            icon: <Shield className="h-auto w-4 shrink-0" />,
            label: "Vulnerability Detection",
            content: {
              badge: "Security First",
              title: "Identify security vulnerabilities",
              description: "Comprehensive vulnerability scanning against known CVE databases, with detailed risk assessment and remediation guidance for embedded systems.",
              buttonText: "View Security",
              imageSrc: "/shield.png",
              imageAlt: "Vulnerability detection interface"
            }
          },
          {
            value: "sbom",
            icon: <FileText className="h-auto w-4 shrink-0" />,
            label: "SBOM Generation",
            content: {
              badge: "Compliance Ready",
              title: "Generate software bills of materials",
              description: "Automatically create comprehensive SBOMs in industry-standard formats (SPDX, CycloneDX) for compliance, supply chain transparency, and risk management.",
              buttonText: "Generate SBOM",
              imageSrc: "/shield.png",
              imageAlt: "SBOM generation dashboard"
            }
          }
        ]}
      />
      <Feature 
        badge="Feature Deep Dive"
        title="LLM-driven firmware analysis that understands your full binary context"
        description="Explore the technical details behind our binary composition analysis engine and security detection capabilities."
        features={[
          {
            title: "Multi-format Support",
            description: "Analyze ELF, PE, Mach-O, and embedded file systems with native parsing capabilities."
          },
          {
            title: "Dependency Mapping",
            description: "Visualize complex dependency graphs and identify critical components in your firmware."
          },
          {
            title: "CVE Integration",
            description: "Real-time vulnerability matching against NIST NVD and other security databases."
          },
          {
            title: "Custom Rule Engine",
            description: "Create and deploy custom detection rules for proprietary components and threats."
          },
          {
            title: "Compliance Reporting",
            description: "Generate reports for NIST, ISO 27001, and other security compliance frameworks."
          },
          {
            title: "API Integration",
            description: "Seamlessly integrate with CI/CD pipelines and security orchestration platforms."
          }
        ]}
      />
      <CTA 
        badge="Ready to Start?"
        title="Secure your firmware today"
        description="Get comprehensive binary analysis, vulnerability detection, and SBOM generation for your embedded systems and IoT devices. Start protecting your firmware with our advanced security platform."
        primaryButtonText="Install the GitHub App"
        secondaryButtonText="Book a Demo"
        primaryButtonHref="https://github.com/apps/nabla-secure/"
        secondaryButtonHref="https://cal.com/team/nabla/45-min-intro"
      />
    </PageLayout>
  )
}