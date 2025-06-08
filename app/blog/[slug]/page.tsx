import { getPostData, getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { notFound } from 'next/navigation'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.id,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <article className="py-32">
        <div className="container max-w-4xl">
          <header className="mb-8">
            <div className="mb-4">
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                {post.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {post.summary}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{post.author}</span>
              <span>•</span>
              <span>
                {new Date(post.published).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </header>
          
          <div className="aspect-[16/9] overflow-clip rounded-lg border border-border mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
      <Footer />
    </main>
  )
} 