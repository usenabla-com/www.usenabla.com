"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DownloadIcon, KeyIcon, KeyRound, MailPlus, MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["IoT", "Healthcare", "Industrial", "Automotive", "Manufacturing" ],
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
            <Link href="/blog/bringing-grc-to-your-firmware">
              <Button variant="secondary" size="sm" className="gap-4">
                Read our launch article <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-5xl tracking-tighter text-center font-bold">
              <span className="text-spektr-cyan-50 font-bold">Accelerate firmware compliance for</span>
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
              Save time and money on your next firmware audit with binary analysis and automated OSCAL report generation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 px-4">
            <Button 
              size="lg" 
              className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base" 
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('https://raw.githubusercontent.com/usenabla-com/www.usenabla.com/refs/heads/main/fda_assessment.json?token=GHSAT0AAAAAADIEQYEXPIT6GNWNUMFKGM6G2GBVU7Q');
                  const data = await response.text();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'oscal-sample.json';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Failed to download OSCAL sample:', error);
                }
              }}
            >
              Get an OSCAL sample <DownloadIcon className="w-4 h-4" />
            </Button>
            <Link href="mailto:trial@usenabla.com">
              <Button size="lg" className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base">
               Send us an Email <MailPlus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {/* Demo Card */}
          <div className="mt-16 max-w-6xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-lg border border-border/30 bg-card/30 p-4 shadow-sm backdrop-blur-sm">
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Live Demo
                  </h3>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-red-500/70 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500/70 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500/70 rounded-full"></div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-md bg-black/80">
                  <Image
                    src="/demo.gif"
                    alt="Live demo of Nabla firmware analysis in action"
                    width={1000}
                    height={600}
                    className="w-full h-auto object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export { Hero };
