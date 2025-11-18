import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Optional utility if using clsx or cn for class merging

const PRICING_BREAKPOINTS = [
  { maxFTE: 50, price: 599 },     // entry point, just above $10/employee
  { maxFTE: 250, price: 1499 },   // ~3x price for 5x scale
  { maxFTE: 500, price: 2999 },   // steeper jump, aligns w/ SMB → mid-market
  { maxFTE: 1000, price: 4999 },  // ~2x for 2x scale
  { maxFTE: 2500, price: 7999 },  // larger jump, enterprise mid
  { maxFTE: 5000, price: 11_999 },// clean anchor at $12k
  { maxFTE: 10000, price: 19_999 },// psychological <20k
  { maxFTE: 25000, price: 39_999 },// keeps scaling expectation
  { maxFTE: 50000, price: 74_999 },// major enterprise anchor
];

const BREAKPOINT_FTE_VALUES = [
  10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 
  3000, 4000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000
];

const getPriceForFTEs = (ftes: number): { price: number | null; label: string } => {
  if (ftes >= 100000) return { price: null, label: ">100K FTEs" };

  const breakpoint = PRICING_BREAKPOINTS.find((tier) => ftes <= tier.maxFTE);
  if (breakpoint) return { price: breakpoint.price, label: `${ftes.toLocaleString()} FTEs` };

  // After 50k, custom pricing
  return { price: null, label: `${ftes.toLocaleString()} FTEs` };
};

export const PricingSlider: React.FC = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const ftes = BREAKPOINT_FTE_VALUES[sliderIndex];
  const { price, label } = getPriceForFTEs(ftes);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderIndex(Number(e.target.value));
  };

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-background overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="container relative z-10 mx-auto px-2 sm:px-3 md:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2 mb-4">
            <span className="text-sm font-medium text-primary">Flexible Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
            Pricing that scales with you
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-1 sm:px-2 md:px-0">
            Simple, transparent pricing based on your team size. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {/* Left Card */}
            <div className="flex-1 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 sm:p-6 md:p-8 relative min-h-[320px] sm:min-h-[360px] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <h3 className="text-sm font-semibold text-foreground">Team Size Calculator</h3>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">{label}</div>
                <div className="text-sm sm:text-base text-muted-foreground">Drag the slider to adjust your team size</div>
              </div>
              
              <div className="mb-8 sm:mb-10">
                <input
                  type="range"
                  min={0}
                  max={BREAKPOINT_FTE_VALUES.length - 1}
                  step={1}
                  value={sliderIndex}
                  onChange={handleSliderChange}
                  className="w-full appearance-none h-3 sm:h-4 rounded-full bg-muted/50 mb-6 cursor-pointer touch-manipulation"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                      (sliderIndex / (BREAKPOINT_FTE_VALUES.length - 1)) * 100
                    }%, hsl(var(--muted)) ${(sliderIndex / (BREAKPOINT_FTE_VALUES.length - 1)) * 100}%, hsl(var(--muted)) 100%)`,
                  }}
                />
                
                {/* Range indicators */}
                <div className="flex justify-between text-sm text-muted-foreground px-2">
                  <span className="font-medium">10</span>
                  <span className="font-medium">1K</span>
                  <span className="font-medium">10K</span>
                  <span className="font-medium">100K+</span>
                </div>
              </div>

              <style>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 28px;
                  height: 28px;
                  background: hsl(var(--primary));
                  border: 4px solid hsl(var(--background));
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px hsl(var(--border));
                  transition: all 0.15s ease;
                }
                input[type='range']::-webkit-slider-thumb:hover {
                  transform: scale(1.15);
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px hsl(var(--border));
                }
                input[type='range']::-moz-range-thumb {
                  width: 24px;
                  height: 24px;
                  background: hsl(var(--primary));
                  border: 4px solid hsl(var(--background));
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
                }
                @media (max-width: 640px) {
                  input[type='range']::-webkit-slider-thumb {
                    width: 32px;
                    height: 32px;
                  }
                  input[type='range']::-moz-range-thumb {
                    width: 28px;
                    height: 28px;
                  }
                }
              `}</style>

              <div className="absolute bottom-5 sm:bottom-6 md:bottom-8 left-5 sm:left-6 md:left-8 right-5 sm:right-6 md:right-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl bg-muted/40 border border-border/40 backdrop-blur-sm">
                  <span className="text-sm text-muted-foreground font-medium">Need custom pricing?</span>
                  <a
                    href="mailto:hello@joindelta.com?subject=Enterprise%20pricing"
                    className="text-primary font-semibold text-sm flex items-center hover:text-primary/80 transition-colors group"
                  >
                    Contact us 
                    <span className="ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-5 sm:p-6 md:p-8 relative min-h-[320px] sm:min-h-[360px] shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-semibold text-foreground">Your Plan</h3>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {price === 0 ? "Free" : price === null ? "Custom" : `$${price.toLocaleString()}`}
                  {price !== null && price > 0 && <span className="text-base sm:text-lg md:text-xl font-normal text-muted-foreground"> / month</span>}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {price === null ? "Enterprise pricing" : "Per month, billed annually"}
                </div>
              </div>
              
              {/* Mobile: Card-based features, Desktop: List-based features */}
              <div className="mb-8 sm:mb-10">
                {/* Mobile version: 2x2 grid of feature cards */}
                <div className="grid grid-cols-2 gap-2 sm:hidden">
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/30">
                    <div className="text-xs font-medium text-foreground">Complete Analysis</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/30">
                    <div className="text-xs font-medium text-foreground">Vulnerability Detection</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/30">
                    <div className="text-xs font-medium text-foreground">CI/CD Integration</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-card/60 border border-border/30">
                    <div className="text-xs font-medium text-foreground">Priority Support</div>
                  </div>
                </div>
                
                {/* Desktop version: Traditional bullet list */}
                <div className="hidden sm:block space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-foreground font-medium">Complete firmware analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-foreground font-medium">Vulnerability detection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-foreground font-medium">CI/CD integration</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <span className="text-foreground font-medium">Priority support</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-5 sm:bottom-6 md:bottom-8 left-5 sm:left-6 md:left-8 right-5 sm:right-6 md:right-8">
                <a
                  href={price === null ? "mailto:hello@joindelta.com?subject=Enterprise%20pricing" : "https://cal.com/team/nabla/45-min-intro"}
                  className="block w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-center transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  {price === null ? "Contact Sales" : "Start Free Trial"}
                </a>
                <div className="text-center mt-3">
                  <span className="text-xs sm:text-sm text-muted-foreground">14-day free trial • No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
