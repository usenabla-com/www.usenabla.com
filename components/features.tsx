import { GitHubLogoIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Code, Microchip, Zap, Sparkles, Lock, Radar, RecycleIcon, Bot, MessageCircle, MagnetIcon } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Features
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              We're bringing DevSecOps{" "}  
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-foreground">
                to the firmware world{" "}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Firmware security is an overlooked risk — but it doesn't have to be.
              Nabla helps you automate firmware security testing, vulnerability discovery, and the exploitability of those vulnerabilities.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16 lg:mt-20">
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <MessageCircle className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                LLM Powered
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                We use LLMs and OSS to deconstruct, analyze, and report on firmware
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Code className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Binary Analysis
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Check your binaries automatically for known vulnerabilities and security issues
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <GitHubLogoIcon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Github App
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Enforce checks and catch security issues on firmware builds via our GitHub app 
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <MagnifyingGlassIcon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Hidden Insights
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Leverage LLMs to drum up hidden gotchas in your compiled firmware you may have missed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
