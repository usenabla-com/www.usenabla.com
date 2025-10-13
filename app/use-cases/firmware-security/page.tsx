import { PageLayout } from "@/components/page-layout"
import { Feature } from "@/components/ui/feature-with-advantages"
import { CTA } from "@/components/ui/call-to-action"
import { Shield, Cpu, FileSearch, AlertTriangle, PackageCheck, Lock, Binary, Layers, Scan, CheckCircle2 } from "lucide-react"

export default function FirmwareSecurityPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Firmware Security
                </span>
              </div>
              <div className="flex gap-4 flex-col text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tighter text-center font-regular">
                  Programmatic Binary Composition Analysis
                </h1>
                <p className="text-lg md:text-xl max-w-2xl leading-relaxed tracking-tight text-muted-foreground text-center mx-auto">
                  Automated firmware analysis, SBOM generation, and vulnerability detection for embedded systems. Know exactly what's in your binaries and prove it to auditors.
                </p>
              </div>
              <div className="flex flex-row gap-3">
                <a
                  href="https://docs.usenabla.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8"
                >
                  Start Analysis
                </a>
                <a
                  href="https://cal.com/team/nabla/nabla-pilot-interest-call"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8"
                >
                  See Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Process */}
      <div className="w-full py-20 lg:py-40 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-center text-center">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Analysis Pipeline
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-2xl font-regular">
                From firmware upload to security report
              </h2>
              <p className="text-lg max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                Our automated pipeline extracts, analyzes, and documents every component in your firmware
              </p>
            </div>

            {/* Analysis Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <Binary className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">1. Extract</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Decompress and unpack firmware images. Support for all major formats and file systems.
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        " ELF binaries
                        <br />
                        " Compressed images
                        <br />
                        " Embedded filesystems
                        <br />
                        " Boot loaders
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <Layers className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">2. Inventory</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Identify all libraries, packages, and dependencies. Build complete component catalog.
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        " Library versions
                        <br />
                        " Package managers
                        <br />
                        " Static analysis
                        <br />
                        " Signature matching
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <Scan className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">3. Scan</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Cross-reference against CVE databases. Identify known vulnerabilities and exposures.
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        " NVD database
                        <br />
                        " OSV integration
                        <br />
                        " Risk scoring
                        <br />
                        " Exploit availability
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-primary/40"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-primary/40 transform rotate-45"></div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-background border-2 border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all h-full">
                  <div className="flex flex-col gap-4">
                    <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center">
                      <PackageCheck className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">4. Report</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Generate compliance-ready SBOMs and security reports in multiple formats.
                      </p>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs font-mono text-muted-foreground">
                        " SPDX format
                        <br />
                        " CycloneDX
                        <br />
                        " JSON/CSV/Excel
                        <br />
                        " PDF reports
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Advantages */}
      <Feature
        badge="Key Capabilities"
        title="Enterprise-grade firmware analysis"
        description="Everything you need to secure your embedded systems and satisfy compliance requirements."
        features={[
          {
            title: "Automated SBOM Generation",
            description: "Generate comprehensive Software Bill of Materials in SPDX and CycloneDX formats. Meet executive order and regulatory requirements automatically."
          },
          {
            title: "Vulnerability Detection",
            description: "Identify known CVEs across all firmware components. Get CVSS scores, exploit availability, and remediation guidance."
          },
          {
            title: "Multi-Format Support",
            description: "Analyze firmware from any platform: ARM, x86, MIPS, PowerPC. Support for compressed images, filesystems, and bootloaders."
          },
          {
            title: "Control Flow Analysis",
            description: "Understand binary behavior with static and dynamic analysis. Identify dead code, hidden functions, and potential backdoors."
          },
          {
            title: "Cryptographic Analysis",
            description: "Identify weak crypto implementations, hardcoded keys, and certificate issues. Ensure your encryption is actually secure."
          },
          {
            title: "API Integration",
            description: "Integrate firmware analysis into your CI/CD pipeline. Scan every build automatically and fail on critical vulnerabilities."
          }
        ]}
      />
      {/* Use Cases */}
      <div className="w-full py-20 lg:py-40">
        <div className="container mx-auto">
          <div className="flex flex-col gap-10">
            <div className="flex gap-4 flex-col items-start">
              <div>
                <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80">
                  Common Use Cases
                </span>
              </div>
              <div className="flex gap-2 flex-col">
                <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
                  Who needs firmware security analysis?
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">IoT & Embedded Devices</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Smart home devices, industrial sensors, medical equipment. Ensure your embedded Linux or RTOS firmware is secure.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Critical Infrastructure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  SCADA systems, network appliances, industrial controllers. Meet NERC CIP and IEC 62443 compliance requirements.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Supply Chain Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Verify third-party firmware, validate vendor claims, and maintain complete chain of custody for all components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <CTA
        badge="Ready to Analyze?"
        title="Start securing your firmware today"
        description="Join organizations using automated firmware analysis to meet compliance requirements and secure their embedded systems. Generate SBOMs and vulnerability reports in minutes."
        primaryButtonText="Get API Access"
        secondaryButtonText="Schedule Analysis Demo"
        primaryButtonHref="https://docs.usenabla.com"
        secondaryButtonHref="https://cal.com/team/nabla/nabla-pilot-interest-call"
      />
    </PageLayout>
  )
}
