"use client"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import supabase from '@/lib/supabase'
import { useAnalytics } from '@/hooks/use-analytics'

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
  const [loading, setLoading] = useState(false)
  const [blogLoading, setBlogLoading] = useState(true)
  const router = useRouter()
  const analytics = useAnalytics()
  // Sign-up form state
  const [step, setStep] = useState<'form' | 'checkEmail'>('form')
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    curationPrompt: ''
  })

  // Handle form submit – send magic link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      localStorage.setItem('pendingUserData', JSON.stringify(userData))
      await supabase.signInWithOTP(userData.email, true)
      setStep('checkEmail')
    } catch (error) {
      console.error('Failed to send magic link:', error)
    } finally {
      setLoading(false)
    }
  }

  // Resend link
  const handleResend = async () => {
    setLoading(true)
    try {
      await supabase.signInWithOTP(userData.email, true)
    } catch (error) {
      console.error('Failed to resend link:', error)
    } finally {
      setLoading(false)
    }
  }

  // Redirect after verification
  useEffect(() => {
    const { data: { subscription } } = supabase.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/')
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/blog')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const text = await response.text()
        let posts
        try {
          posts = JSON.parse(text)
        } catch (parseError) {
          console.error('Failed to parse JSON response:', text)
          throw new Error('Invalid JSON response from server')
        }
        setBlogPosts(posts.slice(0, 3)) // Get only the first 3 posts
      } catch (error) {
        console.error('Error fetching blog posts:', error)
        setBlogPosts([]) // Set empty array on error
      } finally {
        setBlogLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"45-min-intro-call"});
      cal("ui", {"theme":"auto","cssVarsPerTheme":{"light":{"cal-brand":"#FF6B35"},"dark":{"cal-brand":"#FF6B35"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])

  return (
    <section id="how-it-works" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Get in touch
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Put good in, get good out
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            We take advantage of the best open source Rust libraries such as Goblin for binary parsing, Capstone for disassembly, and Petgraph for reachability analysis to provide you with a comprehensive view of your firmware's internals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">1</div>
            <h3 className="text-xl font-bold">Schedule a call</h3>
            <p className="text-sm text-muted-foreground text-center">Schedule a call with me to discuss your implementation needs.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">2</div>
            <h3 className="text-xl font-bold">Send information</h3>
            <p className="text-sm text-muted-foreground text-center">Send me relevant informational materials.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">3</div>
            <h3 className="text-xl font-bold">Receive a proposal</h3>
            <p className="text-sm text-muted-foreground text-center">Receive a proposal for your project.</p>
          </div>
        </div>

        {/* Calendar Embed with Scroll on Mobile */}
          <div className="w-full mt-16 flex justify-center px-4">
            <div
              className="w-full max-w-[1100px] rounded-xl overflow-hidden shadow-md bg-card"
              style={{ height: "700px", maxHeight: "90vh" }}
            >
              <div
                className="h-full overflow-y-auto"
                style={{ WebkitOverflowScrolling: "touch" }} // smooth scrolling on iOS
              >
                <Cal
                  namespace="45-min-intro-call"
                  onSubmit={() => {
                    analytics.track('Call Scheduled')
                  }}
                  calLink="team/atelier-logos/45-min-intro-call"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "600px",
                    border: "none",
                  }}
                  config={{
                    layout: "month_view",
                    theme: "auto",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Blog Section */}
          <div className="mt-12">
            <h3 className="text-3xl font-bold mb-6 mt-6 text-center">Our Blog</h3>
            {blogLoading ? (
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
            ) : blogPosts.length > 0 ? (
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
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-muted-foreground">No blog posts available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for new content!</p>
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
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {tag}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4">
          <Button variant="link" onClick={() => router.push(link)} className="h-8 p-0 text-muted-foreground gap-1 group-hover:underline">
            View details
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
