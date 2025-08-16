"use client"
import { PageLayout } from "@/components/page-layout"
import { IndustriesHero } from "@/components/industries-hero"
import { Features } from "@/components/blocks/features-4" 
import { Faq5 } from "@/components/ui/faq-5"
import { Car, Shield, Cpu, Zap, Settings, AlertTriangle } from "lucide-react"

export default function AutomotivePage() {
  return (
    <PageLayout>
      <IndustriesHero 
        badge={{
          text: "Industry Solutions",
          highlight: "Automotive"
        }}
        headline="Secure automotive firmware at scale"
        subheadline="Comprehensive security analysis for ECUs, infotainment systems, and connected vehicle components. Meet automotive cybersecurity standards with automated firmware analysis."
        featureIcons={[
          {
            icon: <Car className="h-5 w-5" />,
            label: "ECU Analysis"
          },
          {
            icon: <Shield className="h-5 w-5" />,
            label: "ISO 21434 Ready"
          },
          {
            icon: <Cpu className="h-5 w-5" />,
            label: "Embedded Systems"
          }
        ]}
        cta={{
          onClick: () => window.open('https://cal.com/jbohrman/30-min', '_blank'),
          icon: <Car className="h-6 w-6" />,
          subtitle: "Ready to secure your fleet?",
          title: "Request a consultation",
          analyticsEvent: "Automotive Demo Button Clicked"
        }}
      />
      
      <Features />
      
      <Faq5 
        badge="Automotive FAQ"
        heading="Automotive Security Questions"
        description="Common questions about securing automotive firmware and meeting industry compliance standards."
        faqs={[
          {
            question: "How does Nabla help with ISO 21434 compliance?",
            answer: "Nabla provides automated security analysis that aligns with ISO 21434 requirements for automotive cybersecurity engineering. Our platform generates detailed security reports, vulnerability assessments, and component inventories that support your cybersecurity lifecycle processes."
          },
          {
            question: "Can Nabla analyze ECU firmware from different manufacturers?",
            answer: "Yes, Nabla supports a wide range of embedded architectures and file formats commonly used in automotive ECUs, including ARM, x86, PowerPC, and custom automotive chipsets. We can analyze firmware from major automotive suppliers and OEMs."
          },
          {
            question: "What types of automotive vulnerabilities does Nabla detect?",
            answer: "Nabla can identify common automotive security issues including weak cryptographic implementations, outdated libraries with known CVEs, insecure communication protocols, missing security controls, and potential attack vectors in connected vehicle systems."
          },
          {
            question: "How does Nabla integrate with automotive development workflows?",
            answer: "Nabla integrates seamlessly with automotive CI/CD pipelines, supporting popular build systems and version control workflows. Our API allows integration with existing automotive development tools and can be automated as part of your security validation process."
          }
        ]}
      />
    </PageLayout>
  )
}