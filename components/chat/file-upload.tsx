'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Paperclip, X, Upload, File, Image, Video, Music, FileText } from 'lucide-react'

interface FileUploadProps {
  chatRoomId: string
  onFileUploaded: (attachment: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => void
  disabled?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  error?: string
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

export function FileUpload({ chatRoomId, onFileUploaded, disabled = false, className = '' }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      uploadFile(file)
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFile = async (file: File) => {
    // Add to uploading files list
    const uploadingFile: UploadingFile = { file, progress: 0 }
    setUploadingFiles(prev => [...prev, uploadingFile])

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatRoomId', chatRoomId)

      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadingFiles(prev => 
            prev.map(uf => 
              uf.file === file ? { ...uf, progress } : uf
            )
          )
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText)
          if (result.success) {
            onFileUploaded(result.attachment)
          } else {
            throw new Error(result.error || 'Upload failed')
          }
        } else {
          const errorResult = JSON.parse(xhr.responseText)
          throw new Error(errorResult.error || 'Upload failed')
        }
        
        // Remove from uploading files
        setUploadingFiles(prev => prev.filter(uf => uf.file !== file))
      })

      xhr.addEventListener('error', () => {
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file ? { ...uf, error: 'Upload failed' } : uf
          )
        )
      })

      xhr.open('POST', '/api/chat/upload')
      xhr.send(formData)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadingFiles(prev => 
        prev.map(uf => 
          uf.file === file ? { ...uf, error: error instanceof Error ? error.message : 'Upload failed' } : uf
        )
      )
    }
  }

  const removeUploadingFile = (file: File) => {
    setUploadingFiles(prev => prev.filter(uf => uf.file !== file))
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
        disabled={disabled}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-muted"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Uploading files preview */}
      {uploadingFiles.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 space-y-2">
          {uploadingFiles.map((uploadingFile, index) => {
            const IconComponent = getFileIcon(uploadingFile.file.type)
            
            return (
              <Card key={index} className="bg-card/95 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadingFile.file.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => removeUploadingFile(uploadingFile.file)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(uploadingFile.file.size)}
                      </p>
                      
                      {uploadingFile.error ? (
                        <p className="text-xs text-destructive">{uploadingFile.error}</p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Progress value={uploadingFile.progress} className="flex-1 h-1" />
                          <span className="text-xs text-muted-foreground">
                            {uploadingFile.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
} 