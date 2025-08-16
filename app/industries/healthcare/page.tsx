"use client"
import { PageLayout } from "@/components/page-layout"
import { IndustriesHero } from "@/components/industries-hero"
import { Features } from "@/components/blocks/features-4" 
import { Faq5 } from "@/components/ui/faq-5"
import { Heart, Shield, Lock, FileCheck, Activity, Users } from "lucide-react"

export default function HealthcarePage() {
  return (
    <PageLayout>
      <IndustriesHero 
        badge={{
          text: "Industry Solutions",
          highlight: "Healthcare"
        }}
        headline="HIPAA-compliant firmware security"
        subheadline="Secure medical device firmware and IoT systems with healthcare-grade security analysis. Ensure patient data protection and regulatory compliance for connected health devices."
        featureIcons={[
          {
            icon: <Heart className="h-5 w-5" />,
            label: "Medical Devices"
          },
          {
            icon: <Lock className="h-5 w-5" />,
            label: "HIPAA Compliant"
          },
          {
            icon: <FileCheck className="h-5 w-5" />,
            label: "FDA Ready"
          }
        ]}
        cta={{
          onClick: () => window.open('https://cal.com/jbohrman/30-min', '_blank'),
          icon: <Heart className="h-6 w-6" />,
          subtitle: "Ready to secure healthcare devices?",
          title: "Request Healthcare Demo",
          analyticsEvent: "Healthcare Demo Button Clicked"
        }}
      />
      
      <Features />
      
      <Faq5 
        badge="Healthcare FAQ"
        heading="Healthcare Security Questions"
        description="Common questions about securing medical device firmware and maintaining healthcare compliance standards."
        faqs={[
          {
            question: "Can Nabla analyze medical device firmware for FDA submissions?",
            answer: "Yes, Nabla generates comprehensive security documentation that supports FDA cybersecurity submissions. Our reports include vulnerability assessments, software bill of materials, and security control documentation required for medical device approvals."
          },
          {
            question: "What types of medical devices does Nabla support?",
            answer: "Nabla can analyze firmware from various medical devices including patient monitors, infusion pumps, imaging equipment, diagnostic devices, and connected health IoT devices. We support common embedded architectures used in medical technology."
          },
          {
            question: "How does Nabla help with medical device post-market surveillance?",
            answer: "Nabla provides ongoing vulnerability monitoring for deployed medical devices. When new vulnerabilities are discovered, we can quickly assess which of your devices are affected and provide remediation guidance to maintain patient safety."
          },
        ]}
      />
    </PageLayout>
  )
}