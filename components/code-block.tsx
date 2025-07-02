'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  title?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  children, 
  language = 'text', 
  filename, 
  title,
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      'js': 'JavaScript',
      'javascript': 'JavaScript',
      'ts': 'TypeScript',
      'typescript': 'TypeScript',
      'jsx': 'JSX',
      'tsx': 'TSX',
      'python': 'Python',
      'py': 'Python',
      'rust': 'Rust',
      'rs': 'Rust',
      'bash': 'Bash',
      'sh': 'Shell',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML',
      'toml': 'TOML',
      'http': 'HTTP',
      'curl': 'cURL',
      'md': 'Markdown',
      'mdx': 'MDX'
    }
    return labels[lang.toLowerCase()] || lang.toUpperCase()
  }

  // Map language aliases to syntax highlighter supported languages
  const getSyntaxLanguage = (lang: string) => {
    const langMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rs': 'rust',
      'sh': 'bash',
      'yml': 'yaml',
      'curl': 'bash',
      'http': 'http'
    }
    return langMap[lang.toLowerCase()] || lang.toLowerCase()
  }

  const syntaxLanguage = getSyntaxLanguage(language)
  
  return (
    <div className="relative group my-6">
      {/* Header */}
      {(title || filename || language) && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-t-lg px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-foreground font-medium font-sans">
                {filename}
              </span>
            )}
            {title && !filename && (
              <span className="text-foreground font-medium font-sans">
                {title}
              </span>
            )}
            {language && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium font-sans">
                {getLanguageLabel(language)}
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 font-sans"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 font-sans" />
            )}
          </Button>
        </div>
      )}
      
      {/* Code content */}
      <div className="relative">
        {!title && !filename && !language && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 z-10 font-sans"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-slate-400 hover:text-slate-200 font-sans" />
            )}
          </Button>
        )}
        
        <SyntaxHighlighter
          language={syntaxLanguage}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            borderRadius: (title || filename || language) ? '0 0 0.5rem 0.5rem' : '0.5rem',
            border: '1px solid hsl(var(--border))',
            borderTop: (title || filename || language) ? 'none' : '1px solid hsl(var(--border))'
          }}
          lineNumberStyle={{
            color: 'hsl(var(--muted-foreground))',
            paddingRight: '1rem',
            userSelect: 'none'
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
