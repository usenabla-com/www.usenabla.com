'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, Paperclip, Loader2, X, Mic, Video, Square, Play, Pause, Trash2 } from 'lucide-react'
import { MediaRecorder } from './media-recorder'

interface EnhancedMessageInputProps {
  onSendMessage: (message: string, attachment?: File, attachmentData?: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => void
  disabled?: boolean
  placeholder?: string
  chatRoomId: string
}

export function EnhancedMessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
  chatRoomId
}: EnhancedMessageInputProps) {
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [showMediaRecorder, setShowMediaRecorder] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if ((!message.trim() && !selectedFile) || disabled || isUploading) return

    onSendMessage(message.trim(), selectedFile || undefined)
    setMessage('')
    setSelectedFile(null)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported')
      return
    }

    setSelectedFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleMediaUploaded = (attachment: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => {
    // Send the attachment data directly instead of empty message
    onSendMessage('', undefined, attachment)
    setShowMediaRecorder(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-2">
      {/* Media Recorder - Rendered above input when active */}
      {showMediaRecorder && (
        <Card className="bg-card/95 backdrop-blur-sm border border-border/50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Record voice or video message</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMediaRecorder(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <MediaRecorder
              chatRoomId={chatRoomId}
              onMediaUploaded={handleMediaUploaded}
              disabled={disabled}
              className="w-full"
            />
          </div>
        </Card>
      )}
      
      <Card className={`p-2 ${dragOver ? 'ring-2 ring-primary' : ''}`}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="space-y-2"
        >
          {/* File attachment preview */}
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border border-border/50">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1 truncate text-foreground">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled || isUploading}
                className="min-h-[40px] max-h-32 resize-none pr-24"
                rows={1}
              />
              
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                
                {/* Media Recording Buttons */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setShowMediaRecorder(!showMediaRecorder)}
                  disabled={disabled || isUploading}
                  title="Record voice or video message"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploading}
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSend}
              disabled={(!message.trim() && !selectedFile) || disabled || isUploading}
              size="sm"
              className="self-end"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 