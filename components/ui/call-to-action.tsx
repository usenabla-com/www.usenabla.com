import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonTextMobile?: string;
  secondaryButtonText?: string;
  secondaryButtonTextMobile?: string;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
}

function CTA({
  badge = "Get started",
  title = "Try our platform today!",
  description = "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  primaryButtonText = "Sign up here",
  primaryButtonTextMobile,
  secondaryButtonText = "Jump on a call",
  secondaryButtonTextMobile,
  primaryButtonHref = "#",
  secondaryButtonHref = "#"
}: CTAProps) {
  return (
    <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 rounded-3xl blur-3xl transform scale-110"></div>
          
          <div className="relative flex flex-col text-center bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 gap-6 sm:gap-8 items-center shadow-xl">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                  {badge}
                </Badge>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
                  {title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
                  {description}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
              <Button 
                className="gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 border-2" 
                variant="outline" 
                asChild
              >
                <a href={secondaryButtonHref} className="group">
                  <span className="sm:hidden">{secondaryButtonTextMobile || secondaryButtonText}</span>
                  <span className="hidden sm:inline">{secondaryButtonText}</span>
                  <PhoneCall className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </a>
              </Button>
              
              <Button 
                className="gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary" 
                asChild
              >
                <a href={primaryButtonHref} className="group">
                  <span className="sm:hidden">{primaryButtonTextMobile || primaryButtonText}</span>
                  <span className="hidden sm:inline">{primaryButtonText}</span>
                  <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
