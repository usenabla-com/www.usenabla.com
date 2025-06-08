"use client"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface BlogPost {
  id: string
  title: string
  summary: string
  author: string
  published: string
  image: string
  tags: string[]
  content: string
  url: string
}

interface ProjectCardProps {
  title: string
  description: string
  tag: string
  link: string
}

export function HowItWorks() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        const posts = await response.json()
        setBlogPosts(posts.slice(0, 3)) // Get only the first 3 posts
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-black px-3 py-1 text-sm text-white">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Human-first AI pairings
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We love LLM's, but we know they work best when they are paired with a skilled human engineer who treats the development process as a collaborative endeavor, as opposed to an AI spray and pray.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Schedule a call</h3>
              <p className="text-sm text-muted-foreground text-center">
                Schedule a call with me to discuss your implementation needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Send information</h3>
              <p className="text-sm text-muted-foreground text-center">
                Send me relevant informational materials.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Receive a proposal</h3>
              <p className="text-sm text-muted-foreground text-center">
                Receive a proposal for your project.
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 mt-6 text-center">Our Blog</h3>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="bg-muted rounded-md aspect-video mb-4 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-muted rounded animate-pulse mb-1"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="flex flex-col gap-2 hover:opacity-75 cursor-pointer"
                    onClick={() => router.push(post.url)}
                  >
                    <div className="bg-muted rounded-md aspect-video mb-4 flex items-center justify-center overflow-hidden">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">📝</span>
                      )}
                    </div>
                    <h3 className="text-xl tracking-tight">{post.title}</h3>
                    <p className="text-muted-foreground text-base">
                      {post.summary}
                    </p>
                    {post.published && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.published).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ title, description, tag, link }: ProjectCardProps) {
  const router = useRouter()
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md">
      <div className="absolute top-4 left-4">
        <div className="rounded-full bg-gray-100/90 dark:bg-gray-900/90 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
          {tag}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Button variant="link" onClick={() => router.push(link)} className="h-8 p-0 text-gray-600 dark:text-gray-400 gap-1 group-hover:underline">
            View details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
