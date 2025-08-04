import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureProps {
  badge?: string;
  title?: string;
  description?: string;
  features?: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    title: "Simple implementation",
    description: "We've made the docs top priority and are working on Github Actions templates."
  },
  {
    title: "Wide Range of Binary formats",
    description: "From ELF to DICOM, we support a wide range of binary formats."
  },
  {
    title: "Fast and Reliable",
    description: "We've built Nabla with a performant Rust backend that can handle large binaries efficiently."
  },
  {
    title: "Enterprise Ready",
    description: "We architected our Github App in advance to support GHES and Enterprise installations."
  },
  {
    title: "Stateless and secure",
    description: "The only data we store is your customer account and payment related information. We do not store any of your binaries or analysis results."
  },
  {
    title: "Modern Encryption and Signing",
    description: "We use modern algorithms for attestations and signing, and support the new Github Attestations API"
  }
];

function Feature({ 
  badge = "DevSecOps",
  title = "Shift-left binary composition analysis for firmware, IoT, and embedded systems",
  description = "Get a comprehensive view of your firmware's internals, vulnerabilities, and potential exploits with Nabla.",
  features = defaultFeatures
}: FeatureProps = {}) {
  return (
    <div className="w-full pt-8 pb-20 lg:pt-12 lg:pb-40">
      <div className="container mx-auto">
        <div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
          <div>
            <Badge>{badge}</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              {title}
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-row gap-6 w-full items-start">
                  <Check className="w-4 h-4 mt-2 text-primary" />
                  <div className="flex flex-col gap-1">
                    <p>{feature.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
