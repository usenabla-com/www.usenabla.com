import Link from 'next/link'
import { ArrowRight, Database, Zap, Shield, Globe } from 'lucide-react'

// Reusable Feature Card
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-muted/30 transition">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default function FerropipePage() {
  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Ferropipe Cloud
        </h1>
        <p className="text-xl text-muted-foreground">
          A powerful API for extracting, analyzing, and querying Rust package intelligence at scale.
        </p>
        <h2 className="text-3xl font-semibold text-foreground mb-4">What is Ferropipe?</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Ferropipe is a sophisticated, LLM-powered, documentation extraction API that provides structured access to Rust package information. 
            It crawls crates.io, extracts comprehensive documentation using tools like <code>cargo-audit</code>, and serves it through a 
            RESTful API with multiple extraction depths and analysis levels while enriching interfaces and structs with natural language descriptions.
          </p>
          <p>
            Whether you're building documentation tools, code analysis platforms, or training AI models on Rust code, 
            Ferropipe provides the data you need in a structured, reliable format.
          </p>
        </div>
      </section>


      {/* Top Features */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Database}
            title="Comprehensive Data"
            description="Extract structured documentation, examples, and metadata from any Rust crate"
          />
          <FeatureCard
            icon={Zap}
            title="Powerful LLM Enrichments"
            description="Cached responses and optimized extraction for sub-second API calls"
          />
          <FeatureCard
            icon={Shield}
            title="Enterprise Ready"
            description="Rate limiting, authentication, and tiered access for production use"
          />
          <FeatureCard
            icon={Globe}
            title="Global Coverage"
            description="Access to the entire crates.io ecosystem with real-time updates"
          />
        </div>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Multi-Tier Extraction',
              desc: 'Choose from basic, professional, or max extraction levels based on your needs',
              bullets: [
                '• Basic: Only crate metadata',
                '• Professional: Crate interfaces with LLM enrichments',
                '• Max: Comprehensive examples and security analysis',
              ],
            },
            {
              title: 'Smart Caching',
              desc: 'Intelligent caching system for optimal performance',
              bullets: [
                '• Automatic cache invalidation',
                '• Version-aware caching',
                '• Configurable freshness control',
              ],
            },
            {
              title: 'Security and SBOM',
              desc: 'Process multiple crates efficiently with bulk endpoints',
              bullets: [
                '• License and dependancy graph information',
                '• External crate data',
                '• Unsafe code usage data',
              ],
            },
            {
              title: 'Developer Experience',
              desc: 'Built for developers with comprehensive tooling',
              bullets: [
                '• Simple endpoints',
                '• Comprehensive documentation',
                '• Multiple language examples',
              ],
            },
          ].map((feature, i) => (
            <div key={i} className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{feature.desc}</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {feature.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Ready to get started?</h2>
        <p className="text-muted-foreground mb-6">
          Get your API key and start extracting Rust documentation data in minutes.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="https://cal.com/team/atelier-logos/ferropipe-intro"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link 
            href="https://join.slack.com/t/atelierlogos/shared_invite/zt-384mjl0hs-X2WTb8sc1xFrrDKULcgboQ"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border bg-background font-medium hover:bg-accent transition-colors"
          >
            Join the community
          </Link>
        </div>
      </section>
    </div>
  )
}
