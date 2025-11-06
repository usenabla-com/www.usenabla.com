"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Script from "next/script"

const frameworks = [
  "FedRAMP Rev 5",
  "FedRAMP 20x",
  "FISMA",
  "CMMC",
  "GovRAMP/TX-RAMP",
  "Partnership",
  "Other",
]

export default function ScheduleDemoPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({})

  useEffect(() => {
    // Capture PostHog identifiers for tracking
    const ph = (window as any).posthog;
    const posthogId = ph?.get_distinct_id?.();
    const sessionId = ph?.get_session_id?.();
    setPosthogInfo({ id: posthogId, sessionId });
  }, []);

  const handleFrameworkToggle = (framework: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(framework)
        ? prev.filter((f) => f !== framework)
        : [...prev, framework]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!email || !phone) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (!turnstileToken) {
      setError("Please complete the security verification")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/schedule-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone,
          frameworks: selectedFrameworks,
          "cf-turnstile-response": turnstileToken,
          posthog_id: posthogInfo.id,
          session_id: posthogInfo.sessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form")
      }

      setSuccess(true)
      // Reset form
      setEmail("")
      setPhone("")
      setSelectedFrameworks([])
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              SSP and POA&M management made easy
            </h1>

            <p className="text-lg text-muted-foreground">
              Request a demo to see the most efficient way to automate your
              compliance documentation and tasks.
            </p>

            <p className="text-lg">
              <span className="font-semibold">Save time, cut costs,</span> and manage risk better with our unique automation
              process.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Living gap assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Track standing across multiple frameworks, including FedRAMP, CMMC, GovRAMP, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Manage POA&Ms and inventory</h3>
                  <p className="text-sm text-muted-foreground">
                    Automate POA&M and inventory workbook docs with scan imports, duplicate detection, and auto risk adjustment. Don't miss deadlines with our user-friendly dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:ml-auto w-full max-w-md">
            {success ? (
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Thank you!</h2>
                <p className="text-muted-foreground">
                  We've received your request. Our team will reach out to you shortly to schedule a demo.
                </p>
                <Button onClick={() => router.push("/")} variant="outline" className="mt-4">
                  Return to Home
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Business email<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-3">
                  <Label>
                    What framework(s) are you focused on?<span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    {frameworks.map((framework) => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={framework}
                          checked={selectedFrameworks.includes(framework)}
                          onCheckedChange={() => handleFrameworkToggle(framework)}
                        />
                        <label
                          htmlFor={framework}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {framework}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Turnstile Widget */}
                <div className="flex justify-center">
                  <div
                    className="cf-turnstile"
                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    data-callback="onTurnstileSuccess"
                  />
                </div>

                <Script id="turnstile-callback">
                  {`
                    window.onTurnstileSuccess = function(token) {
                      window.turnstileToken = token;
                      const event = new CustomEvent('turnstile-success', { detail: token });
                      window.dispatchEvent(event);
                    }
                  `}
                </Script>

                <Script
                  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                  strategy="afterInteractive"
                  onLoad={() => {
                    window.addEventListener('turnstile-success', (e: any) => {
                      setTurnstileToken(e.detail)
                    })
                  }}
                />

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
