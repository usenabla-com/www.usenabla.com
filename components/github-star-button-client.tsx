"use client"

import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'

export function GitHubStarButtonClient() {
  const [stars, setStars] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStars() {
      try {
        const res = await fetch('https://api.github.com/repos/usenabla-com/nabla')
        const data = await res.json()
        setStars(data.stargazers_count || 0)
      } catch {
        setStars(0)
      } finally {
        setLoading(false)
      }
    }
    fetchStars()
  }, [])

  return (
    <a 
      href="https://github.com/usenabla-com/nabla" 
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors bg-background"
    >
      <GitHubLogoIcon className="h-4 w-4" />
      <span className="text-yellow-500">★</span>
      <span>{loading ? '...' : stars.toLocaleString()}</span>
    </a>
  )
}