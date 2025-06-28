"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LightbulbIcon } from "lucide-react"
import { siGithub } from "simple-icons/icons"
import { useRouter } from "next/navigation"
import { useAnalytics } from "@/hooks/use-analytics"

export function HeroSection() {
  const analytics = useAnalytics()
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
          <div className="inline-block rounded-lg bg-muted/80 backdrop-blur-sm px-4 py-3 text-sm font-medium text-foreground/90 italic border border-border/50 shadow-sm">
              <span className="font-semibold text-foreground">Atelier</span> (atelier) - A workshop or studio where artists work. |{" "}
              <span className="font-semibold text-foreground">Logos</span> (λόγος) - The act of speaking, discourse, or argument.
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl opacity-90 text-white leading-tight">
            A Bespoke{" "}
            <span className="bg-primary bg-clip-text text-transparent">
                LLM-enabled
              </span>{" "}
              Solutions Studio
            </h1>
            <p className="text-muted-foreground opacity-90 text-lg md:text-xl max-w-[600px] leading-relaxed">
            We are a bespoke software studio helping clients build scalable, testable, and beautiful software while adopting LLMs in a sane manner.
            </p>
            <div className="flex flex-col opacity-90 sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => {
                  analytics.track('Onboarding Button Clicked')
                  window.open('/onboarding', '_blank')
                }}
                className="gap-2 bg-primary text-black"
              >
                <LightbulbIcon className="h-5 w-5" />
                Get weekly curated content
              </Button>
              <Button onClick={() => {
                analytics.track('Schedule a Call Button Clicked')
                window.open('https://cal.com/jbohrman/30-min', '_blank')
              }} variant="outline" className="bg-black text-white gap-2">
                Schedule a Call
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Hero illustration"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
