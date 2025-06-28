import { Suspense } from 'react'
import { SupportChatDashboard } from '@/components/chat/support-dashboard'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, MessageSquare, Shield } from 'lucide-react'

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-lg border border-border/20">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Support Dashboard</h3>
          <p className="text-sm text-muted-foreground">Connecting to conversations...</p>
        </div>
      </div>
    </div>
  )
}

function AccessDeniedScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-destructive/20">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Access Restricted</h2>
          <p className="text-muted-foreground leading-relaxed">
            This support dashboard is only accessible to authorized personnel.
          </p>
        </div>
        
        <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function SupportPage({ params }: { params: { id: string } }) {
  // Only allow access to the specific support user ID
  const SUPPORT_USER_ID = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'
  
  const { id } = await params
  
  if (id !== SUPPORT_USER_ID) {
    return <AccessDeniedScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col">
      {/* Mobile App Header */}
      <div className="md:hidden">
        <div className="h-safe-area-inset-top bg-background/95 backdrop-blur-md"></div>
        <header className="bg-background/95 backdrop-blur-md border-b border-border/30 px-4 py-4 flex items-center gap-3 flex-shrink-0 shadow-sm">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm border border-primary/20">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground text-lg">Support Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage customer conversations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-xs text-muted-foreground font-medium">Live</span>
          </div>
        </header>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <header className="bg-background/95 backdrop-blur-md border-b border-border/30 px-6 py-6 flex-shrink-0 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-sm border border-primary/20">
              <MessageSquare className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Support Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage customer conversations and support requests</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
              <span className="text-sm text-muted-foreground font-medium">Live Connection</span>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full md:max-w-7xl md:mx-auto md:px-6 md:py-6">
          <div className="h-full md:bg-card/80 md:backdrop-blur-sm md:border md:border-border/50 md:rounded-3xl md:shadow-lg md:shadow-black/5 overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
              <SupportChatDashboard />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Mobile Safe Area Bottom */}
      <div className="md:hidden h-safe-area-inset-bottom bg-background/95 backdrop-blur-md flex-shrink-0"></div>
    </div>
  )
}
