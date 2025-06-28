import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { useAnalytics } from '@/hooks/use-analytics'

export default function Home() {
  useAnalytics().page()
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle background patterns */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Main content */}
      <main className="relative z-10">
        <Navbar />
        
        {/* Hero Section with enhanced spacing */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
          <HeroSection />
        </section>
        
        {/* Features Section with subtle separation */}
        <section className="relative py-8 lg:py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
          <div className="relative z-10">
            <Features />
          </div>
        </section>
        
        {/* How It Works Section with distinct background */}
        <section className="relative py-8 lg:py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="absolute inset-0 bg-dot-black/[0.1] dark:bg-dot-white/[0.1] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <HowItWorks />
          </div>
        </section>
        
        {/* Footer with smooth transition */}
        <section className="relative bg-gradient-to-b from-muted/30 to-background">
          <Footer />
        </section>
      </main>
      
      {/* Decorative elements */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
    </div>
  )
}
