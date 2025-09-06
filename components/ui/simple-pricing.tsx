"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SimplePricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  
  const monthlyPrice = 3750
  const annualPrice = 38000 // Save 2 months
  const annualSavings = (monthlyPrice * 12) - annualPrice

  const features = [
    "Complete firmware security analysis",
    "LLM-assisted OSCAL reports",
    "Binary parsing and disassembly",
    "Vulnerability detection and reporting",
    "Priority support",
    "14-day free trial"
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Monthly licenses for one-off usage of annual licenses for heavy usage. Distributed as JWT license tokens.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-4 md:mb-6 px-4">
          <div className="bg-muted p-1 rounded-lg flex w-full max-w-xs sm:w-auto">
            <button
              onClick={() => setIsAnnual(false)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all relative ${
                isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              {annualSavings > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full hidden sm:block">
                  Save ${(annualSavings / 1000).toFixed(0)}k
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative rounded-xl md:rounded-2xl border border-border bg-card p-4 sm:p-6 lg:p-8 shadow-lg">


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
              {/* Left: Plan info and price */}
              <div className="lg:col-span-1 text-center lg:text-left order-1">
                {/* Plan name */}
                <div className="mb-4 lg:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
                  <p className="text-muted-foreground text-sm sm:text-base px-2 lg:px-0">
                    Everything you need for firmware security
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 lg:mb-8">
                  <div className="flex flex-col sm:flex-row items-center lg:items-baseline justify-center lg:justify-start mb-2">
                    <span className="text-3xl sm:text-4xl font-bold">
                      ${(isAnnual ? Math.floor(annualPrice / 12) : monthlyPrice).toLocaleString()}
                    </span>
                    <span className="text-base sm:text-lg text-muted-foreground sm:ml-1">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-muted-foreground">
                      Billed annually (${annualPrice.toLocaleString()}/year)
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mb-4 lg:mb-6">
                  <Button 
                    size="lg" 
                    className="w-full text-sm sm:text-base lg:text-lg py-3 sm:py-4 lg:py-6 px-4"
                    onClick={() => window.open('mailto:trial@usenabla.com', '_blank')}
                  >
                    <span className="block sm:hidden">Get trial license</span>
                    <span className="hidden sm:block">Get 14-day trial license</span>
                  </Button>
                  <p className="text-center text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                    No credit card required
                  </p>
                </div>
              </div>

              {/* Middle: Features */}
              <div className="lg:col-span-1 order-3 lg:order-2">
                <h4 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-muted-foreground mb-4 lg:mb-6 text-center lg:text-left">
                  What's included:
                </h4>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4 px-4 lg:px-0">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary mt-1 mr-2 sm:mr-3 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Contact and trust indicators */}
              <div className="lg:col-span-1 flex flex-col justify-start mt-4 lg:mt-0 order-2 lg:order-3">
                {/* Contact section */}

                {/* Trust indicators
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    Trusted by security teams
                  </p>
                  <div className="flex items-center space-x-4 opacity-60">
                    <div className="text-2xl">🔒</div>
                    <div className="text-2xl">⚡</div>
                    <div className="text-2xl">🛡️</div>
                    <div className="text-2xl">🚀</div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}