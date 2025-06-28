"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, LogIn, LogOut, User, ChevronDown } from "lucide-react"
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
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false)
  const { user, loading, signOut } = useAuth()

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

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium">Tools & Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[200px]">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tools"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Tools (coming soon)</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get access to our exclusive creations
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {loading ? (
            <Button variant="outline" disabled className="hidden sm:flex">
              Loading...
            </Button>
          ) : user ? (
            <>
              {/* Desktop Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Button variant="outline" className="gap-2 max-w-[200px]">
                    <User size={16} />
                    <span className="truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.id}`}>
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Profile Button */}
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
                className="md:hidden gap-1 px-2"
              >
                <User size={14} />
                <ChevronDown size={12} className={`transition-transform ${isMobileProfileOpen ? 'rotate-180' : ''}`} />
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)} variant="outline" className="gap-2 hidden sm:flex">
              <LogIn size={16} />
              Sign In
            </Button>
          )}

          <button 
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors" 
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
                href="#features"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              
              {/* Tools & Resources section for mobile */}
              <div className="py-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Tools & Resources</div>
                <div className="pl-4 border-l-2 border-muted space-y-2">
                  <Link
                    href="/tools"
                    className="block py-1 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tools (coming soon)
                  </Link>
                </div>
              </div>
              
              {/* Auth buttons for mobile when not logged in */}
              {!user && (
                <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2" 
                    onClick={() => {
                      setIsLoginModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogIn size={16} />
                    Sign In
                  </Button>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => {
                      setIsLoginModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    Get Started
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
