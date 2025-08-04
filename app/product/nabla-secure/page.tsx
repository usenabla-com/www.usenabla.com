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
          text: "Built on top of",
          highlight: "Nabla OSS"
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
          onClick: () => window.open('https://cal.com/team/atelier-logos/enterprise-demo', '_blank'),
          icon: <Shield className="h-6 w-6" />,
          subtitle: "Ready to get started?",
          title: "Request Enterprise Demo",
          analyticsEvent: "Enterprise Demo Button Clicked"
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