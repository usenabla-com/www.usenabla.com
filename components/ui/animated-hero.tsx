"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Book, Calendar, DownloadIcon, KeyIcon, KeyRound, MailPlus, MoveRight, PhoneCall, MicrochipIcon, Notebook, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { siSonarqube, siGithub, siSlack, siJson, siMarkdown } from "simple-icons";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [calUrl, setCalUrl] = useState("https://cal.com/team/nabla/nabla-pilot-interest-call");
  const titles = useMemo(
    () => ["FedRamp", "CMMC", "FIPS 140-3", "And more?" ],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  useEffect(() => {
    // Get PostHog distinct_id and session_id
    const posthogId = (window as any).posthog?.get_distinct_id();
    const sessionId = (window as any).posthog?.get_session_id();

    // Build URL with PostHog ID and session ID
    if (posthogId && sessionId) {
      setCalUrl(`https://cal.com/team/nabla/nabla-pilot-interest-call?posthog_id=${encodeURIComponent(posthogId)}&session_id=${encodeURIComponent(sessionId)}`);
    } else if (posthogId) {
      setCalUrl(`https://cal.com/team/nabla/nabla-pilot-interest-call?posthog_id=${encodeURIComponent(posthogId)}`);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-bold">
              <span className="text-spektr-cyan-50 font-bold">The evidence fabric for programmatic compliance</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-foreground max-w-2xl text-center mx-auto">
              Pull, push, transform, and analyze your infrastructure and application evidence to meet compliance requirements faster and with less effort.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-4">
            <Link href="https://docs.usenabla.com">
            <Button 
              size="lg" 
              className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base" 
              variant="outline"
            >
              Read the Docs <BookOpen className="w-4 h-4" />
            </Button>
            </Link>
            <Link href={calUrl}>
              <Button size="lg" className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base">
               Request a 30-day Pilot <Calendar className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          
          
        </div>
      </div>
    </div>
  );
}

export { Hero };
