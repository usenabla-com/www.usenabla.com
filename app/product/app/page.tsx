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
          text: "Powered by",
          highlight: "OSS Rust libraries"
        }}
        headline="First we deconstruct, then we analyze, then we feed. "
        subheadline="Our analsysis engine is built on a three step process of deonstructing the binary, analyzing the components, and feeding the results into our LLM for deep insights."
        featureIcons={[
          {
            icon: <GitHubLogoIcon className="h-5 w-5" />,
            label: "Github App"
          },
          {
            icon: <Code className="h-5 w-5" />,
            label: "Deteministic Deconstruction"
          },
          {
            icon: <Download className="h-5 w-5" />,
            label: "Easy Install"
          }
        ]}
        cta={{
          onClick: () => window.open('https://github.com/apps/nabla-secure/', '_blank'),
          icon: <GitHubLogoIcon className="h-6 w-6" />,
          subtitle: "Get started today",
          title: "Install the App",
          analyticsEvent: "Github App Button Clicked"
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
        badge="Github App Features"
        title="DevSecOps powers for firmware security teams"
        description="Everything you need to analyze firmware security and more from your automatically in your repos"
        features={[
          {
            title: "Github Native",
            description: "Built for Github and GHES workflows with intuitive automations and check runs."
          },
          {
            title: "Multi-format Support",
            description: "ELF, PE, and embedded file systems supported out of the box with no configuration."
          },
          {
            title: "Cross Platform",
            description: "Native binaries for Linux, macOS, and Windows with consistent behavior across platforms."
          },
          {
            title: "Lightweight Install",
            description: "Just install the app and hit the ground running with a 14-day free trial."
          },
          {
            title: "Enterprise Ready",
            description: "Request a demo to install the app on your own GHES instance with enterprise support."
          },
          {
            title: "Developer Friendly",
            description: "Built with Rust for performance and reliability, with a focus on developer experience."
          }
        ]}
      />
      <CTA 
        badge="Ready to Start?"
        title="Secure your firmware today"
        description="Get comprehensive binary analysis, vulnerability detection, and SBOM generation for your embedded systems
and IoT devices. Start protecting your firmware with our advanced security platform."
        primaryButtonText="Install the GitHub App"
        secondaryButtonText="Book a Demo"
        primaryButtonHref="https://github.com/apps/nabla-secure/"
        secondaryButtonHref="#"
      />
    </PageLayout>
  )
}