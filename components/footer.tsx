import Link from "next/link"
import Image from "next/image"
import { siGithub, siX, siCaldotcom, siSlack} from "simple-icons"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Nabla Logo" width={32} height={32} className="dark:brightness-110" />
              <span className="text-lg font-bold">Nabla</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Shift-left platform for firmware security automation.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/Atelier-Logos/nabla" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://join.slack.com/t/atelierlogos/shared_invite/zt-384mjl0hs-X2WTb8sc1xFrrDKULcgboQ" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={siSlack.path} />
                </svg>
                <span className="sr-only">Slack</span>
              </Link>
              <Link href="https://cal.com/jbohrman/30-min" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={siCaldotcom.path} />
                </svg>
                <span className="sr-only">Cal.com</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <nav className="space-y-2">
              <Link href="/product/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                About
              </Link>
              <Link href="/product/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Features
              </Link>
              <Link href="/product/cli" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Github App
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Industries</h3>
            <nav className="space-y-2">
              <Link href="/industries/automotive" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Automotive
              </Link>
              <Link href="/industries/healthcare" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Healthcare
              </Link>
              <Link href="/industries/iot" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                IoT & Connected Devices
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <nav className="space-y-2">
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Blog
              </Link>
              <Link href="https://github.com/Atelier-Logos/nabla" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                GitHub
              </Link>
              <Link href="https://join.slack.com/t/atelierlogos/shared_invite/zt-384mjl0hs-X2WTb8sc1xFrrDKULcgboQ" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Slack Community
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Atelier Logos LLC. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
