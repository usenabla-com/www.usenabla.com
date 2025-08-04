"use client"
import { Button } from "@/components/ui/button"
import { CodeSnippet } from "@/components/code-snippet"
import { useAnalytics } from "@/hooks/use-analytics"
import Image from "next/image"
import Link from "next/link"
import { Terminal, Download, Github, Code } from "lucide-react"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function CLIHero() {
  const analytics = useAnalytics()

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-background font-sans">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6">
            {/* Open Source Badge */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-muted/70 backdrop-blur-sm px-6 py-4 text-sm md:text-base text-foreground/80 font-medium border border-border/40 shadow-md">
              <div className="w-6 h-6 relative">
                <Image
                  src="/logo.png"
                  alt="Nabla logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-foreground">Open Source <span className="font-semibold">CLI Tool</span></span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              Command-line
              <br className="hidden sm:inline" />
              firmware analysis
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed tracking-tight">
              The open-source CLI for binary composition analysis. Extract components, detect vulnerabilities, and generate SBOMs from your terminal.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Terminal className="h-5 w-5 text-primary" />
                <span>CLI Interface</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="h-5 w-5 text-primary" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-5 w-5 text-primary" />
                <span>Easy Install</span>
              </div>
            </div>

            {/* Install Command */}
            <div className="pt-4">
              <CodeSnippet 
                code="cargo install nabla-cli" 
                className="max-w-md mx-auto lg:mx-0"
              />
            </div>
            
            {/* GitHub CTA */}
            <div
              onClick={() => {
                analytics.track('CLI GitHub Button Clicked')
                window.open('https://github.com/Atelier-Logos/nabla', '_blank')
              }}
              className="mx-auto lg:mx-0 mt-8 max-w-md w-full bg-gradient-to-r from-primary to-primary/90 border border-primary/20 backdrop-blur-md rounded-2xl p-6 shadow-lg cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                    <GitHubLogoIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-primary-foreground/80 font-medium">Get started today</div>
                    <div className="text-xl font-semibold text-primary-foreground">View on GitHub</div>
                  </div>
                </div>
                <Github className="h-5 w-5 text-primary-foreground/80 group-hover:text-primary-foreground group-hover:translate-x-1 transition-all duration-200" />
              </div>
            </div>
          </div>

          {/* Right side - Demo GIF */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/20">
                <Image
                  src="/demo.gif"
                  alt="Nabla CLI demo showing binary analysis in action"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}