"use client"
import { Button } from "@/components/ui/button"
import { CodeSnippet } from "@/components/code-snippet"
import { GitHubStarButtonClient } from "@/components/github-star-button-client"
import { useAnalytics } from "@/hooks/use-analytics"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function HeroSection() {
  const analytics = useAnalytics()

  return (
    <section className="relative overflow-hidden py-12 md:py-12 bg-background font-sans">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-8">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
            Automated BCA for mission-critical firmware security
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed tracking-tight">
              Nabla uses OSS libraries like Goblin, Capstone, and Petgraph to show you what's inside your firmware, the good and the bad.
            </p>

          </div>

          {/* Right side - Demo Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl">
              <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 p-6 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:shadow-primary/10 hover:border-primary/20 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      Live Demo
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-xl bg-black/90">
                    <Image
                      src="/demo.gif"
                      alt="Live demo of Nabla firmware analysis in action"
                      width={800}
                      height={500}
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
    </section>
  )
}
