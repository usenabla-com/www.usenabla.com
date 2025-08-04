"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeSnippetProps {
  code: string
  className?: string
}

export function CodeSnippet({ code, className = "" }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="flex items-center bg-muted/60 border border-border/30 backdrop-blur-md rounded-xl p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/20">
        <div className="flex-1 font-mono text-sm text-foreground">
          <span className="text-muted-foreground">$ </span>
          <span className="text-foreground">{code}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="ml-3 h-8 w-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      {copied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-90">
          Copied!
        </div>
      )}
    </div>
  )
}