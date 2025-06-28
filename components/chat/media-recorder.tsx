'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, Video, Square, Play, Pause, Trash2, Send, Loader2 } from 'lucide-react'

interface MediaRecorderProps {
  chatRoomId: string
  onMediaUploaded: (attachment: {
    type: string
    url: string
    filename: string
    size: number
    mimeType: string
  }) => void
  disabled?: boolean
  className?: string
}

type RecordingType = 'audio' | 'video' | null
type RecordingState = 'idle' | 'recording' | 'stopped' | 'uploading'

export function MediaRecorder({ chatRoomId, onMediaUploaded, disabled = false, className = '' }: MediaRecorderProps) {
  const [recordingType, setRecordingType] = useState<RecordingType>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    return () => {
      stopRecording()
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current = null
    }
  }

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      setError(null)
      setRecordingType(type)
      
      const constraints = type === 'audio' 
        ? { audio: true }
        : { audio: true, video: { width: 640, height: 480 } }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      // Show preview for video
      if (type === 'video' && previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream
        previewVideoRef.current.play()
      }

      // Create MediaRecorder with proper options
      let mediaRecorder: MediaRecorder
      
      try {
        // Try with preferred codec first
        const preferredMimeType = type === 'audio' 
          ? 'audio/webm;codecs=opus' 
          : 'video/webm;codecs=vp8,opus'
        
        if (window.MediaRecorder.isTypeSupported(preferredMimeType)) {
          mediaRecorder = new window.MediaRecorder(stream, { mimeType: preferredMimeType })
        } else {
          // Fallback to basic type
          const fallbackMimeType = type === 'audio' ? 'audio/webm' : 'video/webm'
          mediaRecorder = new window.MediaRecorder(stream, { mimeType: fallbackMimeType })
        }
      } catch {
        // Final fallback - no options
        mediaRecorder = new window.MediaRecorder(stream)
      }

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'audio' ? 'audio/webm' : 'video/webm'
        })
        setRecordedBlob(blob)
        setRecordingState('stopped')
        
        // Stop preview
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = null
        }
        cleanup()
      }

      mediaRecorder.start(1000) // Collect data every second
      setRecordingState('recording')
      setRecordingDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone/camera. Please check permissions.')
      setRecordingType(null)
      cleanup()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const playRecording = () => {
    if (!recordedBlob) return

    if (recordingType === 'audio') {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(URL.createObjectURL(recordedBlob))
      audioRef.current = audio
      
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    } else if (recordingType === 'video' && videoRef.current) {
      videoRef.current.src = URL.createObjectURL(recordedBlob)
      videoRef.current.onended = () => setIsPlaying(false)
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const pausePlayback = () => {
    if (recordingType === 'audio' && audioRef.current) {
      audioRef.current.pause()
    } else if (recordingType === 'video' && videoRef.current) {
      videoRef.current.pause()
    }
    setIsPlaying(false)
  }

  const discardRecording = () => {
    setRecordedBlob(null)
    setRecordingType(null)
    setRecordingState('idle')
    setRecordingDuration(0)
    setIsPlaying(false)
    setError(null)
    cleanup()
  }

  const uploadRecording = async () => {
    if (!recordedBlob || !recordingType) return

    setRecordingState('uploading')

    try {
      const formData = new FormData()
      const extension = recordingType === 'audio' ? 'webm' : 'webm'
      const filename = `${recordingType}-${Date.now()}.${extension}`
      
      formData.append('file', recordedBlob, filename)
      formData.append('chatRoomId', chatRoomId)

      const response = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      if (result.success) {
        onMediaUploaded(result.attachment)
        discardRecording()
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Failed to upload recording')
      setRecordingState('stopped')
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (recordingState === 'idle') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 flex-1"
          onClick={() => startRecording('audio')}
          disabled={disabled}
          title="Record voice message"
        >
          <Mic className="h-4 w-4" />
          <span className="text-sm">Voice</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 flex-1"
          onClick={() => startRecording('video')}
          disabled={disabled}
          title="Record video message"
        >
          <Video className="h-4 w-4" />
          <span className="text-sm">Video</span>
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Recording in progress */}
      {recordingState === 'recording' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              {recordingType === 'audio' ? (
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-red-600 animate-pulse" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    Recording audio...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-600 animate-pulse" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    Recording video...
                  </span>
                </div>
              )}
              <Badge variant="destructive" className="animate-pulse font-mono">
                {formatDuration(recordingDuration)}
              </Badge>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Stop
            </Button>
          </div>

          {/* Video preview */}
          {recordingType === 'video' && (
            <div className="flex justify-center">
              <video
                ref={previewVideoRef}
                className="w-full max-w-sm rounded-lg border border-border shadow-sm"
                muted
                playsInline
              />
            </div>
          )}
        </div>
      )}

      {/* Recording stopped - preview and controls */}
      {recordingState === 'stopped' && recordedBlob && (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              {recordingType === 'audio' ? (
                <Mic className="h-5 w-5 text-primary" />
              ) : (
                <Video className="h-5 w-5 text-primary" />
              )}
              <div>
                <span className="text-sm font-medium text-foreground">
                  {recordingType} recorded
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {formatDuration(recordingDuration)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Video preview */}
          {recordingType === 'video' && (
            <div className="flex justify-center">
              <video
                ref={videoRef}
                className="w-full max-w-sm rounded-lg border border-border shadow-sm"
                controls={false}
                playsInline
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? pausePlayback : playRecording}
                className="gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={discardRecording}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Discard
              </Button>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={uploadRecording}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {recordingState === 'uploading' && (
        <div className="flex items-center justify-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-foreground">Uploading {recordingType}...</span>
        </div>
      )}
    </div>
  )
} 