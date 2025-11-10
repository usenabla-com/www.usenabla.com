"use client";
import { useEffect, useMemo, useState } from "react";
import { Book, Calendar, DownloadIcon, KeyIcon, KeyRound, MailPlus, MoveRight, PhoneCall, MicrochipIcon, Notebook, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { siSonarqube, siGithub, siSlack, siJson, siMarkdown } from "simple-icons";
import { useRouter } from "next/navigation";
import { Typewriter } from "@/components/ui/typewriter-text";
import { ArcadeEmbed } from "../arcade-embed";

function Hero() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});
  const titles = useMemo(
    () => ["OSCAL", "Component Inventories", "FedRamp 20x", "Evidence Relays", "ConMon" ],
    []
  );

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
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-normal">
              The GRC Automation Agency for{" "}
              <span className="inline-block min-w-[280px] text-left" style={{ color: '#FF5F1F' }}>
                <Typewriter
                  text={titles}
                  speed={80}
                  deleteSpeed={50}
                  delay={2000}
                  loop={true}
                  cursor="|"
                  className="inline-block"
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mx-auto">
              Get premium GRC engineering support for your mission-critical projects. We help you continuously update the right people (And endpoints) at the right time. 
              </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-4">
            <Link href="/blog">
            <Button 
              size="lg" 
              className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base" 
              variant="outline"
            >
              See the blog <BookOpen className="w-4 h-4" />
            </Button>
            </Link>
            <Link href="https://cal.com/team/nabla/nabla-intro">
            <Button
              size="lg"
              disabled={loading}
              className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              Schedule a consultation <Calendar className="w-4 h-4" />
            </Button>
            </Link>
          </div>          
        </div>
      </div>
    </div>
  );
}

export { Hero };
