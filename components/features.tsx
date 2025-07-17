import { Code, FileText, Zap, Sparkles } from "lucide-react"

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
              Get your project{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-black">
                locked in
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Need help finishing something you vibe coded and can't seem to take to the finish line? 
              Hire me to help you take it all the way to a{" "}
              <span className="font-medium text-foreground">fully polished solution</span>
            </p>
          </div>
        </div>
        
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-16 lg:mt-20">
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Vibe Review
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Review your projects vibes and build a plan for any fixes
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Code className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Feature Support
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Help implement any features and fixes you need for launch or customer needs
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Fast Integration
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Reduce implementation time from months to days with my hybrid AI × Human approach.
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Intelligent Testing
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Generate test cases and validation suites for your implementations in a fraction of the time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
