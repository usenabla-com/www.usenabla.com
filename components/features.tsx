import { Code, FileText, Zap, Sparkles } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-[#f9f5ec]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-black px-3 py-1 text-sm text-white">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Get your project locked in
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Need help finishing something you vibe coded and can't seem to take to the finish line? Hire me to help you take it all the way to a fully polished solution
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-black p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Vibe Review</h3>
            <p className="text-sm text-muted-foreground text-center">
              Review your projects vibes and build a plan for any fixes
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-black p-3">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Feature Support</h3>
            <p className="text-sm text-muted-foreground text-center">
              Help implement any features and fixes you need for launch or customer needs
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-black p-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Fast Integration</h3>
            <p className="text-sm text-muted-foreground text-center">
              Reduce implementation time from months to days with my hybrid AI x Human approach.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-black p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Intelligent Testing</h3>
            <p className="text-sm text-muted-foreground text-center">
              Generate test cases and validation suites for your implementations in a fraction of the time
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
