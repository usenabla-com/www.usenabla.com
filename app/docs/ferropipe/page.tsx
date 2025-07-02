import Link from 'next/link'
import { ArrowRight, Database, Zap, Shield, Globe } from 'lucide-react'

export default function FerropipePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Ferropipe API
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A powerful API for extracting, analyzing, and querying Rust package documentation at scale.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Comprehensive Data</h3>
          <p className="text-sm text-muted-foreground">
            Extract structured documentation, examples, and metadata from any Rust crate
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
          <p className="text-sm text-muted-foreground">
            Cached responses and optimized extraction for sub-second API calls
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Enterprise Ready</h3>
          <p className="text-sm text-muted-foreground">
            Rate limiting, authentication, and tiered access for production use
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Global Coverage</h3>
          <p className="text-sm text-muted-foreground">
            Access to the entire crates.io ecosystem with real-time updates
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4">What is Ferropipe?</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Ferropipe is a sophisticated documentation extraction API that provides structured access to Rust package information. 
            It crawls crates.io, extracts comprehensive documentation using <code>rustdoc-text</code>, and serves it through a 
            RESTful API with multiple extraction depths and analysis levels.
          </p>
          <p>
            Whether you're building documentation tools, code analysis platforms, or training AI models on Rust code, 
            Ferropipe provides the data you need in a structured, reliable format.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Key Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Multi-Tier Extraction</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Choose from basic, full, or deep extraction levels based on your needs
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Basic:</strong> Documentation and metadata</li>
              <li>• <strong>Full:</strong> Includes source code analysis</li>
              <li>• <strong>Deep:</strong> Comprehensive examples and dependencies</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Smart Caching</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Intelligent caching system for optimal performance
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Automatic cache invalidation</li>
              <li>• Version-aware caching</li>
              <li>• Configurable freshness control</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Bulk Operations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Process multiple crates efficiently with bulk endpoints
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Batch requests for multiple crates</li>
              <li>• Popular packages endpoint</li>
              <li>• Search and discovery</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Developer Experience</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Built for developers with comprehensive tooling
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Interactive API playground</li>
              <li>• Comprehensive documentation</li>
              <li>• Multiple language examples</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Get your API key and start extracting Rust documentation data in minutes.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/docs/ferropipe/getting-started"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            href="/docs/ferropipe/playground"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border bg-background font-medium hover:bg-accent transition-colors"
          >
            Try the API Playground
          </Link>
        </div>
      </div>
    </div>
  )
}
