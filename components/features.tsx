import { Code, FileText, Zap, Sparkles } from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm text-purple-600 dark:text-purple-300">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simplify Protocol Implementation
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI-powered platform transforms complex technical specifications into usable code and services.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold">RFC Parsing</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatically parse and understand complex RFC documents and technical specifications.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Code className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold">Code Generation</h3>
            <p className="text-sm text-muted-foreground text-center">
              Generate production-ready code implementations from protocol specifications.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold">Fast Integration</h3>
            <p className="text-sm text-muted-foreground text-center">
              Reduce implementation time from months to days with our AI-powered tools.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="text-xl font-bold">Intelligent Testing</h3>
            <p className="text-sm text-muted-foreground text-center">
              Automatically generate test cases and validation suites for your implementations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
