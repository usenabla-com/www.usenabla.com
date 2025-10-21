"use client";
import { Calendar, DownloadIcon, MailIcon, MoveRight, PhoneCall, PlaneIcon, RocketIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
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
  primaryButtonDownload?: boolean;
}

function CTA({
  badge = "Get started",
  title = "Try our platform today!",
  description = "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  secondaryButtonText = "Jump on a call",
  secondaryButtonTextMobile,
  primaryButtonHref = "#",
  secondaryButtonHref = "#",
  primaryButtonDownload = false
}: CTAProps) {
    useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"nabla-pilot-interest-call"});
      cal("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#FF5F1F"},"dark":{"cal-brand":"#FF5F1F"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
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
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal tracking-tight max-w-4xl mx-auto leading-tight">
                  {title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
                  {description}
                </p>
              </div>
            </div>
            <Cal namespace="nabla-pilot-interest-call"
                calLink="team/nabla/nabla-pilot-interest-call"
                style={{width:"100%",height:"100%",overflow:"scroll"}}
                config={{"layout":"month_view"}}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
