"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, Settings, BookOpen, Briefcase, Mail, PhoneCallIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/product/about"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">About</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        The influences that went into building Nabla over traditional static analysis-based security tools
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/product/features"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Features</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Comprehensive security automation features
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/product/cli"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Github App</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Our LLM-driven binary analysis tool for firmware security
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/industries/iot"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">IoT</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Firmware analysis for conntected devices
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/industries/healthcare"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Healthcare</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        DICOM and healthcare firmware analysis
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/industries/automotive"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Automotive</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Automotive firmware analysis and security
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Button
            className="gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 button-gradient-hover"
            onClick={() => window.open('https://github.com/apps/nabla-secure/', '_blank')}
          >
            <GitHubLogoIcon />
            Install the App
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
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
                href="/#features"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase size={16} />
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={16} />
                How It Works
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
                href="https://cal.com/team/atelier-logos/45-min-intro-call"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail size={16} />
                Schedule a 45-min Chat
              </Link>

              {/* Action buttons */}
              <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-background/90 hover:bg-primary hover:text-white dark:hover:text-white border-2 border-primary/20 hover:border-primary font-medium shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                  onClick={() => {
                    window.open('https://cal.com/jbohrman/30-min', '_blank')
                    setIsMenuOpen(false)
                  }}
                >
                  <PhoneCallIcon size={16} />
                  Schedule Call
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
