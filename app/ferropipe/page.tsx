import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star, ArrowRight, Zap, Shield, Globe, Code, Database, Clock, Users, TrendingUp, AlertTriangle, X } from "lucide-react"

export default function FerropipePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
              Deep analysis, llms.txt generation, and dependency insights for dev tools and LLMs.
              Power your products with advanced Rust analysis of the latest dependencies and interface insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">
                  Chat with our team
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/docs/ferropipe/api-reference">
                  View API Docs
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
                <div className="text-4xl font-bold text-primary">$350</div>
                <p className="text-sm text-muted-foreground">per month, billed annually</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">100 requests/minute</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">5 crates per bulk request</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Basic depth crate intelligence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Email support</span>
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
                <div className="text-4xl font-bold text-primary">$1,500</div>
                <p className="text-sm text-muted-foreground">per month, billed annually</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">1,000 requests/minute</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">20 crates per bulk request</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Full depth crate intelligence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Interface insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
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
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-primary">$4,500</div>
                <p className="text-sm text-muted-foreground">per month, billed annually</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">5,000 requests/minute</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">100 crates per bulk request</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Deep depth crate intelligence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Flexible rate limits (contact us)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">24/7 dedicated support</span>
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

      {/* Testimonials 
      <section className="py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Trusted by Rust developers
            </h2>
            <p className="text-lg text-muted-foreground">
              See what developers are saying about Ferropipe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Ferropipe has completely changed how we manage our Rust dependencies. 
                  The security insights alone have saved us countless hours."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sarah Chen</p>
                    <p className="text-xs text-muted-foreground">Senior Rust Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "The API integration is seamless. We've built it into our CI/CD pipeline 
                  and catch issues before they reach production."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Marcus Rodriguez</p>
                    <p className="text-xs text-muted-foreground">DevOps Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  "Finally, a comprehensive tool for Rust dependency management. 
                  The quality metrics help us make better architectural decisions."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Alex Thompson</p>
                    <p className="text-xs text-muted-foreground">Tech Lead</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>*/}

      {/* FAQ Section
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Ferropipe
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate is the vulnerability scanning?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our vulnerability database is updated in real-time and includes data from multiple sources 
                  including the RustSec Advisory Database, CVE databases, and our own security research team. 
                  We maintain over 99.5% accuracy in our vulnerability detection.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I integrate Ferropipe with my existing CI/CD pipeline?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Ferropipe provides comprehensive REST APIs and webhooks that can be easily 
                  integrated into any CI/CD system. We have pre-built integrations for GitHub Actions, 
                  GitLab CI, and Jenkins, with more coming soon.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my rate limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you exceed your rate limits, additional requests will be queued for up to 5 minutes. 
                  After that, you'll receive a 429 status code. You can upgrade your plan at any time to 
                  increase your limits, and the change takes effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer custom enterprise solutions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, we offer custom enterprise solutions including on-premise deployments, 
                  custom rate limits, dedicated support, and specialized integrations. 
                  Contact our sales team to discuss your specific requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

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
                <Link href="/docs/ferropipe/getting-started">
                  Check out the docs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
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
  )
}
