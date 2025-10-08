"use client"
import { Button } from "@/components/ui/button"
import { CodeSnippet } from "@/components/code-snippet"
import { useAnalytics } from "@/hooks/use-analytics"
import Image from "next/image"
import Link from "next/link"
import { Shield, Lock, Zap, Github, ArrowRight } from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function NablaSecureHero() {
  const analytics = useAnalytics()

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-background font-sans">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6">
            {/* Built on Nabla OSS Box */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-muted/70 backdrop-blur-sm px-6 py-4 text-sm md:text-base text-foreground/80 font-medium border border-border/40 shadow-md">
              <div className="w-6 h-6 relative">
                <Image
                  src="/rust.png"
                  alt="Rust logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-foreground">Built with <span className="font-semibold">Rust</span></span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              DevSecOps for
              <br className="hidden sm:inline" />
                mission-critical firmware
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed tracking-tight">
              The complete enterprise solution for firmware security automation. GitHub App integration, advanced analytics, and enterprise-grade support.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitHubLogoIcon className="h-5 w-5 text-primary" />
                <span>GitHub App</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-5 w-5 text-primary" />
                <span>CI/CD Integration</span>
              </div>
            </div>
            
            {/* Enterprise Demo CTA */}
            <div
              onClick={() => {
                analytics.track('Enterprise Demo Button Clicked')
                // Get PostHog distinct_id at click time
                const posthogId = (window as any).posthog?.get_distinct_id();
                console.log('PostHog ID:', posthogId);
                const url = posthogId
                  ? `https://cal.com/jbohrman/30-min?posthog_id=${encodeURIComponent(posthogId)}`
                  : 'https://cal.com/jbohrman/30-min';
                console.log('Opening URL:', url);
                window.open(url, '_blank')
              }}
              className="mx-auto lg:mx-0 mt-8 max-w-md w-full bg-gradient-to-r from-primary to-primary/90 border border-primary/20 backdrop-blur-md rounded-2xl p-6 shadow-lg cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-primary-foreground/80 font-medium">Ready to get started?</div>
                    <div className="text-xl font-semibold text-primary-foreground">Request Enterprise Demo</div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-primary-foreground/80 group-hover:text-primary-foreground group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          </div>

          {/* Right side - Security Image */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <Image
                src="/shield.png"
                alt="Enterprise security platform illustration"
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}