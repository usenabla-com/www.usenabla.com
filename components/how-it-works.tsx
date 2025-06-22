"use client"
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import supabase from '@/lib/supabase/client'
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
  const [loading, setLoading] = useState(false)
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
    (async function () {
      const cal = await getCalApi({"namespace":"45-min-intro-call"});
      cal("ui", {"theme":"light","cssVarsPerTheme":{"light":{"cal-brand":"#FC4C69"},"dark":{"cal-brand":"#FC4C69"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
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
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">1</div>
            <h3 className="text-xl font-bold">Schedule a call</h3>
            <p className="text-sm text-muted-foreground text-center">Schedule a call with me to discuss your implementation needs.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">2</div>
            <h3 className="text-xl font-bold">Send information</h3>
            <p className="text-sm text-muted-foreground text-center">Send me relevant informational materials.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white text-xl font-bold">3</div>
            <h3 className="text-xl font-bold">Receive a proposal</h3>
            <p className="text-sm text-muted-foreground text-center">Receive a proposal for your project.</p>
          </div>
        </div>

        {/* Calendar Embed with Scroll on Mobile */}
          <div className="w-full mt-16 flex justify-center px-4">
            <div
              className="w-full max-w-[1100px] rounded-xl overflow-hidden shadow-md bg-white"
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
                    theme: "light",
                  }}
                />
              </div>
            </div>
          </div>
          {/* Weekly curated content signup */}
          <div className="mt-12 max-w-lg mx-auto">
            <h3 className="text-3xl font-bold mb-6 mt-6 text-center">Want weekly curated content?</h3>

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={userData.firstName}
                    onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full border rounded-lg p-3 text-sm bg-gray-50"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={userData.lastName}
                    onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full border rounded-lg p-3 text-sm bg-gray-50"
                  />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
                <textarea
                  required
                  placeholder="Tell us what kind of content you'd like..."
                  value={userData.curationPrompt}
                  onChange={(e) => setUserData(prev => ({ ...prev, curationPrompt: e.target.value }))}
                  className="w-full border rounded-lg p-3 text-sm bg-gray-50 min-h-[80px]"
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Sending...' : 'Send magic link'}
                </Button>
              </form>
            )}

            {step === 'checkEmail' && (
              <div className="text-center bg-white dark:bg-gray-900 shadow-md rounded-xl p-8">
                <p className="mb-4">We sent a magic link to <strong>{userData.email}</strong>. Check your email to verify.</p>
                <p className="text-sm text-gray-500 mb-6">After clicking the link you will be redirected automatically.</p>
                <Button onClick={handleResend} disabled={loading} variant="outline">
                  {loading ? 'Resending...' : 'Resend link'}
                </Button>
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
