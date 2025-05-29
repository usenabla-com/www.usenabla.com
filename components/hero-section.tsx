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
            <div className="inline-block italic px-3 py-1 text-sm text-black dark:text-white">
            “The state calls its own violence law, but that of the individual, crime.”
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Full stack solutions engineer and indie hacker
            </h1>
            <p className="text-muted-foreground md:text-xl max-w-[600px]">
              Hey there, I'm James, I'm a full stack solutions engineer that's always up for new contracts that match my skillset and values.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => window.open('https://github.com/jdbohrman-tech', '_blank')} className="gap-2">
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
              <Button onClick={() => window.open('https://cal.com/jbohrman/30-min', '_blank')} variant="outline" className="gap-2">
                Schedule a Call
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[500px] aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/face.png"
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
