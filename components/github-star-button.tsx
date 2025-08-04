import { GitHubLogoIcon } from '@radix-ui/react-icons'

async function getGitHubStars() {
  try {
    const res = await fetch('https://api.github.com/repos/usenabla-com/nabla', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    const data = await res.json()
    return data.stargazers_count || 0
  } catch {
    return 0
  }
}

export async function GitHubStarButton() {
  const stars = await getGitHubStars()
  
  return (
    <a 
      href="https://github.com/usenabla-com/nabla" 
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors bg-background"
    >
      <GitHubLogoIcon className="h-4 w-4" />
      <span className="text-yellow-500">★</span>
      <span>{stars.toLocaleString()}</span>
    </a>
  )
}