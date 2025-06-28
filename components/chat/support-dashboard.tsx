'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, Loader2, Users, Clock, ArrowLeft } from 'lucide-react'
import Pusher from 'pusher-js'
import { EnhancedMessageInput } from './enhanced-message-input'
import { URLPreview } from './url-preview'
import { MessageAttachment } from './message-attachment'
import { parseMessageContent, extractUrls } from '@/lib/url-utils'
import { MediaRecorder } from './media-recorder'
import { NotificationBell } from '@/components/notification-bell'

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

interface UserProfile {
  id: string
  full_name: string
  email: string
  profile_pic: string | null
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

interface ChatRoomWithMessages extends ChatRoom {
  messages: ChatMessage[]
  unread_count: number
  user_profile: UserProfile
}

export function SupportChatDashboard() {
  const [chatRooms, setChatRooms] = useState<ChatRoomWithMessages[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomWithMessages | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pusherRef = useRef<Pusher | null>(null)

  useEffect(() => {
    initializeDashboard()
    setupNotifications()
    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      scrollToBottom()
    }
  }, [selectedRoom?.messages])

  const initializeDashboard = async () => {
    try {
      // Get all chat rooms
      const response = await fetch('/api/chat/support-rooms')
      if (!response.ok) throw new Error('Failed to get chat rooms')
      
      const data = await response.json()
      setChatRooms(data.rooms || [])

      // Initialize Pusher for real-time updates
      if (typeof window !== 'undefined') {
        pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_CHANNELS_KEY!, {
          cluster: process.env.NEXT_PUBLIC_CHANNELS_CLUSTER!
        })

        const supportChannel = pusherRef.current.subscribe('support-dashboard')
        
        supportChannel.bind('pusher:subscription_succeeded', () => {
          setIsConnected(true)
        })

        supportChannel.bind('new-chat-room', (newRoom: ChatRoomWithMessages) => {
          setChatRooms(prev => [newRoom, ...prev])
        })

        supportChannel.bind('new-message', (data: { roomId: string; message: ChatMessage }) => {
          setChatRooms(prev => 
            prev.map(room => 
              room.id === data.roomId 
                ? { 
                    ...room, 
                    messages: [...room.messages, data.message],
                    unread_count: room.id === selectedRoom?.id ? 0 : room.unread_count + 1,
                    last_message_at: data.message.created_at
                  }
                : room
            )
          )

          if (selectedRoom?.id === data.roomId) {
            setSelectedRoom(prev => prev ? {
              ...prev,
              messages: [...prev.messages, data.message]
            } : null)
          }
        })
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupNotifications = async () => {
    try {
      // Initialize Pusher Beams for push notifications
      const PusherPushNotifications = await import('@pusher/push-notifications-web')
      const client = new PusherPushNotifications.Client({
        instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
      })
      
      await client.start()
      
      // Subscribe to support user notifications
      const SUPPORT_USER_ID = 'ec241bb3-293e-4f03-9d07-591f0208d0ad'
      await client.addDeviceInterest(`user-${SUPPORT_USER_ID}`)
      console.log(`Support dashboard registered for notifications: user-${SUPPORT_USER_ID}`)
    } catch (error) {
      console.error('Failed to setup support notifications:', error)
    }
  }

  const selectRoom = async (room: ChatRoomWithMessages) => {
    setSelectedRoom(room)
    
    // Mark messages as read
    setChatRooms(prev => 
      prev.map(r => 
        r.id === room.id 
          ? { ...r, unread_count: 0 }
          : r
      )
    )
  }

  const sendMessage = async (messageText: string, attachment?: File, attachmentData?: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => {
    // Check if we have either message text or attachment
    const hasMessage = messageText && messageText.trim()
    const hasAttachment = attachment || attachmentData
    
    if ((!hasMessage && !hasAttachment) || !selectedRoom || isSending) return

    const finalMessageText = hasMessage ? messageText.trim() : ''
    console.log('=== SUPPORT SENDING MESSAGE ===')
    console.log('Message text:', finalMessageText)
    console.log('Attachment:', attachment)
    console.log('Attachment data:', attachmentData)
    console.log('Selected room:', selectedRoom.id)

    // Create optimistic message for immediate UI update
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      chat_room_id: selectedRoom.id,
      sender_id: 'current-support', // Will be replaced with actual support user ID
      sender_type: 'support',
      message: finalMessageText || null,
      attachment_type: attachmentData?.type || (attachment ? getAttachmentType(attachment.type) : null),
      attachment_url: attachmentData?.url || (attachment ? URL.createObjectURL(attachment) : null),
      attachment_filename: attachmentData?.filename || attachment?.name || null,
      attachment_size: attachmentData?.size || attachment?.size || null,
      attachment_mime_type: attachmentData?.mimeType || attachment?.type || null,
      read_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Adding optimistic message to support dashboard:', optimisticMessage)

    // Add message optimistically to UI FIRST
    setChatRooms(prev => {
      return prev.map(room => {
        if (room.id === selectedRoom.id) {
          const updatedRoom = {
            ...room,
            messages: [...room.messages, optimisticMessage],
            last_message_at: optimisticMessage.created_at
          }
          console.log('Updated room with optimistic message:', updatedRoom.messages.length)
          return updatedRoom
        }
        return room
      })
    })

    // Update selected room state as well
    setSelectedRoom(prev => {
      if (!prev || prev.id !== selectedRoom.id) return prev
      const updated = {
        ...prev,
        messages: [...prev.messages, optimisticMessage],
        last_message_at: optimisticMessage.created_at
      }
      console.log('Updated selected room:', updated.messages.length)
      return updated
    })

    // Force scroll to bottom after optimistic update
    setTimeout(() => {
      console.log('Scrolling to bottom')
      scrollToBottom()
    }, 50)

    setIsSending(true)
    
    try {
      // For file uploads, use FormData
      if (attachment) {
        const formData = new FormData()
        if (finalMessageText) formData.append('message', finalMessageText)
        formData.append('file', attachment)
        formData.append('chatRoomId', selectedRoom.id)
        formData.append('senderType', 'support')

        const response = await fetch('/api/chat/support-send', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          console.log('Failed to send message, removing optimistic message')
          
          // Remove optimistic message on error
          setChatRooms(prev => {
            return prev.map(room => {
              if (room.id === selectedRoom.id) {
                return {
                  ...room,
                  messages: room.messages.filter(msg => msg.id !== optimisticMessage.id)
                }
              }
              return room
            })
          })
          
          setSelectedRoom(prev => {
            if (!prev || prev.id !== selectedRoom.id) return prev
            return {
              ...prev,
              messages: prev.messages.filter(msg => msg.id !== optimisticMessage.id)
            }
          })
          
          throw new Error('Failed to send message')
        }

        const result = await response.json()
        console.log('Support message sent successfully:', result)
        
        // Replace optimistic message with real message from server
        setChatRooms(prev => {
          return prev.map(room => {
            if (room.id === selectedRoom.id) {
              return {
                ...room,
                messages: room.messages.map(msg => 
                  msg.id === optimisticMessage.id ? result.message : msg
                )
              }
            }
            return room
          })
        })
        
        setSelectedRoom(prev => {
          if (!prev || prev.id !== selectedRoom.id) return prev
          return {
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === optimisticMessage.id ? result.message : msg
            )
          }
        })
      } else {
        // For text messages or media recorder uploads, use JSON
        const requestBody: any = {
          chatRoomId: selectedRoom.id
        }

        // Add message if provided
        if (finalMessageText) {
          requestBody.message = finalMessageText
        }

        // Add attachment if provided (from MediaRecorder)
        if (attachmentData) {
          requestBody.attachment = attachmentData
        }

      const response = await fetch('/api/chat/support-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        console.log('Failed to send message, removing optimistic message')
        
        // Remove optimistic message on error
        setChatRooms(prev => {
          return prev.map(room => {
            if (room.id === selectedRoom.id) {
              return {
                ...room,
                messages: room.messages.filter(msg => msg.id !== optimisticMessage.id)
              }
            }
            return room
          })
        })
        
        setSelectedRoom(prev => {
          if (!prev || prev.id !== selectedRoom.id) return prev
          return {
            ...prev,
            messages: prev.messages.filter(msg => msg.id !== optimisticMessage.id)
          }
        })
        
        throw new Error('Failed to send message')
      }

      const result = await response.json()
      console.log('Support message sent successfully:', result)
      
      // Replace optimistic message with real message from server
      setChatRooms(prev => {
        return prev.map(room => {
          if (room.id === selectedRoom.id) {
            return {
              ...room,
              messages: room.messages.map(msg => 
                msg.id === optimisticMessage.id ? result.message : msg
              )
            }
          }
          return room
        })
      })
      
      setSelectedRoom(prev => {
        if (!prev || prev.id !== selectedRoom.id) return prev
        return {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === optimisticMessage.id ? result.message : msg
          )
        }
      })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
      console.log('=== SUPPORT MESSAGE SEND COMPLETE ===')
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
    sendMessage('', undefined, attachment)
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleMediaUploaded = (attachment: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => {
    console.log('Media uploaded in support dashboard:', attachment)
    
    // Send attachment immediately
    sendMessage('', undefined, attachment)
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Loader2 className="h-3 w-3 text-primary-foreground animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-medium text-foreground mb-1">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Connecting to conversations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-background">
      {/* Mobile: Show rooms list or chat based on selection */}
      <div className="md:hidden h-full flex flex-col">
        {!selectedRoom ? (
          // Rooms List (Mobile)
          <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <div className="flex-shrink-0 px-4 py-3 bg-muted/30 border-b border-border/50">
          <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Conversations</h2>
                  <p className="text-xs text-muted-foreground">{chatRooms.length} active rooms</p>
                </div>
            <div className="flex items-center gap-2">
                  <NotificationBell />
                  <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                    {isConnected ? 'Live' : 'Connecting...'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Rooms List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {chatRooms.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="font-medium mb-2">No conversations yet</h3>
                      <p className="text-sm">New support requests will appear here</p>
                    </div>
                  ) : (
                    chatRooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 cursor-pointer transition-all active:scale-[0.98] hover:bg-card/80"
                        onClick={() => selectRoom(room)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            {room.user_profile.profile_pic ? (
                              <AvatarImage src={room.user_profile.profile_pic} alt={room.user_profile.full_name} />
                            ) : (
                              <AvatarFallback className="text-sm font-medium">
                                {room.user_profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {room.user_profile.full_name}
                              </h4>
                              {room.unread_count > 0 && (
                                <Badge variant="destructive" className="text-xs min-w-[20px] h-5 rounded-full">
                                  {room.unread_count > 99 ? '99+' : room.unread_count}
              </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {room.user_profile.email}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {room.messages.length > 0 
                                  ? formatTime(room.last_message_at || room.messages[room.messages.length - 1]?.created_at || room.created_at)
                                  : 'No messages'
                                }
                              </div>
                              <Badge
                                variant={room.status === 'open' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {room.status}
              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          // Chat View (Mobile)
          <div className="h-full flex flex-col">
            {/* Mobile Chat Header */}
            <div className="flex-shrink-0 px-4 py-3 bg-muted/30 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRoom(null)}
                  className="p-2 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  {selectedRoom.user_profile.profile_pic ? (
                    <AvatarImage src={selectedRoom.user_profile.profile_pic} alt={selectedRoom.user_profile.full_name} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {selectedRoom.user_profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{selectedRoom.user_profile.full_name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{selectedRoom.user_profile.email}</p>
                </div>
                <Badge variant={selectedRoom.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                  {selectedRoom.status}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full">
                <div className="px-3 py-2 space-y-1 pb-32">
                  {selectedRoom.messages.map((message, index) => {
                    const isSupport = message.sender_type === 'support'
                    const messageParts = message.message ? parseMessageContent(message.message) : []
                    const urls = message.message ? extractUrls(message.message) : []
                    const isLastMessage = index === selectedRoom.messages.length - 1
                    
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
                            <Avatar className="w-8 h-8 ring-1 ring-border/20">
                              {isSupport ? (
                                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                                  You
                                </AvatarFallback>
                              ) : (
                                <>
                                  {selectedRoom.user_profile.profile_pic ? (
                                    <AvatarImage 
                                      src={selectedRoom.user_profile.profile_pic} 
                                      alt={selectedRoom.user_profile.full_name} 
                                    />
                                  ) : null}
                                  <AvatarFallback className="text-xs font-medium">
                                    {selectedRoom.user_profile.full_name
                                      .split(' ')
                                      .map(n => n[0])
                                      .join('')
                                      .toUpperCase()
                                      .slice(0, 2)}
                                  </AvatarFallback>
                                </>
                              )}
                            </Avatar>
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header with name and timestamp */}
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className={`text-sm font-semibold ${
                                isSupport ? 'text-primary' : 'text-foreground'
                              }`}>
                                {isSupport ? 'You' : selectedRoom.user_profile.full_name}
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
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input - Sticky */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-3 md:hidden z-50">
              <div className="pb-safe-area-inset-bottom max-w-full">
                <div className="rounded-xl border border-border/50 bg-background/50 p-1 shadow-sm">
                  <EnhancedMessageInput
                    onSendMessage={sendMessage}
                    disabled={isSending}
                    placeholder="Type your message..."
                    chatRoomId={selectedRoom.id}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden md:flex h-full">
        {/* Desktop Rooms List */}
        <div className="w-80 border-r border-border/50 bg-muted/20 flex flex-col">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="flex-shrink-0 p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-foreground">Conversations</h2>
                <div className="flex items-center gap-2">
                  <NotificationBell />
                  <Badge variant={isConnected ? 'default' : 'secondary'} className="text-xs">
                    {isConnected ? 'Live' : 'Connecting...'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{chatRooms.length} active rooms</span>
              </div>
            </div>

            {/* Desktop Rooms List */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {chatRooms.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <h3 className="font-medium mb-2">No conversations yet</h3>
                      <p className="text-sm">New support requests will appear here</p>
                    </div>
                  ) : (
                    chatRooms.map((room) => (
                      <div
                        key={room.id}
                        className={`p-3 rounded-xl cursor-pointer transition-all ${
                          selectedRoom?.id === room.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-card/50 border border-border/50 hover:bg-card/80'
                        }`}
                        onClick={() => selectRoom(room)}
                      >
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              {room.user_profile.profile_pic ? (
                                <AvatarImage src={room.user_profile.profile_pic} alt={room.user_profile.full_name} />
                              ) : (
                                <AvatarFallback className="text-xs">
                                  {room.user_profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm truncate">
                                  {room.user_profile.full_name}
                                </h4>
                                {room.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {room.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {room.user_profile.email}
                              </p>
                            </div>
                          </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {room.messages.length > 0 
                              ? formatDate(room.last_message_at || room.messages[room.messages.length - 1]?.created_at || room.created_at)
                              : 'No messages'
                            }
                          </div>
                          <Badge
                            variant={room.status === 'open' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {room.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
            </div>

        {/* Desktop Chat Area */}
        <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
              {/* Desktop Chat Header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    {selectedRoom.user_profile.profile_pic ? (
                      <AvatarImage src={selectedRoom.user_profile.profile_pic} alt={selectedRoom.user_profile.full_name} />
                    ) : (
                      <AvatarFallback>
                        {selectedRoom.user_profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{selectedRoom.user_profile.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRoom.user_profile.email}</p>
                  </div>
                  <Badge variant={selectedRoom.status === 'open' ? 'default' : 'secondary'}>
                    {selectedRoom.status}
                  </Badge>
                </div>
              </div>

              {/* Desktop Messages */}
              <div className="flex-1 overflow-hidden min-h-0">
                <ScrollArea className="h-full">
                  <div className="p-6 px-36 bg-background space-y-1 pb-32">
                      {selectedRoom.messages.map((message, index) => {
                        const isSupport = message.sender_type === 'support'
                      const messageParts = message.message ? parseMessageContent(message.message) : []
                      const urls = message.message ? extractUrls(message.message) : []
                        const isLastMessage = index === selectedRoom.messages.length - 1
                        
                        return (
                          <div 
                            key={message.id} 
                            className={`group py-2 px-4 hover:bg-muted/30 rounded-lg transition-colors ${
                              isLastMessage ? 'animate-in slide-in-from-bottom-2' : ''
                            }`}
                          >
                            <div className="flex gap-3">
                              {/* Avatar - Always on the left */}
                              <div className="flex-shrink-0 mt-1">
                                <Avatar className="w-10 h-10 ring-1 ring-border/20">
                                  {isSupport ? (
                                    <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                                      You
                                    </AvatarFallback>
                                  ) : (
                                    <>
                                      {selectedRoom.user_profile.profile_pic ? (
                                        <AvatarImage 
                                          src={selectedRoom.user_profile.profile_pic} 
                                          alt={selectedRoom.user_profile.full_name} 
                                        />
                                      ) : null}
                                      <AvatarFallback className="text-sm font-medium">
                                        {selectedRoom.user_profile.full_name
                                          .split(' ')
                                          .map(n => n[0])
                                          .join('')
                                          .toUpperCase()
                                          .slice(0, 2)}
                                      </AvatarFallback>
                                    </>
                                  )}
                                </Avatar>
                              </div>

                              {/* Message Content */}
                              <div className="flex-1 min-w-0">
                                {/* Header with name and timestamp */}
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className={`text-sm font-semibold ${
                                    isSupport ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {isSupport ? 'You' : selectedRoom.user_profile.full_name}
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
                                      <div key={index} className="max-w-lg">
                                        <URLPreview url={url} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
              </div>

              {/* Desktop Message Input - Sticky */}
              <div className="hidden md:block fixed bottom-0 left-80 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-6 shadow-lg z-10">
                <div className="max-w-none">
                  <div className="rounded-xl border border-border/50 bg-background/50 p-1 shadow-sm">
                    <EnhancedMessageInput
                    onSendMessage={sendMessage}
                    disabled={isSending}
                      placeholder="Type your message..."
                    chatRoomId={selectedRoom.id}
                    />
                  </div>
                </div>
              </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">Choose a chat room from the sidebar to start responding</p>
                  </div>
                </div>
              )}
            </div>
          </div>
    </div>
  )
} 