import Link from 'next/link'
import { ArrowRight, Code2, Zap, Shield, Globe, BookOpen, Play, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const quickStartSteps = [
  {
    step: '1',
    title: 'Get your API key',
    description: 'Schedule a call with us to get your API key.',
    href: 'https://cal.com/team/atelier-logos/ferropipe-intro'
  },
  {
    step: '2',
    title: 'Make your first request',
    description: 'Try fetching documentation for a popular Rust crate.',
    href: '/docs/ferropipe/api-reference/endpoints/crate'
  },
  {
    step: '3',
    title: 'Explore the playground',
    description: 'Test all endpoints interactively in our API playground.',
    href: '/docs/ferropipe/playground'
  }
]

const features = [
  {
    icon: Code2,
    title: 'Detailed Documentation',
    description: 'Extract comprehensive documentation for any Rust crate from crates.io'
  },
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'Optimized for speed with robust caching and 99.9% uptime'
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'API key authentication with rate limiting and usage analytics'
  },
  {
    icon: Globe,
    title: 'Global CDN',
    description: 'Served from multiple regions for optimal performance worldwide'
  }
]

const resources = [
  {
    icon: BookOpen,
    title: 'API Reference',
    description: 'Complete reference for all endpoints',
    href: '/docs/ferropipe/api-reference',
    badge: 'Essential'
  },
  {
    icon: Play,
    title: 'API Playground',
    description: 'Test endpoints interactively',
    href: '/docs/ferropipe/playground',
    badge: 'Try it'
  },
  {
    icon: HelpCircle,
    title: 'FAQ',
    description: 'Common questions and answers',
    href: '/docs/ferropipe/faq',
    badge: null
  }
]

export default function DocsPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            v1.0 API
          </Badge>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
          Ferropipe API Documentation
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-3xl">
          Extract comprehensive documentation from any Rust crate on crates.io. 
          Get structured data including examples, dependencies, and detailed API information 
          to power your Rust development tools.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="gap-2">
            <Link href="/docs/ferropipe/playground">
              <Play className="h-4 w-4" />
              Try the Playground
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/docs/ferropipe/api-reference">
              <BookOpen className="h-4 w-4" />
              View API Reference
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Start */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-6">
          Quick Start
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Get up and running with the Ferropipe API in just a few steps.
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {quickStartSteps.map((step) => (
            <Link key={step.step} href={step.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold">
                      {step.step}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-6">
          Why Choose Ferropipe?
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-0 bg-muted/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Resources */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-6">
          Essential Resources
        </h2>
        
        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((resource) => (
            <Link key={resource.title} href={resource.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <resource.icon className="h-6 w-6 text-primary flex-shrink-0" />
                    {resource.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {resource.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Example Request */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-foreground mb-6">
          Example Request
        </h2>
        <p className="text-muted-foreground mb-6 text-lg">
          Here's a simple example of fetching documentation for the popular `serde` crate:
        </p>
        
        <Card className="border-0 bg-muted/30">
          <CardContent className="p-6">
            <pre className="text-sm text-foreground overflow-x-auto">
              <code>{`curl -X GET "https://www.atelierlogos.studio/api/ferropipe/crate/serde" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Support */}
      <section>
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              Need Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Check out our FAQ or get in touch with our support team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="default">
                <Link href="/docs/ferropipe/faq">
                  View FAQ
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="https://cal.com/team/atelier-logos/ferropipe-intro">
                  Chat with us
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
