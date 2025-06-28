'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, Send, Loader2, RefreshCw } from 'lucide-react'
import Pusher from 'pusher-js'
import { EnhancedMessageInput } from './enhanced-message-input'
import { URLPreview } from './url-preview'
import { MessageAttachment } from './message-attachment'
import { parseMessageContent, extractUrls } from '@/lib/url-utils'

interface ChatMessage {
  id: string
  chat_room_id: string
  sender_id: string
  sender_type: 'user' | 'support'
  message: string | null
  attachment_type?: string | null
  attachment_url?: string | null
  attachment_filename?: string | null
  attachment_size?: number | null
  attachment_mime_type?: string | null
  read_at: string | null
  created_at: string
  updated_at: string
}

interface ChatRoom {
  id: string
  user_id: string
  support_agent_id: string | null
  title: string
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
  last_message_at: string | null
}

interface ChatData {
  room: ChatRoom
  messages: ChatMessage[]
}

export function ChatComponent() {
  console.log('=== CHAT COMPONENT RENDER ===')
  
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requiresCustomer, setRequiresCustomer] = useState(false)
  const [renderKey, setRenderKey] = useState(0) // Force re-render key
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pusherRef = useRef<Pusher | null>(null)

  console.log('Component state:', { 
    hasMessages: !!chatData?.messages.length, 
    messageInput: message, 
    isLoading, 
    isSending, 
    isConnected 
  })

  // Initialize chat and Pusher
  useEffect(() => {
    initializeChat()
    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect()
      }
    }
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [chatData?.messages])

  // Debug effect to track state changes
  useEffect(() => {
    console.log('=== CHAT DATA CHANGED ===')
    console.log('Messages count:', chatData?.messages.length)
    console.log('Messages:', chatData?.messages)
    console.log('Render key:', renderKey)
    console.log('========================')
  }, [chatData?.messages, renderKey])

  const initializeChat = async () => {
    try {
      setError(null)
      setRequiresCustomer(false)
      
      // Get or create chat room
      const response = await fetch('/api/chat/room')
      
      if (!response.ok) {
        const errorData = await response.json()
        
        if (response.status === 403 && errorData.error === 'Customer access required') {
          setRequiresCustomer(true)
          setError(errorData.message || 'Customer access required for chat support')
          return
        }
        
        throw new Error(errorData.error || 'Failed to get chat room')
      }
      
      const data: ChatData = await response.json()
      setChatData(data)

      // Initialize Pusher
      if (typeof window !== 'undefined') {
        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_CHANNELS_KEY!, {
          cluster: process.env.NEXT_PUBLIC_CHANNELS_CLUSTER!
        })

        const channel = pusherRef.current.subscribe(`chat-${data.room.id}`)
        
        channel.bind('pusher:subscription_succeeded', () => {
          setIsConnected(true)
        })

        channel.bind('new-message', (newMessage: ChatMessage) => {
          setChatData(prev => {
            if (!prev) return prev
            
            // Check if message already exists (avoid duplicates)
            const messageExists = prev.messages.some(msg => msg.id === newMessage.id)
            if (messageExists) return prev
            
            // Also check if this is replacing an optimistic message
            const hasOptimisticMessage = prev.messages.some(msg => 
              msg.id.startsWith('temp-') && 
              msg.message === newMessage.message &&
              Math.abs(new Date(msg.created_at).getTime() - new Date(newMessage.created_at).getTime()) < 5000
            )
            
            if (hasOptimisticMessage) {
              // Replace optimistic message with real one
              return {
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id.startsWith('temp-') && msg.message === newMessage.message
                    ? newMessage
                    : msg
                )
              }
            }
            
            // Add new message (likely from support)
            return {
              ...prev,
              messages: [...prev.messages, newMessage]
            }
          })
        })
      }
    } catch (error) {
      console.error('Error initializing chat:', error)
      setError(error instanceof Error ? error.message : 'Failed to load chat')
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (messageText: string, attachment?: File, attachmentData?: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => {
    if ((!messageText && !attachment && !attachmentData) || !chatData || isSending) return

    setIsSending(true)
    const tempId = `temp-${Date.now()}`

    try {
      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: tempId,
        chat_room_id: chatData.room.id,
        sender_id: 'current-user',
        sender_type: 'user',
        message: messageText || null,
        attachment_type: attachmentData ? attachmentData.type : (attachment ? getAttachmentType(attachment.type) : null),
        attachment_url: attachmentData ? attachmentData.url : (attachment ? URL.createObjectURL(attachment) : null),
        attachment_filename: attachmentData ? attachmentData.filename : (attachment?.name || null),
        attachment_size: attachmentData ? attachmentData.size : (attachment?.size || null),
        attachment_mime_type: attachmentData ? attachmentData.mimeType : (attachment?.type || null),
        read_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Add optimistic message
      setChatData(prev => {
        console.log('=== UPDATING CHAT DATA ===')
        if (!prev) {
          console.log('No previous chat data - ABORT')
          return prev
        }
        
        console.log('Previous messages count:', prev.messages.length)
        const newMessages = [...prev.messages, optimisticMessage]
        console.log('New messages count:', newMessages.length)
        console.log('New messages array:', newMessages)
        
        const newChatData = {
          ...prev,
          messages: newMessages
        }
        
        console.log('Returning new chat data with messages:', newChatData.messages.length)
        return newChatData
      })

      // Force a re-render
      setRenderKey(prev => prev + 1)
      console.log('Forced re-render with key:', renderKey + 1)

      // Force scroll to bottom after optimistic update
      setTimeout(() => {
        console.log('Scrolling to bottom')
        scrollToBottom()
      }, 100)

      // Prepare request data
      const requestData: any = {
        chatRoomId: chatData.room.id
      }

      // Add message if provided
      if (messageText) {
        requestData.message = messageText
      }

      // Add attachment data if provided (from MediaRecorder)
      if (attachmentData) {
        requestData.attachment = attachmentData
      }

      // For file uploads, use FormData
      if (attachment) {
        const formData = new FormData()
        if (messageText) formData.append('message', messageText)
        formData.append('file', attachment)
        formData.append('chatRoomId', chatData.room.id)

        const response = await fetch('/api/chat/send', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          console.log('Failed to send message, removing optimistic message')
          // Remove optimistic message on error
          setChatData(prev => {
            if (!prev) return prev
            return {
              ...prev,
              messages: prev.messages.filter(msg => msg.id !== tempId)
            }
          })
          throw new Error('Failed to send message')
        }

        const result = await response.json()
        
        if (result.success) {
          // Replace optimistic message with real one
          setChatData(prev => {
            if (!prev) return prev
            const updatedMessages = prev.messages.map(msg => 
              msg.id === tempId ? result.message : msg
            )
            console.log('Replaced optimistic message with server message')
            return {
              ...prev,
              messages: updatedMessages
            }
          })
        } else {
          throw new Error(result.error || 'Failed to send message')
        }
      } else {
        // For text messages or media recorder uploads, use JSON
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })

        if (!response.ok) {
          console.log('Failed to send message, removing optimistic message')
          // Remove optimistic message on error
          setChatData(prev => {
            if (!prev) return prev
            return {
              ...prev,
              messages: prev.messages.filter(msg => msg.id !== tempId)
            }
          })
          throw new Error('Failed to send message')
        }

        const result = await response.json()
        
        if (result.success) {
          // Replace optimistic message with real one
          setChatData(prev => {
            if (!prev) return prev
            const updatedMessages = prev.messages.map(msg => 
              msg.id === tempId ? result.message : msg
            )
            console.log('Replaced optimistic message with server message')
            return {
              ...prev,
              messages: updatedMessages
            }
          })
        } else {
          throw new Error(result.error || 'Failed to send message')
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove optimistic message on error
      setChatData(prev => {
        if (!prev) return prev
        return {
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== tempId)
        }
      })
      // Note: setError is not defined in this component, so we'll skip it for now
    } finally {
      setIsSending(false)
    }
  }

  // Helper function to determine attachment type
  const getAttachmentType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType === 'application/pdf') return 'pdf'
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document'
    return 'file'
  }

  const handleFileAttached = (attachment: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => {
    // Send attachment immediately
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent
    sendMessage(message, new File([], attachment.filename || ''), attachment)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (requiresCustomer) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Customer Access Required</h3>
            <p className="text-muted-foreground mb-6">
              Chat support is exclusively available for our customers. Upgrade your account to get direct access to our support team.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full" size="lg">
              Upgrade to Customer
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Already a customer? Your account status may take a few minutes to update after payment.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error && !requiresCustomer) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => initializeChat()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!chatData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Unable to load chat. Please try again.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border border-border/50 h-full flex flex-col shadow-lg">
      <CardHeader className="border-b border-border/50 flex-shrink-0 bg-gradient-to-r from-background/50 to-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <MessageCircle className="h-5 w-5 text-primary" />
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              )}
            </div>
            <span className="text-lg font-semibold">Support Chat</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant={isConnected ? 'default' : 'secondary'} 
              className={`text-xs transition-all duration-300 ${
                isConnected ? 'bg-green-500/10 text-green-700 border-green-200' : ''
              }`}
            >
              {isConnected ? 'Live' : 'Connecting...'}
            </Badge>
            <Badge 
              variant={chatData.room.status === 'open' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {chatData.room.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col min-h-0 bg-gradient-to-b from-background/30 to-muted/10">
        {/* Messages - Scrollable area that takes available space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
          {chatData.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-10 w-10 text-primary/40" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Send us a message and we'll get back to you as soon as possible.
                </p>
              </div>
            </div>
          ) : (
            chatData.messages.map((message, index) => {
              const isUser = message.sender_type === 'user'
              const messageParts = message.message ? parseMessageContent(message.message) : []
              const urls = message.message ? extractUrls(message.message) : []
              const isLastMessage = index === chatData.messages.length - 1
              
              return (
                <div 
                  key={message.id} 
                  className={`group py-2 px-3 hover:bg-muted/30 rounded-lg transition-colors ${
                    isLastMessage ? 'animate-in slide-in-from-bottom-2' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar - Always on the left */}
                    <div className="flex-shrink-0 mt-1">
                      <Avatar className="w-9 h-9 ring-1 ring-border/20">
                        {isUser ? (
                          <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                            You
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="text-xs font-medium bg-muted/80 text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with name and timestamp */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-sm font-semibold ${
                          isUser ? 'text-primary' : 'text-foreground'
                        }`}>
                          {isUser ? 'You' : 'Support'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>

                      {/* Message text */}
                      {message.message && (
                        <div className="text-sm text-foreground leading-relaxed mb-2">
                          {messageParts.map((part, index) => (
                            <span key={index}>
                              {part.type === 'url' ? (
                                <a
                                  href={part.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium"
                                >
                                  {part.content}
                                </a>
                              ) : (
                                part.content
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* File attachment */}
                      {message.attachment_type && message.attachment_url && (
                        <div className="mb-2">
                          <MessageAttachment
                            type={message.attachment_type}
                            url={message.attachment_url}
                            filename={message.attachment_filename || 'Attachment'}
                            size={message.attachment_size || 0}
                            mimeType={message.attachment_mime_type || ''}
                          />
                        </div>
                      )}
                      
                      {/* URL Previews */}
                      {urls.length > 0 && (
                        <div className="space-y-2">
                          {urls.map((url, index) => (
                            <div key={index} className="max-w-md">
                              <URLPreview url={url} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input - Fixed at bottom */}
        <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-3 sm:p-4 flex-shrink-0">
          <div className="rounded-xl border border-border/50 bg-background/50 p-1 shadow-sm max-w-full">
            <EnhancedMessageInput
              onSendMessage={sendMessage}
              disabled={isSending}
              placeholder="Type your message..."
              chatRoomId={chatData.room.id}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 