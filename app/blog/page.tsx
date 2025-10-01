import { getAllPosts } from '@/lib/blog'
import { Blog8 } from '@/components/blocks/blog8'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default async function BlogPage() {
  const posts = await getAllPosts()

  // Transform our blog posts to match the Blog8 component's expected format
  const transformedPosts = posts.map(post => ({
    id: post.id,
    title: post.title,
    summary: post.summary,
    label: post.tags[0] || 'Blog', // Use first tag as label
    author: post.author,
    published: new Date(post.published).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    url: post.url,
    image: post.image,
    tags: post.tags
  }))

  return (
    <main className="min-h-screen">
      <Navbar />
      <Blog8 
        heading="Our Blog"
        description="Discover the latest insights about GRC, FedRamp, and compliance topics."
        posts={transformedPosts}
      />
      <Footer />
    </main>
  )
}
    