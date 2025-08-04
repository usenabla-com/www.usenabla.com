import React, { useState } from "react";
import { cn } from "@/lib/utils"; // Optional utility if using clsx or cn for class merging

const PRICING_BREAKPOINTS = [
  { maxFTE: 500, price: 0 },
  { maxFTE: 5000, price: 49 },
  { maxFTE: 10000, price: 99 },
  { maxFTE: 15000, price: 149 },
  { maxFTE: 25000, price: 199 },
  { maxFTE: 50000, price: 249 },
  { maxFTE: 100000, price: 399 },
  { maxFTE: 150000, price: 599 },
  { maxFTE: 200000, price: 799 },
];

const BREAKPOINT_SUB_VALUES = [
  ...Array.from({ length: 11 }, (_, i) => i * 100),
  5000, 10000, 15000, 25000, 50000, 100000, 150000, 200000,
  300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000,
];

const getPriceForSubscribers = (subs: number): { price: number | null; label: string } => {
  if (subs === 1000000) return { price: null, label: ">1M Subscribers" };

  const breakpoint = PRICING_BREAKPOINTS.find((tier) => subs <= tier.maxFTE);
  if (breakpoint) return { price: breakpoint.price, label: `${subs.toLocaleString()} subscribers` };

  // After 200k, add $400 for every additional 100k up to 1M
  const basePrice = 799;
  const extraSubs = subs - 200000;
  const extraUnits = Math.ceil(extraSubs / 100000);
  const price = basePrice + extraUnits * 400;
  return { price, label: `${subs.toLocaleString()} subscribers` };
};

export const LoopsPricingSlider: React.FC = () => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const subscribers = BREAKPOINT_SUB_VALUES[sliderIndex];
  const { price, label } = getPriceForSubscribers(subscribers);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderIndex(Number(e.target.value));
  };

  return (
    <section className="relative w-full py-16 md:py-24 bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We want to meet you where you are, so we have a sliding pricing model based on your company size
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Card */}
            <div className="flex-1 rounded-xl border border-border bg-card p-8 relative">
              <h3 className="text-sm font-semibold text-foreground mb-4">Calculate your pricing</h3>
              <div className="text-3xl font-bold text-foreground mb-8">{label}</div>
              <input
                type="range"
                min={0}
                max={BREAKPOINT_SUB_VALUES.length - 1}
                step={1}
                value={sliderIndex}
                onChange={handleSliderChange}
                className="w-full appearance-none h-3 rounded bg-muted mb-12"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                    (sliderIndex / (BREAKPOINT_SUB_VALUES.length - 1)) * 100
                  }%, hsl(var(--muted)) ${(sliderIndex / (BREAKPOINT_SUB_VALUES.length - 1)) * 100}%, hsl(var(--muted)) 100%)`,
                }}
              />

              <style>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 28px;
                  height: 28px;
                  background: hsl(var(--background));
                  border: 2px solid hsl(var(--border));
                  border-radius: 50%;
                  cursor: pointer;
                  margin-top: -1px;
                  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
                  position: relative;
                }
                input[type='range']::-moz-range-thumb {
                  width: 26px;
                  height: 26px;
                  background: hsl(var(--background));
                  border: 2px solid hsl(var(--border));
                  border-radius: 50%;
                  cursor: pointer;
                  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
                }
                @media (prefers-color-scheme: dark) {
                  input[type='range']::-webkit-slider-thumb {
                    box-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
                  }
                  input[type='range']::-moz-range-thumb {
                    box-shadow: 0 1px 5px rgba(255, 255, 255, 0.1);
                  }
                }
              `}</style>

              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-sm text-muted-foreground">
                <span>Need a custom solution?</span>
                <a
                  href="mailto:hello@usenabla.com?subject=Enterprise%20pricing"
                  className="text-foreground font-medium flex items-center hover:text-primary transition-colors"
                >
                  Contact us <span className="ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Right Card */}
            <div className="flex-1 rounded-xl border border-border bg-muted/30 p-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">Your plan</h3>
              <div className="mb-2">
                <h4 className="text-3xl font-bold text-foreground mb-6">
                  {price === 0 ? "Free" : price === null ? "Contact us" : `$${price} / mo`}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-8">
                {price === 0
                  ? "Our free plan includes basic firmware analysis with limited scans per month. Perfect for getting started with Nabla Secure."
                  : price === null
                  ? "Need custom support for enterprise-scale operations? Contact us for custom pricing and dedicated support."
                  : "Full access to enterprise-grade firmware security analysis, CI/CD integration, and priority support. All features included."}
              </p>
              <a
                href={price === null ? "mailto:hello@usenabla.com?subject=Enterprise%20pricing" : "https://cal.com/team/atelier-logos/enterprise-demo"}
                className="mt-8 inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold text-sm transition-colors"
              >
                {price === null ? "Contact us" : "Get started"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
