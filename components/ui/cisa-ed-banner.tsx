"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ShieldAlert, XIcon, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/use-analytics"

/**
 * CISA ED-26-01 deadlines at 11:59 PM ET
 * Oct 29, 2025 23:59 ET = Oct 30, 2025 03:59:00 UTC (EDT, UTC-4)
 * Dec 03, 2025 23:59 ET = Dec 04, 2025 04:59:00 UTC (EST, UTC-5)
 */
const DEADLINES = [
  {
    key: "summary",
    label: "Summary Inventory Due",
    dueEtLabel: "Oct 29, 2025 11:59 PM ET",
    dueUtcIso: "2025-10-30T03:59:00Z",
  },
  {
    key: "detail",
    label: "Detailed Inventory Due",
    dueEtLabel: "Dec 3, 2025 11:59 PM ET",
    dueUtcIso: "2025-12-04T04:59:00Z",
  },
]

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

type Props = {
  /** Logo image URL (clicking it opens the same URL in a new tab) */
  logoUrl?: string
  /** Primary CTA handler */
  onPrimaryClick?: (deadlineKey: "summary" | "detail") => void
  /** Optional override for guidance click */
  onGuidanceClick?: () => void
  /** Hide the close button if you want the banner sticky */
  closable?: boolean
  /** Guidance href if not using onGuidanceClick */
  guidanceHref?: string
}

export default function CisaDirectiveCountdownBanner({
  logoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Seal_of_Cybersecurity_and_Infrastructure_Security_Agency.svg/1197px-Seal_of_Cybersecurity_and_Infrastructure_Security_Agency.svg.png",
  onPrimaryClick,
  onGuidanceClick,
  guidanceHref = "https://www.cisa.gov/news-events/directives/ed-26-01-mitigate-vulnerabilities-f5-devices",
  closable = true,
}: Props) {
  const [isVisible, setIsVisible] = useState(true)
  const [posthogInfo, setPosthogInfo] = useState<{ id?: string; sessionId?: string }>({});
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })
  useEffect(() => {
    const ph = (window as any).posthog;
    const posthogId = ph?.get_distinct_id?.();
    const sessionId = ph?.get_session_id?.();
    setPosthogInfo({ id: posthogId, sessionId });
  }, []);

  const analytics = useAnalytics()
  // choose the active deadline (if first passed, use second)
  const activeDeadline = useMemo(() => {
    const now = Date.now()
    const first = new Date(DEADLINES[0].dueUtcIso).getTime()
    if (now < first) return DEADLINES[0]
    return DEADLINES[1]
  }, [])

  useEffect(() => {
    const target = new Date(activeDeadline.dueUtcIso).getTime()
    const tick = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeDeadline.dueUtcIso])

  if (!isVisible) return null

  const format = (n: number) => n.toString().padStart(2, "0")

  return (
    <div
      className="w-full mx-auto grid gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl border-blue-200/60 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 shadow-sm
                 grid-cols-1 md:grid-cols-[1fr_auto_auto] items-center"
      role="region"
      aria-label="CISA Emergency Directive countdown"
    >
      {/* Left: Logo + Heading (wraps on mobile) */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <a
          href={logoUrl}
          target="_blank"
          rel="noreferrer"
          className="relative h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded overflow-hidden ring-1 ring-blue-200/60 dark:ring-blue-800/60 bg-white"
          aria-label="Open CISA seal in new tab"
        >
          <Image src={logoUrl} alt="CISA logo" fill sizes="40px" className="object-contain p-1" />
        </a>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ShieldAlert className="text-blue-700 dark:text-blue-300" size={16} />
            <p className="text-[13px] sm:text-sm md:text-base font-semibold text-blue-900 dark:text-blue-100 truncate">
              CISA Emergency Directive (F5) — {activeDeadline.label}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs md:text-sm text-blue-900/80 dark:text-blue-100/80 mt-0.5">
            Due <span className="font-medium">{activeDeadline.dueEtLabel}</span> • Submit using the CISA template.
          </p>
        </div>
      </div>

      {/* Center: Countdown (scrollable on very small screens) */}
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 font-mono overflow-x-auto no-scrollbar px-0.5 -mx-0.5 md:mx-0 md:px-0">
        {timeLeft.days > 0 && <TimeBlock value={format(timeLeft.days)} label="Days" />}
        <TimeBlock value={format(timeLeft.hours)} label="Hours" />
        <TimeBlock value={format(timeLeft.minutes)} label="Minutes" />
        <TimeBlock value={format(timeLeft.seconds)} label="Seconds" />
      </div>

      {/* Right: CTAs + Close (wrap on mobile) */}
      <div className="flex flex-wrap items-center justify-start md:justify-end gap-2">
        <Button
          size="sm"
          className="whitespace-nowrap bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
          onClick={() => {
            analytics.track("cisa_ed_primary_cta_click", { deadline: activeDeadline.key })
            if (onPrimaryClick) return onPrimaryClick(activeDeadline.key as "summary" | "detail") 
            window.open("https://cal.com/team/nabla/emergency-directive-scan", "_blank", "noreferrer")
          }}
        >
          Schedule an emergency scan
        </Button>

        <Button
          size="sm"
          variant="outline"
          className="whitespace-nowrap"
          onClick={() => {
            if (onGuidanceClick) return onGuidanceClick()
            if (guidanceHref) window.open(guidanceHref, "_blank", "noreferrer")
          }}
        >
          Guidance <ExternalLink size={14} className="ml-1" />
        </Button>

        {closable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            aria-label="Close banner"
            className="text-blue-900/60 dark:text-blue-100/60 hover:text-blue-900 dark:hover:text-blue-50"
          >
            <XIcon size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg
                 bg-white/80 dark:bg-blue-900/40 border border-blue-200/60 dark:border-blue-800/60
                 min-w-[48px] sm:min-w-[54px]"
    >
      <span className="text-sm sm:text-base md:text-lg font-extrabold text-blue-900 dark:text-blue-50 leading-none">
        {value}
      </span>
      <span className="text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wide text-blue-900/70 dark:text-blue-100/70">
        {label}
      </span>
    </div>
  )
}

/* Optional: hide scrollbars for a cleaner mobile look (Tailwind plugin or global CSS)
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
*/
