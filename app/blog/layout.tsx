import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Atelier Logos',
  description: 'Insights and tutorials about modern web development, AI integration, and software engineering best practices.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
