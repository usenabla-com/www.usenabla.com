"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Menu, X, LogIn, LogOut, User, ChevronDown, Settings, BookOpen, Briefcase, Mail, MessageSquare, PhoneCallIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { siRust } from "simple-icons"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

  const [keyId, setKeyId] = useState<string | null>(null);
  const userId = user?.id;

  // Fetch the first keyId for the logged-in user
  useEffect(() => {
    const fetchKeyId = async () => {
      if (!userId) {
        console.log('No userId available');
        setKeyId(null);
        return;
      }
      try {
        console.log('Fetching keyId for userId:', userId);
        const { data, error } = await supabase.supabase
          .from("api_keys")
          .select("id")
          .eq("user_id", userId)
          .limit(1);
        
        console.log('API Keys response:', { data, error });
        
        if (error) {
          console.error('Error fetching keyId:', error);
          setKeyId(null);
        } else if (!data || data.length === 0) {
          console.log('No API keys found for user');
          setKeyId(null);
        } else {
          console.log('Found keyId:', data[0].id);
          setKeyId(data[0].id);
        }
      } catch (e) {
        console.error('Exception fetching keyId:', e);
        setKeyId(null);
      }
    };
    fetchKeyId();
  }, [userId]);

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
    setIsMobileProfileOpen(false)
  }

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen(!isMobileProfileOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Atelier Logos Logo" width={40} height={40} className="dark:brightness-110" />
            <span className="text-xl font-bold">Atelier Logos</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href="https://cal.com/team/atelier-logos/45-min-intro-call" className="text-sm font-medium hover:text-primary transition-colors">
            Schedule a 45-min Chat
          </Link>
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <Button variant="outline" disabled>
              Loading...
            </Button>
          ) : user ? (
            <>
              <Button
                variant="ghost"
                className="gap-2 hover:bg-primary/10 hover:text-primary font-medium transition-all duration-200"
                asChild
              >
                <Link href={`/dashboard?keyId=${keyId}&userId=${user.id}`}>
                  Dashboard
                </Link>
              </Button>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 max-w-[200px]">
                  <User size={16} />
                  <span className="truncate">{user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/onboarding" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="gap-2 hover:bg-primary/10 hover:text-primary font-medium transition-all duration-200"
                onClick={() => window.open('/platform', '_blank')}
              >
                Learn about the Platform
              </Button>
              <Button
                className="gap-2 bg-primary hover:bg-black text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => window.open('https://cal.com/team/atelier-logos/platform-intro', '_blank')}
              >
                <PhoneCallIcon size={16} />
                Schedule a Call
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Profile */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (!isMenuOpen) {
                  setIsMenuOpen(true)
                }
                toggleMobileProfile()
              }}
              className="gap-1 px-2"
            >
              <User size={14} />
              <ChevronDown size={12} className={`transition-transform ${isMobileProfileOpen ? 'rotate-180' : ''}`} />
            </Button>
          )}

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
            {/* Mobile Profile Section - Show when user is logged in and profile is toggled */}
            {user && isMobileProfileOpen && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center border border-primary/30">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Atelier Logos Member</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 bg-background/50 hover:bg-background border border-border/50"
                    asChild
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsMobileProfileOpen(false)
                    }}
                  >
                    <Link href={`/profile/${user.id}`}>
                      <User size={16} />
                      View Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 bg-background/50 hover:bg-background border border-border/50"
                    asChild
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsMobileProfileOpen(false)
                    }}
                  >
                    <Link href="/onboarding">
                      <Settings size={16} />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border border-red-200 dark:border-red-800"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}

            {/* Show profile prompt when user is logged in but profile section is closed */}
            {user && !isMobileProfileOpen && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-dashed border-muted-foreground/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tap profile icon to access your account</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMobileProfile}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Show
                  </Button>
                </div>
              </div>
            )}

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

              {/* Auth buttons for mobile when not logged in */}
              {!user && (
                <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full gap-2 bg-background/90 hover:bg-background border-2 border-primary/20 hover:border-primary/40 text-foreground hover:text-primary font-medium shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                    onClick={() => window.open('https://cal.com/team/atelier-logos/platform-intro', '_blank')}
                  >
                    <PhoneCallIcon size={16} />
                    Schedule a Call
                  </Button>
                  <Button
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/platform" target="_blank">
                      Learn more
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  )
}
