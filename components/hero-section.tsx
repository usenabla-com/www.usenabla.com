"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { siGithub } from "simple-icons/icons"
import { useRouter } from "next/navigation"
export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-600 dark:text-purple-300 mb-2">
              Transforming Complexity into Simplicity
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              We transmute complex RFCs and protocols into usable services
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[600px]">
              Hermetic Labs uses AI tools to distill the essence of complex academic papers and RFCs into usable schemas and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => window.open('https://github.com/Hermetic-Labs', '_blank')} className="gap-2">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={siGithub.path} />
                </svg>
                GitHub
              </Button>
              <Button onClick={() => window.open('https://github.com/Hermetic-Labs', '_blank')} variant="outline" className="gap-2">
                Try Cloud
              </Button>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  <span className="text-xs font-medium">JD</span>
                </div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  <span className="text-xs font-medium">ST</span>
                </div>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  <span className="text-xs font-medium">RK</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">Trusted by 1,000+ developers</div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="https://images.squarespace-cdn.com/content/v1/58c46117d2b8573ccaeaafca/1671068630359-9N78DZNFKZDZIBDAGTTK/Screenshot+2022-12-14+at+5.43.35+PM.png?format=1500w"
                  alt="Hero illustration"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
