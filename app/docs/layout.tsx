'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, FileText, Zap, Code, HelpCircle, Play, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { 
        title: 'Introduction',
        href: '/docs',
        icon: FileText,
        description: 'Learn about Ferropipe API'
      },
      { 
        title: 'Quick Start',
        href: '/docs/ferropipe/quickstart',
        icon: Zap,
        description: 'Get up and running in 5 minutes'
      },
      { 
        title: 'API Playground',
        href: '/docs/ferropipe/playground',
        icon: Play,
        description: 'Test API endpoints interactively'
      }
    ]
  },
  {
    title: 'API Reference',
    items: [
      { 
        title: 'Crate Documentation',
        href: '/docs/ferropipe/api-reference/endpoints/crate',
        icon: Code,
        description: 'Get detailed crate information'
      },
      { 
        title: 'Bulk Documentation',
        href: '/docs/ferropipe/api-reference/endpoints/bulk',
        icon: Code,
        description: 'Get detailed bulk information'
      },
      { 
        title: 'Popular Crates',
        href: '/docs/ferropipe/api-reference/endpoints/popular',
        icon: Code,
        description: 'Discover trending crates'
      },
      { 
        title: 'Search Crates',
        href: '/docs/ferropipe/api-reference/endpoints/search',
        icon: Code,
        description: 'Search through the Rust ecosystem'
      },
    ]
  },
  {
    title: 'Support',
    items: [
        {
            title: 'Pricing',
            href: '/docs/ferropipe/pricing',
            icon: Code,
            description: 'Pricing information'
      },
      { 
        title: 'FAQ',
        href: '/docs/ferropipe/faq',
        icon: HelpCircle,
        description: 'Frequently asked questions'
      },
    ]
  }
]

function NavItem({ item, currentPath }: { item: any, currentPath: string }) {
  const isActive = currentPath === item.href
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-muted font-sans ${
        isActive 
          ? 'bg-primary/10 text-primary border-l-2 border-primary' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium font-sans">{item.title}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground mt-0.5 truncate font-sans">
            {item.description}
          </div>
        )}
      </div>
      {item.badge && (
        <Badge variant="secondary" className="text-xs font-sans">
          {item.badge}
        </Badge>
      )}
    </Link>
  )
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segments = pathname.split('/').filter(Boolean)
  
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8 font-sans">
      <Link href="/docs" className="hover:text-foreground transition-colors">
        Documentation
      </Link>
      {segments.slice(1).map((segment, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <span className="capitalize">
            {segment.replace(/-/g, ' ')}
          </span>
        </div>
      ))}
    </nav>
  )
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentPath = usePathname()

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border bg-background/50 backdrop-blur-sm">
          <div className="sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <div className="mb-8">
                <Link href="/docs" className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground font-sans">Ferropipe API</div>
                    <div className="text-xs text-muted-foreground font-sans">Documentation</div>
                  </div>
                </Link>
              </div>

              <nav className="space-y-8">
                {navigation.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-semibold text-sm text-foreground mb-3 px-3 font-sans">
                      {section.title}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem 
                          key={item.href} 
                          item={item} 
                          currentPath={currentPath}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-12 p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-semibold text-sm text-foreground mb-2 font-sans">
                  Need Help?
                </h4>
                <p className="text-xs text-muted-foreground mb-3 font-sans">
                  Schedule a 45 minute intro to get your API key and learn how to use the API.
                </p>
                <div className="space-y-2">
                  <Button size="sm" onClick={() => window.open('https://cal.com/team/atelier-logos/ferropipe-intro', '_blank')} variant="outline" className="w-full justify-start font-sans">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule a 45 minute intro
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="px-8 py-8">
              <Breadcrumbs pathname={currentPath} />
              
              <div className="prose prose-gray dark:prose-invert max-w-none font-sans">
                {children}
              </div>

              {/* Page navigation */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground font-sans">
                    Was this page helpful?
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="font-sans">
                      Yes
                    </Button>
                    <Button size="sm" variant="outline" className="font-sans">
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
