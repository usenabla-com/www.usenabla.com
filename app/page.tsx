import { HeroSection } from "@/components/hero-section"
import { Navbar } from "@/components/navbar"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}
