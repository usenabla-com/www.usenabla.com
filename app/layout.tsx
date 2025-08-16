import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400"],
  variable: "--font-inter",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Nabla | The shift-left platform for firmware security automation." as const,
  description: "" as const,
  generator: 'v0.dev',

  keywords: ['LLM', 'AI', 'Software Development', 'Bespoke Solutions', 'Machine Learning'],
  authors: [{ name: 'Nabla' }],
  creator: 'Nabla',
  openGraph: {
    title: "Nabla | DevSecOps for mission-critical firmware",
    description: "LLM-driven firmware security automation. Built with Rust and open source libraries.",
    url: "https://www.www.usenabla.com",
    siteName: "Nabla",
    images: [
      {
        url: "https://www.www.usenabla.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nabla - The shift-left platform for firmware security automation."
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabla | The shift-left platform for firmware security automation.",
    description: "We provide automated BCA for mission-critical firmware security",
    images: ["https://www.www.usenabla.com/og-image.png"]
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
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://www.www.usenabla.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.www.usenabla.com" />

        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f0f23" media="(prefers-color-scheme: dark)" />
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
        <link rel="preconnect" href="https://cdn.segment.com" />
        
        {/* Segment Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","screen","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware","register"];analytics.factory=function(e){return function(){if(window[i].initialized)return window[i][e].apply(window[i],arguments);var n=Array.prototype.slice.call(arguments);if(["track","screen","alias","group","page","identify"].indexOf(e)>-1){var c=document.querySelector("link[rel='canonical']");n.push({__t:"bpc",c:c&&c.getAttribute("href")||void 0,p:location.pathname,u:location.href,s:location.search,t:document.title,r:document.referrer})}n.unshift(e);analytics.push(n);return analytics}};for(var n=0;n<analytics.methods.length;n++){var key=analytics.methods[n];analytics[key]=analytics.factory(key)}analytics.load=function(key,n){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.setAttribute("data-global-segment-analytics-key",i);t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r);analytics._loadOptions=n};analytics._writeKey="HbLlxq58vFzRGhGTjykQ5HuCHwsHStCR";;analytics.SNIPPET_VERSION="5.2.0";
            analytics.load("HbLlxq58vFzRGhGTjykQ5HuCHwsHStCR");
            analytics.page();
            }}();
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-background to-background/95 text-foreground selection:bg-primary selection:text-primary-foreground`}> 
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnalyticsProvider />
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
