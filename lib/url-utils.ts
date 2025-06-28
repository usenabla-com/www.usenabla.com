// URL detection regex - matches http/https URLs
const URL_REGEX = /(https?:\/\/[^\s]+)/g

/**
 * Extract URLs from a text message
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX)
  return matches || []
}

/**
 * Check if a message contains URLs
 */
export function hasUrls(text: string): boolean {
  return URL_REGEX.test(text)
}

/**
 * Replace URLs in text with clickable links (for rendering)
 */
export function linkifyText(text: string): string {
  return text.replace(URL_REGEX, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
}

/**
 * Split message into text parts and URL parts for rendering
 */
export function parseMessageContent(text: string): Array<{ type: 'text' | 'url', content: string }> {
  const parts: Array<{ type: 'text' | 'url', content: string }> = []
  let lastIndex = 0
  
  const matches = Array.from(text.matchAll(URL_REGEX))
  
  for (const match of matches) {
    // Add text before URL
    if (match.index! > lastIndex) {
      const textContent = text.slice(lastIndex, match.index!)
      if (textContent) {
        parts.push({ type: 'text', content: textContent })
      }
    }
    
    // Add URL
    parts.push({ type: 'url', content: match[0] })
    lastIndex = match.index! + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex)
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText })
    }
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content: text }]
} 