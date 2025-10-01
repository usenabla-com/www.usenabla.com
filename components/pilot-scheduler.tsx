"use client"
import { CTA } from '@/components/ui/call-to-action'
import { Badge } from '@/components/ui/badge'
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { useState } from "react";
import { Blog8 } from "@/components/blocks/blog8"

export function PilotScheduler() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"nabla-pilot-interest-call"});
      cal("ui", {"theme":"light","cssVarsPerTheme":{"light":{"cal-brand":"#FF5F1F"},"dark":{"cal-brand":"#FF5F1F"}},"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])


  useEffect(() => {
    // Fetch blog posts
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        const transformedPosts = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          summary: post.summary,
          label: post.tags[0] || 'Blog',
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
        setPosts(transformedPosts)
      })
  }, [])
  return (
    <section id="how-it-works" className="w-full py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-full space-y-2">
            <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
              Ready to get started?
            </h2>
            <div className="w-full flex justify-center">
              <p className="max-w-4xl text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
                Start a 30-day pilot to begin enriching your evidence pipeline with FedRamp-ready assessments, ABDs, and firmware analysis.
              </p>
            </div>
          </div>
        </div>
          <CTA 
          badge="Start a Pilot"
          title="Start enriching your evidence pipeline today"
          description="Request a 30-day pilot to begin enriching your evidence pipeline with FedRamp-ready assessments, ABDs, and firmware analysis."
          primaryButtonText="Join Discord Community"
          primaryButtonTextMobile="Join Discord"
          secondaryButtonText="Request 30-day pilot"
          secondaryButtonTextMobile="Request Pilot"
          primaryButtonHref="https://discord.gg/SYwGtsBT6S"
          secondaryButtonHref="https://cal.com/team/nabla/nabla-pilot-interest-call"
        />
        {/* Blog Section */}
        <section className="relative py-8 lg:py-16">
          <div className="relative z-10">
            <Blog8
              heading="Latest from our Blog"
              description="Discover the latest insights about GRC, FedRamp, and compliance topics."
              posts={posts}
            />
          </div>
        </section>
      </div>
    </section>
  )
}