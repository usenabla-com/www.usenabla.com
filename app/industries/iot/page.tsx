"use client"
import { PageLayout } from "@/components/page-layout"
import { ProductHero } from "@/components/product-hero"
import { Features } from "@/components/blocks/features-4" 
import { Faq5 } from "@/components/ui/faq-5"
import { Wifi, Shield, Cpu, Globe, Zap, Lock } from "lucide-react"

export default function IoTPage() {
  return (
    <PageLayout>
      <ProductHero 
        badge={{
          text: "Industry Solutions",
          highlight: "IoT & Connected Devices"
        }}
        headline="Secure IoT firmware at scale"
        subheadline="Comprehensive security analysis for connected devices, edge computing, and IoT ecosystems. Protect your device fleet from emerging threats with automated firmware analysis."
        featureIcons={[
          {
            icon: <Wifi className="h-5 w-5" />,
            label: "Connected Devices"
          },
          {
            icon: <Globe className="h-5 w-5" />,
            label: "Edge Computing"
          },
          {
            icon: <Lock className="h-5 w-5" />,
            label: "Device Security"
          }
        ]}
        cta={{
          onClick: () => window.open('https://cal.com/team/atelier-logos/iot-demo', '_blank'),
          icon: <Wifi className="h-6 w-6" />,
          subtitle: "Ready to secure your IoT fleet?",
          title: "Request IoT Demo",
          analyticsEvent: "IoT Demo Button Clicked"
        }}
        image={{
          src: "/iot.jpg",
          alt: "IoT security platform for connected devices",
          width: 600,
          height: 600,
          priority: true
        }}
      />
      
      <Features />
      
      <Faq5 
        badge="IoT FAQ"
        heading="IoT Security Questions"
        description="Common questions about securing IoT device firmware and managing connected device security at scale."
        faqs={[
          {
            question: "How does Nabla handle the diversity of IoT device architectures?",
            answer: "Nabla supports a wide range of IoT architectures including ARM Cortex-M, ESP32, RISC-V, and custom silicon. Our analysis engine can handle various firmware formats from microcontrollers to complex edge computing devices, regardless of the underlying hardware platform."
          },
          {
            question: "How does Nabla help with IoT device lifecycle management?",
            answer: "Nabla provides continuous security monitoring throughout the IoT device lifecycle. From initial firmware analysis during development to ongoing vulnerability assessment in deployed devices, helping you maintain security as devices receive OTA updates."
          },
          {
            question: "How does Nabla scale for large IoT deployments?",
            answer: "Nabla is designed to handle large-scale IoT deployments with thousands of device types and millions of deployed units. Our platform provides fleet-wide vulnerability assessment, automated reporting, and API integration for managing security across your entire IoT ecosystem."
          }
        ]}
      />
    </PageLayout>
  )
}