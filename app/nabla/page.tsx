"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowRight, Code, Database, Book, BinaryIcon, GavelIcon, LockKeyholeIcon, CpuIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAnalytics } from "@/hooks/use-analytics"
import { useEffect } from "react"

export default function PlatformPage() {
  const analytics = useAnalytics()

  useEffect(() => {
    analytics.page("Platform Page Viewed")
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      {/* Main content */}
      <main className="relative z-10">
        <Navbar />

        <div className="bg-gradient-to-b from-background to-muted/20">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <div className="container relative py-24 sm:py-32">
              <div className="mx-auto max-w-4xl text-center">
                <Badge variant="secondary" className="mb-4 text-sm font-medium">
                  An Atelier Logos Product
                </Badge>
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                  Introducing Nabla: Detect the vectors of risk within your code
                </h1>
                <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
                  Nabla is a binary-first, fair-source, secure API for SAST/SCA tasks — designed to analyze, monitor,
                  and validate the binaries used in your tools, applications, or infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <Link href="https://cal.com/team/atelier-logos/platform-intro">
                      Chat with our team
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg hover:text-black px-8 py-6 bg-transparent"
                    asChild
                  >
                    <Link href="https://docs.atelierlogos.studio">
                      <Book className="ml-2 h-5 w-5" />
                      Read the docs
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  14-day trial available • No commitment until after trial
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-24 bg-muted/30">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Use our API to detect dark patterns of risk within your binaries
                </h2>
                <p className="text-lg text-muted-foreground">
                  Analyze, monitor, and validate the binaries used in your tools, applications, or infrastructure.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Interface Insights</CardTitle>
                    <CardDescription>Deep insights into your crate's dependencies and interface</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        JSON-structured interface analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Extract structs, enums, and functions
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Feed structured data to LLMs
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Dependency Analysis</CardTitle>
                    <CardDescription>Deep insights into your dependency tree and potential conflicts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Transitive dependency mapping
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Version conflict detection
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        License compatibility
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CpuIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>API Integration</CardTitle>
                    <CardDescription>RESTful API for seamless integration into your workflow</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        RESTful endpoints
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Webhook support
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        CI/CD integration
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <BinaryIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Binary Composition Analysis</CardTitle>
                    <CardDescription>Analyze the composition of your binary artifacts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Analyze binary composition from .wasm files and more
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Scan binaries for secrets and other sensitive data
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Generate SBOMs from binaries
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <GavelIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Fair-source </CardTitle>
                    <CardDescription>Our platform is FSL licensed with a two year MIT conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Trust our platform works like we say by viewing the source code
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        After two years, all of our code will become MIT licensed
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Learn about the FSL at{" "}
                        <a href="https://fsl.software/" target="_blank" rel="noopener noreferrer">
                          fair-core.org/fsl
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <LockKeyholeIcon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Secrets Scanning</CardTitle>
                    <CardDescription>
                      Our platform can scan and flag your binaries for secrets and other sensitive data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Secrets are flagged and highlighted in your binaries
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Secure your supply chain
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Nearly all major binary formats are supported
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
                <p className="text-lg text-muted-foreground">Choose the plan that fits your security analysis needs</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Starter Plan */}
                <Card className="border-2 hover:border-primary/50 transition-colors relative">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">Nabla Cloud</CardTitle>
                    <CardDescription className="text-base">
                      For rapid binary analysis implementation.
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$249</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <span className="text-muted-foreground">Billed annually | 14-day free trial</span>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Up to 1000 binary scans per month</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Interface insights and dependency analysis</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Basic secrets scanning</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>RESTful API access</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>14-day free trial</span>
                      </li>
                    </ul>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="https://cal.com/team/atelier-logos/platform-intro">
                        Start free trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Cloud Plan */}
                <Card className="border-2 border-black/10 transition-colors relative">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">Private Deployment</CardTitle>
                    <CardDescription className="text-base">
                      For security-critical applications
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$2600</span>
                      <span className="text-muted-foreground">/mo</span>
                    </div>
                    <span className="text-muted-foreground">+ $5k setup fee</span>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Private deployment of Nabla</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Advanced binary composition analysis</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Webhook support & CI/CD integration</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>Priority support & dedicated Slack channel</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span>14-day free trial</span>
                      </li>
                    </ul>
                    <Button className="w-full" size="lg" asChild>
                      <Link href="https://cal.com/team/atelier-logos/platform-intro">
                        Start free trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">Need more scans or custom features?</p>
                <Button variant="outline" size="lg" asChild>
                  <Link href="https://cal.com/team/atelier-logos/platform-intro">
                    Contact us for Enterprise pricing
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Ready to <span className="font-bold">λόγος</span> security into existence?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Give us a try for 14-days and see if our insights are right for your products.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <Link href="/docs">
                      <Book className="ml-2 h-5 w-5" />
                      Read the docs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg hover:text-black px-8 py-6 bg-transparent"
                    asChild
                  >
                    <Link href="https://cal.com/team/atelier-logos/platform-intro">Get a demo</Link>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">14-day free trial • No credit card required</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer with smooth transition */}
        <section className="relative bg-gradient-to-b from-muted/30 to-background">
          <Footer />
        </section>
      </main>

      {/* Decorative elements */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
    </div>
  )
}
