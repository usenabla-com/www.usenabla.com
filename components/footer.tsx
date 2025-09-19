import Link from "next/link"
import Image from "next/image"
import { siGithub, siX, siCaldotcom, siSlack, siDiscord} from "simple-icons"
import { MailIcon } from "lucide-react"

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
              Automated GRC for mission-critical firmware compliance.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/usenabla-com" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={siGithub.path} />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://discord.gg/SYwGtsBT6S" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d={siDiscord.path} />
                </svg>
                <span className="sr-only">Slack</span>
              </Link>
              <Link href="mailto:hello@usenabla.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <MailIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Community</h3>
            <nav className="space-y-2">
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Blog
              </Link>
              <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Docs
              </Link>
              <Link href="https://discord.gg/SYwGtsBT6S" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Discord
              </Link>
            </nav>
          </div>
           <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <nav className="space-y-2">
              {/* <Link href="/trial-terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Trial Terms
              </Link> */}
              <Link href="mailto:media@usenabla.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Press
              </Link>
              <Link href="mailto:support@usenabla.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                Support
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
