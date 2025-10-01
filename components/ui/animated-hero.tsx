"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Book, Calendar, DownloadIcon, KeyIcon, KeyRound, MailPlus, MoveRight, PhoneCall, MicrochipIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { siSonarqube, siGithub, siSlack, siJson, siMarkdown } from "simple-icons";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Control Assessments", "Boundary Diagrams", "SBOMS", "Firmware Analysis" ],
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

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Link href="https://docs.usenabla.com">
              <Button variant="secondary" size="sm" className="gap-4">
               🎉 Nabla 1.2.0 just dropped <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-bold">
              <span className="text-spektr-cyan-50 font-bold">The FedRamp 20x relay for</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-foreground max-w-2xl text-center mx-auto">
              Orchestrate comprehensive FedRamp documentation such as control assessments, boundary diagrams, SBOMs, and firmware analysis reports with ease via an intuitive REST API.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-4">
            <Link href="https://docs.usenabla.com">
            <Button 
              size="lg" 
              className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base" 
              variant="outline"
            >
              Check out the docs <Book className="w-4 h-4" />
            </Button>
            </Link>
            <Link href="https://cal.com/team/nabla/nabla-pilot-interest-call">
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
