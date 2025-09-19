"use client"
import { CTA } from '@/components/ui/call-to-action'
import { Badge } from '@/components/ui/badge'

interface Framework {
  id: string
  title: string
  version: string
  description: string
  controlsCount: number
}

export function HowItWorks() {
  const frameworks: Framework[] = [
    {
      id: "nist-800-53r5",
      title: "NIST 800-53 Revision 5",
      version: "5.0",
      description: "Security and Privacy Controls for Information Systems and Organizations.",
      controlsCount: 47
    },
    {
      id: "etsi-en-303-645",
      title: "ETSI EN 303 645 Consumer IoT Security",
      version: "3.1.3",
      description: "European standard for cybersecurity provisions of consumer Internet of Things devices.",
      controlsCount: 13
    },
    {
      id: "fips-140-3",
      title: "FIPS 140-3 Cryptographic Module Security",
      version: "3.0",
      description: "Federal standard for security requirements for cryptographic modules used in hardware and firmware.",
      controlsCount: 38
    },
    {
      id: "fda-premarket",
      title: "FDA Premarket Cybersecurity Controls",
      version: "2025",
      description: "FDA guidance for cybersecurity in medical device design and development processes.",
      controlsCount: 24
    },
    {
      id: "nist-800-193",
      title: "NIST 800-193 Platform Firmware Resiliency",
      version: "2018",
      description: "Guidelines for platform firmware protection, detection, and recovery capabilities.",
      controlsCount: 31
    }
  ]
  return (
    <section id="how-it-works" className="w-full py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-full space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Supported Frameworks
            </div>
            <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
              Compliance Made Simple
            </h2>
            <div className="w-full flex justify-center">
              <p className="max-w-4xl text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
                Nabla supports leading security frameworks and standards to help you achieve compliance faster.
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12">
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Framework</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Version</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {frameworks.map((framework, index) => (
                    <tr key={framework.id} className="hover:bg-muted/25 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{framework.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="text-xs">
                          v{framework.version}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-muted-foreground max-w-md">
                          {framework.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {framework.controlsCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <CTA 
          badge="Ready to Start?"
          title="Tap into firmware insights you didn't know existed"
          description="Start generating deep machine readable evidence from your firmware binaries within 24 hours of your demo."
          primaryButtonText="Join Discord Community"
          primaryButtonTextMobile="Join Discord"
          secondaryButtonText="Schedule demo"
          secondaryButtonTextMobile="Contact Sales"
          primaryButtonHref="https://discord.gg/SYwGtsBT6S"
          secondaryButtonHref="https://cal.com/team/nabla/nabla-pilot-interest-callm"
        />
      </div>
    </section>
  )
}