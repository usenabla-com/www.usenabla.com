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
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"

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
          <ThemeToggle />
          <Button
            className="gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.open('https://discord.gg/SYwGtsBT6S', '_blank')}
          >
            <DiscordLogoIcon />
            Join the Discord
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
                href="mailto:trial@usenabla.com"
                className="flex items-center gap-3 py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail size={16} />
                Get a 14-day Trial License
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
