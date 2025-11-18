"use client";
import { useEffect, useMemo, useState } from "react";
import { Book, Calendar, DownloadIcon, KeyIcon, KeyRound, MailPlus, MoveRight, PhoneCall, MicrochipIcon, Notebook, Mail, BookOpen, Shield, Zap, Users, Building, Globe, Cpu, LightbulbIcon, CalculatorIcon, Calendar1Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { siSonarqube, siGithub, siSlack, siJson, siMarkdown } from "simple-icons";
import { useRouter } from "next/navigation";
import { Typewriter } from "@/components/ui/typewriter-text";
import { ArcadeEmbed } from "../arcade-embed";
import RadialOrbitalTimeline from "@/components/radial-orbital-timeline";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

function Hero() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});
  const titles = useMemo(
    () => ["OSCAL", "Component Inventories", "FedRamp 20x", "Evidence Relays", "ConMon" ],
    []
  );

  const timelineData = [
    {
      id: 1,
      title: "OSCAL Integration",
      date: "2024",
      content: "Implement OSCAL for compliance automation",
      category: "Compliance",
      icon: Shield,
      relatedIds: [2, 3],
      currentClients: [{ name: "Client A", logo: "/logos/microsoft.svg" }, { name: "Client B", logo: "/logos/github.svg" }],
      hourlyRate: 150,
    },
    {
      id: 2,
      title: "Component Inventories",
      date: "2024",
      content: "Build dynamic component inventory systems",
      category: "Inventory",
      icon: Notebook,
      relatedIds: [1, 3],
      currentClients: [{ name: "Client C", logo: "/logos/sonarqube.svg" }, { name: "Client D", logo: "/logos/microsoft.svg" }],
      hourlyRate: 175,
    },
    {
      id: 3,
      title: "FedRamp 20x",
      date: "2025",
      content: "Accelerate FedRamp compliance processes",
      category: "FedRamp",
      icon: KeyIcon,
      relatedIds: [1, 2],
      currentClients: [{ name: "Client E", logo: "/logos/github.svg" }],
      hourlyRate: 200,
    },
    {
      id: 4,
      title: "Evidence Relays",
      date: "2025",
      content: "Automate evidence collection and relay",
      category: "Evidence",
      icon: Zap,
      relatedIds: [5],
      currentClients: [{ name: "Client F", logo: "/logos/microsoft.svg" }],
      hourlyRate: 180,
    },
    {
      id: 5,
      title: "ConMon",
      date: "2025",
      content: "Continuous monitoring solutions",
      category: "Monitoring",
      icon: Users,
      relatedIds: [4],
      currentClients: [{ name: "Client G", logo: "/logos/sonarqube.svg" }],
      hourlyRate: 160,
    },
  ];

  useEffect(() => {
    // Capture PostHog identifiers for checkout metadata and return params
    const ph = (window as any).posthog;
    const posthogId = ph?.get_distinct_id?.();
    const sessionId = ph?.get_session_id?.();
    setPosthogInfo({ id: posthogId, sessionId });
  }, []);

  const handleCheckout = () => {
    try {
      setLoading(true);
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      if (posthogInfo.id && !params.has("posthog_id")) params.set("posthog_id", posthogInfo.id);
      if (posthogInfo.sessionId && !params.has("session_id")) params.set("session_id", posthogInfo.sessionId);
      const qs = params.toString();
      router.push(`/onboarding${qs ? `?${qs}` : ""}`);
    } finally {
      setLoading(false);
    }
  };

  // Dedicated checkout page handles embedded Stripe Checkout

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
            <div className="flex flex-col sm:flex-row gap-3 px-4">
              <Link href="/professional-services">
              <Button
                size="lg"
                className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
                variant="outline"
              >
                Learn More <LightbulbIcon className="w-4 h-4" />
              </Button>
              </Link>
              <Link href="https://cal.com/team/nabla/nabla-intro">
              <Button
                size="lg"
                disabled={loading}
                className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Schedule a consultation <Calendar1Icon className="w-4 h-4" />
              </Button>
              </Link>
            </div>
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
