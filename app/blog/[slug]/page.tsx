import { getPostData, getAllPosts } from '@/lib/blog'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShareButtons } from '@/components/share-buttons'
import { ShareWidget } from '@/components/share-widget'
import { CTA } from '@/components/ui/call-to-action'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostData(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.usenabla.com'
  const postUrl = `${baseUrl}/blog/${params.slug}`
  
  // Ensure the image URL is absolute
  const imageUrl = post.image.startsWith('http') 
    ? post.image 
    : `${baseUrl}${post.image}`

  return {
    title: `${post.title} | Nabla Blog`,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: post.author }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: postUrl,
      siteName: 'Nabla',
      type: 'article',
      publishedTime: post.published,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/jpeg',
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [imageUrl],
      creator: '@atelierlogos',
      site: '@atelierlogos',
    },
    alternates: {
      canonical: postUrl,
    },
    other: {
      // Additional meta tags for better social media compatibility
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:type': 'image/jpeg',
      'twitter:label1': 'Written by',
      'twitter:data1': post.author,
      'twitter:label2': 'Reading time',
      'twitter:data2': '5 min read',
      'article:author': post.author,
      'article:published_time': post.published,
      'article:tag': post.tags.join(', '),
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostData(params.slug)

  if (!post) {
    notFound()
  }

  // Create the full URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.usenabla.com'
  const postUrl = `${baseUrl}/blog/${params.slug}`

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <article className="py-16 lg:py-24">
        <div className="container max-w-4xl px-4 md:px-6">
          <header className="mb-12">
            <h1 className="text-4xl font-semibold tracking-tight lg:text-5xl mb-8 leading-tight text-foreground">
              {post.title}
            </h1>

            <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border/50 mb-8 shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                <span className="text-lg font-semibold text-muted-foreground">
                  {post.author.charAt(0)}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{post.author}</span>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.published).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </header>

          <div className="max-w-none">
            {post.content}
          </div>
          
          {/* Share buttons section - hidden on mobile */}
          <div className="mt-12 lg:mt-16 pt-8 border-t border-border hidden sm:block">
            <ShareButtons 
              url={postUrl}
              title={post.title}
              description={post.summary}
            />
          </div>
          
          {/* Article footer */}
          <footer className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Published by <span className="font-medium text-foreground">{post.author}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground font-medium"
                  >
                    #{tag.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* CTA Section */}
      <div className="container max-w-7xl px-4 md:px-6 pb-16 lg:pb-24">
        <CTA
          badge="Ready to Start?"
          title="Start ingesting missing critical evidence today"
          description="Start a 14-day trial to begin enriching your evidence pipeline with programmatic assessments, ABDs, and firmware analysis."
          primaryButtonText="Download a evidence sample"
          primaryButtonTextMobile="Download Sample"
          secondaryButtonText="Request 30-day pilot"
          secondaryButtonTextMobile="Request Pilot"
          primaryButtonHref="https://cdn.usenabla.com/assessment_results.json"
          secondaryButtonHref="https://cal.com/team/nabla/nabla-pilot-interest-call"
        />
      </div>
      
      {/* Floating share button for mobile */}
      <ShareWidget 
        url={postUrl}
        title={post.title}
        description={post.summary}
        variant="floating"
        className="sm:hidden"
      />
      
      <Footer />
    </main>
  )
} 