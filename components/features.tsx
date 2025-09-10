import { GitHubLogoIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Code, Microchip, Zap, Sparkles, Lock, Radar, RecycleIcon, Bot, MessageCircle, MagnetIcon, TerminalIcon, NotebookIcon, VideoOff, DotIcon, Video, ActivitySquare, ReceiptIcon, Receipt, ReceiptText } from "lucide-react"

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zm-2.4569-11.0537a4.4714 4.4714 0 0 1 2.3456-1.9765V9.74a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 .6031 7.2833zm16.5651 3.6963l-5.8428-3.3685V5.2611c0-.0804.0332-.0804.0804-.0332L15.814 7.2833a4.4992 4.4992 0 0 1 1.6464 6.1408 4.4708 4.4708 0 0 1-.5346 3.0137l-.142-.0804z"/>
  </svg>
)

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              Features
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Machine readable OSCAL reports{" "}  
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-foreground">
                to help you pass audits{" "}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Whether you just want to assess your positioning or you have an audit coming up, we can help you generate OSCAL documents in minutes, not weeks.
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16 lg:mt-20">
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <OpenAIIcon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                OpenAI Compatible
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Use hosted LLMs, GovCloud, or your own private models to analyze your firmware
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <ActivitySquare className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Live Hardware Support
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Use the `--live-mode` flag to connect real hardware over serial for controls that require live hardware
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <ReceiptText className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                SBOM Generation
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Generate SBOMs in CycloneDX formwat for your firmware images
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <NotebookIcon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                OSCAL Supercatalog
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Use our firmare supercatalog with over 122 different controls
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
