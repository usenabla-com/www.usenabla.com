import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Nabla Relay™" as const,
  description: "" as const,
  generator: 'v0.dev',

  keywords: ['FedRamp', 'Cloud', 'GRC', 'Compliance', 'FISMA'],
  authors: [{ name: 'Nabla' }],
  creator: 'Nabla',
  openGraph: {
    title: "Nabla Relay™",
    description: "Nabla provides programmatic compliance for vendor solutions and ConMon systems via a simple REST API. Generate FedRamp, CMMC, and FIPS evidence on-demand.",
    url: "https://www.www.usenabla.com",
    siteName: "Nabla",
    images: [
      {
        url: "https://www.usenabla.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nabla Relay™"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabla Relay™",
    description: "Nabla provides programmatic compliance for vendor solutions and ConMon systems via a simple REST API. Generate FedRamp, CMMC, and FIPS evidence on-demand.",
    images: ["https://www.usenabla.com/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const title = metadata.title as string
  const description = metadata.description as string

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nabla" />
      
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script src="https://widget.thena.ai/shim.js"></script>
        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init Fe Us zs Oe js Ns capture Ze calculateEventProperties Hs register register_once register_for_session unregister unregister_for_session Js getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Gs qs createPersonProfile Vs As Ks opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Bs debug L Ws getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                posthog.init('phc_pMEXhNKTIaOPxvG4VvbdAgnODG1HiExE3cvvGC9Rshb', {
                    api_host: 'https://us.i.posthog.com',
                    defaults: '2025-05-24',
                    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
                })
            `
          }}
        />

      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground selection:bg-primary selection:text-primary-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
