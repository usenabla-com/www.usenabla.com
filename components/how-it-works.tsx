"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
interface ProjectCardProps {
  title: string
  description: string
  image: string
  tag: string
  link: string
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-600 dark:text-purple-300">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Human-first AI pairings
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
             We love AI, but we know it's only good to a certain point. So our core value prop is built in a way that we can pair with AI to get the best of both worlds.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Schedule a call</h3>
              <p className="text-sm text-muted-foreground text-center">
                Schedule a call with us to discuss your implementation needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Send information</h3>
              <p className="text-sm text-muted-foreground text-center">
                Send us relevant informational materials.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Receive a proposal</h3>
              <p className="text-sm text-muted-foreground text-center">
                Receive a proposal for your project.
              </p>
            </div>
          </div>
          <div className="mt-12">
          <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image
                src="https://gettherapybirmingham.com/wp-content/uploads/7c2b0d039ffee2353e328adace8bdefe-1.webp"
                alt="Platform demonstration"
                width={800}
                height={400}
                className="object-cover"
              />
            </div>
            <h3 className="text-3xl font-bold mb-6 mt-6 text-center">Our Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <ProjectCard 
                title="hermetic-mls" 
                description="A gRPC-based delivery service for MLS messaging" 
                image="https://github.com/Hermetic-Labs/hermetic-mls/raw/main/assets/cover.png?raw=true"
                tag="encryption"
                link="https://github.com/Hermetic-Labs/hermetic-mls"
              />
              <ProjectCard 
                title="hermetic-fhe" 
                description="A Hermetic Labs implementation of OpenFHE for Fully Homomorphic Encryption" 
                image="https://github.com/Hermetic-Labs/hermetic-fhe/raw/main/assets/cover.png?raw=true"
                tag="encryption"
                link="https://github.com/Hermetic-Labs/hermetic-fhe"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ title, description, image, tag, link }: ProjectCardProps) {
  const router = useRouter()
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={225}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="absolute top-4 left-4">
        <div className="rounded-full bg-purple-100/90 dark:bg-purple-900/90 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
          {tag}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Button variant="link" onClick={() => router.push(link)} className="h-8 p-0 text-purple-600 dark:text-purple-400 gap-1 group-hover:underline">
            View details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
