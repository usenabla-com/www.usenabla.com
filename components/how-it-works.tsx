"use client"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { SimplePricing } from '@/components/ui/simple-pricing'
import { CTA } from '@/components/ui/call-to-action'

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
    <section id="how-it-works" className="w-full py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-full space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Get in touch
            </div>
            <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
              Put good in, get good out
            </h2>
            <div className="w-full flex justify-center">
              <p className="max-w-4xl text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
              We take advantage of the best open source Rust libraries such as Goblin for binary parsing, Capstone for disassembly, and Petgraph for reachability analysis to provide you with a comprehensive view of your firmware's internals.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto mt-8 sm:mt-12">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
          {/* Step 1 */}
          <div className="w-full flex flex-col items-center space-y-3 p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">1</div>
            <h3 className="text-lg sm:text-xl font-bold text-center">Install the app</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-xs">Install Nabla into your Github environment and start your 14-day trial. No credit card required.</p>
          </div>

          {/* Step 2 */}
          <div className="w-full flex flex-col items-center space-y-3 p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">2</div>
            <h3 className="text-lg sm:text-xl font-bold text-center">Evaluate your results</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-xs">Over your 14 days, evaluate the results of your binary analysis and decide if Nabla is right for you</p>
          </div>

          {/* Step 3 */}
          <div className="w-full flex flex-col items-center space-y-3 p-4 sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">3</div>
            <h3 className="text-lg sm:text-xl font-bold text-center">Upgrade or Pass</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center max-w-xs">At the end of 14 days, if you like your results then you can purchase a plan or persue other options</p>
          </div>
        </div>

        {/* Calendar Embed with Scroll on Mobile 
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
          </div>*/}

          {/* Pricing Section */}
          <SimplePricing />

          {/* Blog Section 
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
          */}
        <CTA 
        badge="Ready to Start?"
        title="Secure your firmware today"
        description="Get comprehensive binary analysis, vulnerability detection, and SBOM generation for your embedded systems
and IoT devices. Start protecting your firmware with our advanced security platform."
        primaryButtonText="Install the GitHub App"
        primaryButtonTextMobile="Install App"
        secondaryButtonText="Book a Demo"
        secondaryButtonTextMobile="Book Demo"
        primaryButtonHref="https://github.com/apps/nabla-secure/"
        secondaryButtonHref="https://cal.com/jbohrman/30-min"
      />
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
