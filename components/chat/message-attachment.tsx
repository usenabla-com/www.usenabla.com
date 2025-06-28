'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, File, Image, Video, Music, FileText, ExternalLink } from 'lucide-react'

interface MessageAttachmentProps {
  type: string
  url: string
  filename: string
  size: number
  mimeType: string
  className?: string
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image
  if (mimeType.startsWith('video/')) return Video
  if (mimeType.startsWith('audio/')) return Music
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function MessageAttachment({ type, url, filename, size, mimeType, className = '' }: MessageAttachmentProps) {
  const IconComponent = getFileIcon(mimeType)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // For images, show preview
  if (type === 'image') {
    return (
      <Card className={`max-w-sm ${className}`}>
        <CardContent className="p-2">
          <div className="relative group">
            <img
              src={url}
              alt={filename}
              className="w-full h-auto max-h-64 object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate flex-1">{filename}</p>
            <Badge variant="secondary" className="text-xs ml-2">
              {formatFileSize(size)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  // For videos, show video player
  if (type === 'video') {
    return (
      <Card className={`max-w-sm ${className}`}>
        <CardContent className="p-2">
          <video
            controls
            className="w-full h-auto max-h-64 rounded-lg"
            preload="metadata"
          >
            <source src={url} type={mimeType} />
            Your browser does not support the video tag.
          </video>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate flex-1">{filename}</p>
            <Badge variant="secondary" className="text-xs ml-2">
              {formatFileSize(size)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  // For audio, show audio player
  if (type === 'audio') {
    return (
      <Card className={`max-w-sm ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3 mb-2">
            <Music className="h-8 w-8 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{filename}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
            </div>
          </div>
          <audio controls className="w-full">
            <source src={url} type={mimeType} />
            Your browser does not support the audio tag.
          </audio>
        </CardContent>
      </Card>
    )
  }

  // For other files, show file card
  return (
    <Card className={`max-w-sm ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <IconComponent className="h-8 w-8 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{filename}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(size)}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 