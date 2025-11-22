"use client";
import { useMemo } from "react";
import { KeyIcon, Notebook, Shield, Zap, Users } from "lucide-react";
import { CapabilityRequestModal } from "@/components/ui/capability-request-modal";
import RadialOrbitalTimeline from "@/components/radial-orbital-timeline";

function Hero() {

  const timelineData = [
    {
      id: 1,
      title: "OSCAL Integration",
      date: "2025",
      content: "Implement OSCAL for compliance automation",
      category: "Compliance",
      icon: Shield,
      relatedIds: [2, 3],
      currentClients: [{ name: "Github", logo: "https://images.seeklogo.com/logo-png/30/2/github-logo-png_seeklogo-304612.png" }, { name: "Azure AI Foundry", logo: "https://ai.azure.com/favicon.ico" }, { name: "JSON", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/JSON_vector_logo.svg/1024px-JSON_vector_logo.svg.png" }, { name: "NIST", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/NIST_logo.svg/1280px-NIST_logo.svg.png" }, ],
      hourlyRate: 200,
    },
    {
      id: 2,
      title: "Component Inventories",
      date: "2024",
      content: "Build dynamic component inventory systems",
      category: "Inventory",
      icon: Notebook,
      relatedIds: [1, 3],
      currentClients: [{ name: "Claude", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/1024px-Claude_AI_symbol.svg.png" }, { name: "Azure", logo: "https://brandlogos.net/wp-content/uploads/2022/07/microsoft_azure-logo_brandlogos.net_mlyt6-512x512.png" }, { name: "Tines", logo: "https://favicons.statusgator.com/tines.png" } ],
      hourlyRate: 240,
    },
    {
      id: 3,
      title: "FedRamp 20x",
      date: "2025",
      content: "Accelerate FedRamp compliance processes",
      category: "FedRamp",
      icon: KeyIcon,
      relatedIds: [1, 2],
      currentClients: [{ name: "NIST 800-53", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/NIST_logo.svg" }, { name: "Chainguard", logo: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/chainguard.png" }, { name: "Docker", logo: "https://e7.pngegg.com/pngimages/514/232/png-clipart-docker-logo-thumbnail-tech-companies-thumbnail.png" }, { name: "Rust", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/1200px-Rust_programming_language_black_logo.svg.png" }, { name: "PDF", logo: "https://play-lh.googleusercontent.com/kXHLqzBASXjDuVVEVPRuFvdLRDU2GAiS7BBA9uOLB-uiKByzt4-YDhmBfuLaWIV_7xJ6=w240-h480-rw" }],
      hourlyRate: 260,
    },
    {
      id: 4,
      title: "Evidence Relays",
      date: "2025",
      content: "Automate evidence collection and relay",
      category: "Evidence",
      icon: Zap,
      relatedIds: [5],
      currentClients: [{ name: "Temporal", logo: "https://images.ctfassets.net/0uuz8ydxyd9p/2W8B7bcLSPX9YaSwkfrhmv/eade3fc61520b8cee84cf8605dce3056/Temporal_Symbol_dark_1_2x.png" }, { name: "OPA", logo: "https://www.openpolicyagent.org/img/nav/logo.png" }, { name: "Tines", logo: "https://favicons.statusgator.com/tines.png" }],
      hourlyRate: 280,
    },
    {
      id: 5,
      title: "ConMon",
      date: "2025",
      content: "Continuous monitoring solutions",
      category: "Monitoring",
      icon: Users,
      relatedIds: [4],
      currentClients: [{ name: "Tines", logo: "https://favicons.statusgator.com/tines.png" }, { name: "Temporal", logo: "https://images.ctfassets.net/0uuz8ydxyd9p/2W8B7bcLSPX9YaSwkfrhmv/eade3fc61520b8cee84cf8605dce3056/Temporal_Symbol_dark_1_2x.png" }, { name: "NIST 800-53", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/NIST_logo.svg" }, { name: "Claude", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Claude_AI_symbol.svg/1024px-Claude_AI_symbol.svg.png" }],
      hourlyRate: 260,
    },
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center">
          <div className="flex-1 flex gap-8 items-start justify-start flex-col">
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-left font-normal">
                The Shift-left GRC Automation Agency
              </h1>

              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-left">
                Get premium GRC engineering support for your mission-critical projects. We help you continuously update the right people (And endpoints) at the right time.
                </p>
            </div>
            <CapabilityRequestModal />
          </div>
          <div className="flex-1">
            <RadialOrbitalTimeline timelineData={timelineData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
