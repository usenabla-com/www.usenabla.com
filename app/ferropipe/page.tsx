import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, ArrowRight, Zap, Shield, Globe, Code, Database, Clock, Users, TrendingUp, AlertTriangle, X, Book } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Github } from "lucide-react"

export default function FerropipePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Main content */}
      <main className="relative z-10">
        <AnnouncementBanner />
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
                  The Ultimate{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Rust Crate
                  </span>{" "}
                  Intelligence Platform
                </h1>
                <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
                  Advanced Rust crate insights and deep AI-powered crate intelligence for products and models.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">
                      Chat with our team
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg hover:text-black px-8 py-6" asChild>
                    <Link href="/docs">
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
                  Everything you need for advanced Rust crate insights
                </h2>
                <p className="text-lg text-muted-foreground">
                  Comprehensive insights and security analysis for your products Rust data
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Interface Insights</CardTitle>
                    <CardDescription>
                      Deep insights into your crate's dependencies and interface
                    </CardDescription>
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
                    <CardDescription>
                      Deep insights into your dependency tree and potential conflicts
                    </CardDescription>
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
                    <Globe className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>API Integration</CardTitle>
                    <CardDescription>
                      RESTful API for seamless integration into your workflow
                    </CardDescription>
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
              </div>
            </div>
          </section>

          {/* Comparison Chart */}
          <section className="py-24">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Why choose Ferropipe?
                </h2>
                <p className="text-lg text-muted-foreground">
                  See how we compare to other Rust ecosystem tools
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-border rounded-lg overflow-hidden">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-primary">Ferropipe</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">cargo-audit</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">cargo-outdated</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-muted-foreground">GitHub Security</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">Interface Insights</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">Dependency Analysis</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">Quality Metrics</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">API Access</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">Performance Insights</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">Real-time Monitoring</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-orange-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24 bg-muted/30">
            <div className="container">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Simple, transparent pricing
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the plan that works best for your team and projects
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Basic Plan */}
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Basic</CardTitle>
                    <div className="text-4xl font-bold text-primary">Free</div>
                    <p className="text-sm text-muted-foreground">No credit card required</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">300 requests/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Reasonable rate limits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Basic crate metadata</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Email support (if needed)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">No credit card required</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Full Plan */}
                <Card className="border-2 border-primary shadow-lg scale-105">
                  <CardHeader className="text-center">
                    <Badge className="mb-2 mx-auto">Most Popular</Badge>
                    <CardTitle className="text-2xl">Professional</CardTitle>
                    <div className="text-4xl font-bold text-primary">$560/month</div>
                    <p className="text-sm text-muted-foreground">per month, billed annually</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Unlimited requests/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">LLM-enriched crate intelligence</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Interface insights</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Vulnerability insights</span>
                      </li>
                    </ul>
                    <Button className="w-full" asChild>
                      <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Deep Plan */}
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Max</CardTitle>
                    <div className="text-4xl font-bold text-primary">$1,300/month</div>
                    <p className="text-sm text-muted-foreground">per month, billed annually</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Unlimited requests/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">LLM-enriched crate intelligence</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Self-hosting (contact us)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">CVE and security insights</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">24/7 dedicated support (if needed)</span>
                      </li>
                    </ul>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24">
            <div className="container">
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                  Ready to add better Rust intelligence to your products?
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
                  <Button size="lg" variant="outline" className="text-lg hover:text-black px-8 py-6" asChild>
                    <Link href="https://cal.com/team/atelier-logos/45-min-intro-call">
                      Get an API key
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  14-day free trial • No credit card required
                </p>
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
