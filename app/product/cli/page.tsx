"use client"
import { PageLayout } from "@/components/page-layout"
import { ProductHero } from "@/components/product-hero"
import { Feature } from "@/components/ui/feature-with-advantages"
import { Features } from "@/components/blocks/features-8"
import { Terminal, Download, Code, Github } from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { CTA } from "@/components/ui/call-to-action"

export default function CLIPage() {
  return (
    <PageLayout>
      <ProductHero 
        badge={{
          text: "Open Source",
          highlight: "CLI Tool"
        }}
        headline="Command-line firmware analysis"
        subheadline="The open-source CLI for binary composition analysis. Extract components, detect vulnerabilities, and generate SBOMs from your terminal."
        featureIcons={[
          {
            icon: <Terminal className="h-5 w-5" />,
            label: "CLI Interface"
          },
          {
            icon: <Code className="h-5 w-5" />,
            label: "Open Source"
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Easy Install"
          }
        ]}
        installCommand="cargo install nabla-cli"
        cta={{
          onClick: () => window.open('https://github.com/Atelier-Logos/nabla', '_blank'),
          icon: <GitHubLogoIcon className="h-6 w-6" />,
          subtitle: "Get started today",
          title: "View on GitHub",
          analyticsEvent: "CLI GitHub Button Clicked"
        }}
        image={{
          src: "/demo.gif",
          alt: "Nabla CLI demo showing binary analysis in action",
          width: 600,
          height: 400,
          priority: true,
          unoptimized: true
        }}
      />
      <Feature 
        badge="CLI Features"
        title="Command-line power for developers and security teams"
        description="Everything you need to analyze firmware from your terminal, with scriptable commands and integration-ready output formats."
        features={[
          {
            title: "Terminal Native",
            description: "Built for command-line workflows with intuitive commands and helpful output formatting."
          },
          {
            title: "Scriptable Output",
            description: "JSON, YAML, and structured formats perfect for automation and CI/CD integration."
          },
          {
            title: "Cross Platform",
            description: "Native binaries for Linux, macOS, and Windows with consistent behavior across platforms."
          },
          {
            title: "Lightweight Install",
            description: "Single binary installation with no external dependencies or runtime requirements."
          },
          {
            title: "Offline Capable",
            description: "Perform analysis without network connectivity, with optional online vulnerability updates."
          },
          {
            title: "Developer Friendly",
            description: "Rich help system, command completion, and detailed error messages for easy adoption."
          }
        ]}
      />
      <CTA 
        badge="Ready to Start?"
        title="Secure your firmware today"
        description="Get comprehensive binary analysis, vulnerability detection, and SBOM generation for your embedded systems
and IoT devices. Start protecting your firmware with our advanced security platform."
        primaryButtonText="Download the CLI"
        secondaryButtonText="Book a Demo"
        primaryButtonHref="https://github.com/usenabla-com/nabla"
        secondaryButtonHref="#"
      />
    </PageLayout>
  )
}