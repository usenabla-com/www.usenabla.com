"use client"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/use-analytics"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  const analytics = useAnalytics()

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-white font-sans">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-[length:32px_32px] opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)",
        }}
      />

      <div className="container relative z-10 px-4 md:px-8 max-w-6xl mx-auto text-center space-y-12">
        {/* Quote Box */}
        <div className="inline-block rounded-xl bg-muted/70 backdrop-blur-sm px-6 py-4 text-sm md:text-base text-foreground/80 font-medium italic border border-border/40 shadow-md leading-snug font-serif">
          <span className="font-semibold text-foreground">Atelier</span> (atelier) – a workshop or studio where artists work. |{" "}
          <span className="font-semibold text-foreground">Logos</span> (λόγος) – the act of speaking, discourse, or reasoned thought.
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] text-black max-w-5xl mx-auto">
          Fresh 🧠-to-silicon solutions <br className="hidden sm:inline" /> delivered with a human touch.
        </h1>

        {/* Subheadline */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed tracking-tight">
          We help clients build scalable, testable, and beautiful software — thoughtfully integrating LLMs where they bring real value.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button
            onClick={() => {
              analytics.track('Onboarding Button Clicked')
              window.open('/nabla', '_blank')
            }}
            className="px-6 py-3 text-base md:text-lg bg-black hover:bg-black text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Get a Nabla API Key
          </Button>

          <Button
            onClick={() => {
              analytics.track('Schedule a Call Button Clicked')
              window.open('https://cal.com/team/atelier-logos/45-min-intro-call', '_blank')
            }}
            variant="outline"
            className="px-6 py-3 text-base md:text-lg bg-background/90 hover:bg-background border-2 border-primary/20 hover:border-primary/40 text-foreground hover:text-primary font-semibold shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          >
            Talk with us
          </Button>
        </div>
        
          {/* Project Card with Link */}
          <Link
          href="https://github.com/Atelier-Logos/nabla"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="mx-auto mt-12 max-w-md w-full bg-muted/60 border border-border/30 backdrop-blur-md rounded-2xl p-6 shadow-md flex items-center gap-4 justify-center transition hover:scale-[1.02] hover:shadow-lg">
            <div className="w-12 h-12 relative">
              <Image
                src="/nabla.png"
                alt="Nabla logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground font-medium">Our latest project</div>
              <div className="text-xl font-semibold text-foreground">Nabla</div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
