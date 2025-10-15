"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, BookOpen, Briefcase, Mail, PhoneCallIcon, BookIcon, NotebookIcon, Key, KeyIcon, KeyRound, LigatureIcon, LightbulbIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useAnalytics } from '@/hooks/use-analytics'
import { useEffect } from "react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [titleNumber, setTitleNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});
  
  useEffect(() => {
        // Capture PostHog identifiers for checkout metadata and return params
        const ph = (window as any).posthog;
        const posthogId = ph?.get_distinct_id?.();
        const sessionId = ph?.get_session_id?.();
        setPosthogInfo({ id: posthogId, sessionId });
      }, []);
  
      const handleCheckout = () => {
        try {
          setLoading(true);
          const url = new URL(window.location.href);
          const params = new URLSearchParams(url.search);
          if (posthogInfo.id && !params.has("posthog_id")) params.set("posthog_id", posthogInfo.id);
          if (posthogInfo.sessionId && !params.has("session_id")) params.set("session_id", posthogInfo.sessionId);
          const qs = params.toString();
          router.push(`/onboarding${qs ? `?${qs}` : ""}`);
        } finally {
          setLoading(false);
        }
      };
    useAnalytics().page()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Nabla Logo" width={40} height={40} className="dark:brightness-110" />
            <span className="text-xl font-bold">Nabla</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Use Cases</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/use-cases/excel-automation"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt__gdZwhO3aSPCNy6b8HwnR5E5AARVCA1wQ&sg" alt="Excel Icon" className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Excel Compliance Automation</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Programmatically enrich reports without leaving Excel
                        </p>
                      </Link>
                    </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                      <Link
                        href="/use-cases/firmware-security"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <img src="https://cdn-icons-png.freepik.com/512/10817/10817532.png" alt="Firmware Icon" className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Firmware Security</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Deep inspect, assess, and secure your device firmware
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/use-cases/diagrams-as-code"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Mermaid_Logo.svg/2048px-Mermaid_Logo.svg.png" alt="Firmware Icon" className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Mermaid Diagrans</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Create your own custom Drata-like dashboards for 90% less effort
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

             <NavigationMenuItem>
              <NavigationMenuTrigger>Alternative To</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/vs/drata"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <img src="https://d3cfmt5dlbf1me.cloudfront.net/app_ecosystem/apps/logos/000/000/103/original/Drata-Logo.svg?1609778497" alt="Excel Icon" className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Drata</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Not just another checkbox engine
                        </p>
                      </Link>
                    </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                      <Link
                        href="/vs/paramify"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <img src="https://d7umqicpi7263.cloudfront.net/img/product/df5aea50-c7eb-45f0-863b-570fd4ab3a03.com/d863d078679bdc220426b682ff8e6b06" alt="Firmware Icon" className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Paramify</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          A Evidence Fabric vs a documentation vault
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://docs.usenabla.com"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Documentation</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Complete guides and API reference
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/blog"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Blog</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Latest updates and articles
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Community</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        href="https://discord.gg/SYwGtsBT6S"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <DiscordLogoIcon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Discord</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Join our community on Discord
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="https://cal.com/team/nabla/nabla-pilot-interest-call"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Get a API Key</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Start a 14-day trial
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/blog"
            className="text-sm font-medium hover:text-primary transition-colors px-3 py-2"
          >
            Blog
          </Link>
          <Button
            className="gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleCheckout}
          >
            <KeyRound />
            Get a 14-day trial
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            className="p-2 hover:bg-accent rounded-md transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4">
            {/* Navigation Links */}
            <nav className="space-y-3">
              <Link
                href="/vs/drata"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <img src="https://static.vecteezy.com/system/resources/thumbnails/027/179/363/small/microsoft-excel-icon-logo-symbol-free-png.png" width={16} />
                Excel Enrichment
              </Link>
              <Link
                href="https://docs.usenabla.com"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={16} />
                Docs
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={16} />
                Blog
              </Link>
              <Link
                href="mailto:trial@usenabla.com"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail size={16} />
                Get a 30-day Trial License
              </Link>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-background/90 hover:bg-primary hover:text-white dark:hover:text-white border-2 border-primary/20 hover:border-primary font-medium shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                  onClick={() => {
                    window.open('https://discord.gg/SYwGtsBT6S', '_blank')
                    setIsMenuOpen(false)
                  }}
                >
                  <DiscordLogoIcon />
                  Join the Discord
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
