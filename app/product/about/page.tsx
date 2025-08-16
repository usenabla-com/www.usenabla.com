"use client"
import { PageLayout } from "@/components/page-layout"
import { ProductHero } from "@/components/product-hero"
import { Feature } from "@/components/ui/feature-with-advantages"
import { Shield, Zap } from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export default function NablaSecurePage() {
  return (
    <PageLayout>
      <ProductHero 
        badge={{
          text: "Built with",
          highlight: "Rust"
        }}
        headline="DevSecOps for mission-critical firmware"
        subheadline="The complete enterprise solution for firmware security automation. GitHub App integration, advanced analytics, and enterprise-grade support."
        featureIcons={[
          {
            icon: <GitHubLogoIcon className="h-5 w-5" />,
            label: "GitHub App"
          },
          {
            icon: <Shield className="h-5 w-5" />,
            label: "Enterprise Security"
          },
          {
            icon: <Zap className="h-5 w-5" />,
            label: "CI/CD Integration"
          }
        ]}
        cta={{
          onClick: () => window.open('https://github.com/apps/nabla-secure/', '_blank'),
          icon: <GitHubLogoIcon className="h-6 w-6" />,
          subtitle: "Ready to get started?",
          title: "Install the GitHub App",
          analyticsEvent: "Install Button Clicked"
        }}
        image={{
          src: "/shield.png",
          alt: "Enterprise security platform illustration",
          width: 600,
          height: 600,
          priority: true
        }}
      />
      <Feature />
    </PageLayout>
  )
}