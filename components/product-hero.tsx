"use client"
import { Button } from "@/components/ui/button"
import { CodeSnippet } from "@/components/code-snippet"
import { useAnalytics } from "@/hooks/use-analytics"
import Image from "next/image"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface FeatureIcon {
  icon: LucideIcon | ReactNode;
  label: string;
}

interface CTAConfig {
  onClick: () => void;
  icon: LucideIcon | ReactNode;
  subtitle: string;
  title: string;
  analyticsEvent: string;
}

interface ProductHeroProps {
  badge: {
    text: string;
    highlight?: string;
  };
  headline: string;
  subheadline: string;
  featureIcons: FeatureIcon[];
  cta: CTAConfig;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
    unoptimized?: boolean;
  };
  installCommand?: string;
}

export function ProductHero({
  badge,
  headline,
  subheadline,
  featureIcons,
  cta,
  image,
  installCommand
}: ProductHeroProps) {
  const analytics = useAnalytics()

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-background font-sans">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container relative z-10 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left side - Content */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 rounded-xl bg-muted/70 backdrop-blur-sm px-6 py-4 text-sm md:text-base text-foreground/80 font-medium border border-border/40 shadow-md">
              <div className="w-6 h-6 relative">
                <Image
                  src="/logo.png"
                  alt="Nabla logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-foreground">
                {badge.text} {badge.highlight && <span className="font-semibold">{badge.highlight}</span>}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed tracking-tight">
              {subheadline}
            </p>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
              {featureIcons.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-5 w-5 text-primary flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Install Command (optional) */}
            {installCommand && (
              <div className="pt-4">
                <CodeSnippet 
                  code={installCommand} 
                  className="max-w-md mx-auto lg:mx-0"
                />
              </div>
            )}
            
            {/* CTA */}
            <div
              onClick={() => {
                analytics.track(cta.analyticsEvent)
                cta.onClick()
              }}
              className="mx-auto lg:mx-0 mt-8 max-w-md w-full bg-gradient-to-r from-primary to-primary/90 border border-primary/20 backdrop-blur-md rounded-2xl p-6 shadow-lg cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 relative bg-primary-foreground/10 rounded-xl flex items-center justify-center">
                    <div className="h-6 w-6 text-primary-foreground flex items-center justify-center">
                      {cta.icon}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-primary-foreground/80 font-medium">{cta.subtitle}</div>
                    <div className="text-xl font-semibold text-primary-foreground">{cta.title}</div>
                  </div>
                </div>
                <div className="h-5 w-5 text-primary-foreground/80 group-hover:text-primary-foreground group-hover:translate-x-1 transition-all duration-200">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              {image.src.endsWith('.gif') ? (
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border/20">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="w-full h-auto object-contain"
                    priority={image.priority}
                    unoptimized={image.unoptimized}
                  />
                </div>
              ) : (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="w-full h-auto object-contain"
                  priority={image.priority}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}