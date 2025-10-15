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
          <header className="mb-12 lg:mb-16">
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1 transition-colors hover:bg-muted/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl xl:text-7xl mb-6 leading-tight text-foreground">
              {post.title}
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl">
              {post.summary}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground border-l-2 border-muted pl-4">
                <span className="font-medium text-foreground">{post.author}</span>
                <span className="text-muted-foreground/60">•</span>
                <time className="font-medium">
                  {new Date(post.published).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
              {/* Mobile share button in header */}
              <div className="sm:hidden">
                <ShareWidget 
                  url={postUrl}
                  title={post.title}
                  description={post.summary}
                  variant="minimal"
                />
              </div>
            </div>
          </header>
          
          <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border/50 mb-12 lg:mb-16 shadow-sm">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
            />
          </div>

          <div 
            className="prose prose-lg lg:prose-xl dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-12 prose-h1:leading-tight
              prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:leading-tight
              prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-tight
              prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
              prose-p:text-base lg:prose-p:text-lg
              prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-muted-foreground prose-em:italic
              prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:bg-muted/20 
              prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8
              prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:not-italic
              prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm 
              prose-code:font-mono prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
              prose-ul:my-6 prose-ol:my-6
              prose-li:text-muted-foreground prose-li:leading-relaxed prose-li:mb-2
              prose-img:rounded-lg prose-img:shadow-sm prose-img:border prose-img:border-border/50
              prose-hr:border-border prose-hr:my-12
              prose-table:border-border prose-th:bg-muted/50 prose-td:border-border
              first:prose-p:text-xl first:prose-p:font-medium first:prose-p:text-foreground first:prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
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