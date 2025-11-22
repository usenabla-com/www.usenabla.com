"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Cal, { getCalApi } from "@calcom/embed-react"

export default function ScheduleConsultationPage() {
  const [calProps, setCalProps] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get PostHog ID from the client SDK
    const ph = (window as any).posthog
    const posthogId = ph?.get_distinct_id?.()

    if (posthogId) {
      setCalProps({ posthog_id: posthogId })
    }
  }, [])

  useEffect(() => {
    (async function () {
      const cal = await getCalApi()
      cal("ui", {
        theme: "light",
        hideEventTypeDetails: false,
        layout: "month_view",
      })
    })()
  }, [])

  const calLink = "team/nabla/nabla-intro"

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Schedule a Consultation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book a time to speak with our team about how Nabla can help streamline
              your compliance documentation and automation needs.
            </p>
          </div>

          {/* Cal.com Embed */}
          <div className="rounded-lg border bg-card p-4 md:p-6">
            <Cal
              calLink={calLink}
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{
                layout: "month_view",
                ...calProps,
              }}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">45 Minutes</h3>
              <p className="text-sm text-muted-foreground">Quick intro call to understand your needs</p>
            </div>

            <div className="p-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">No Obligation</h3>
              <p className="text-sm text-muted-foreground">Free consultation with no commitments</p>
            </div>

            <div className="p-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">Expert Team</h3>
              <p className="text-sm text-muted-foreground">Speak directly with compliance specialists</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
