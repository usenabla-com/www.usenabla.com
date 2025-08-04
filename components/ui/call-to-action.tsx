import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonHref?: string;
}

function CTA({
  badge = "Get started",
  title = "Try our platform today!",
  description = "Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever.",
  primaryButtonText = "Sign up here",
  secondaryButtonText = "Jump on a call",
  primaryButtonHref = "#",
  secondaryButtonHref = "#"
}: CTAProps) {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>{badge}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
              {title}
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
              {description}
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4" variant="outline" asChild>
              <a href={secondaryButtonHref}>
                {secondaryButtonText} <PhoneCall className="w-4 h-4" />
              </a>
            </Button>
            <Button className="gap-4" asChild>
              <a href={primaryButtonHref}>
                {primaryButtonText} <MoveRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
