import { Suspense } from 'react'
import { ChatComponent } from '@/components/chat/chat-component'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, User, MessageSquare } from 'lucide-react'
import { NotificationBell } from '@/components/notification-bell'

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Loader2 className="h-3 w-3 text-primary-foreground animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-foreground mb-1">Loading Profile</h3>
          <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Mobile App Header */}
      <div className="md:hidden">
        <div className="h-safe-area-inset-top bg-background"></div>
        <header className="bg-background/95 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">Your Profile</h1>
            <p className="text-xs text-muted-foreground">Chat with support anytime</p>
          </div>
          <NotificationBell />
        </header>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <header className="bg-background/95 backdrop-blur-md border-b border-border/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Profile & Support</h1>
              <p className="text-sm text-muted-foreground">Manage your account and get help when you need it</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell showText />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Welcome Section - Mobile Only */}
      <div className="md:hidden bg-muted/20 border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center border border-border/50">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Need Help?</h2>
            <p className="text-xs text-muted-foreground">Start a conversation with our support team</p>
          </div>
        </div>
      </div>

      {/* Desktop Welcome Section */}
      <div className="hidden md:block bg-muted/20 border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-border/50">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground mb-1">Welcome to Your Profile</h2>
                  <p className="text-muted-foreground">
                    This is your personal space where you can chat with our support team, 
                    get help with any questions, and manage your account preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full md:max-w-7xl md:mx-auto md:px-6 md:py-6">
          <div className="h-full md:bg-card/50 md:backdrop-blur-sm md:border md:border-border/50 md:rounded-2xl md:shadow-sm overflow-hidden">
            <Suspense fallback={<LoadingScreen />}>
              <ChatComponent />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Mobile Safe Area Bottom */}
      <div className="md:hidden h-safe-area-inset-bottom bg-background"></div>
    </div>
  )
}
