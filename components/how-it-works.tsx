"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CTA } from '@/components/ui/call-to-action'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'

interface FormData {
  firstName: string
  lastName: string
  email: string
  company: string
  message: string
}

export function HowItWorks() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!turnstileToken) {
      setError('Please complete the security verification')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          'cf-turnstile-response': turnstileToken
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setIsSuccess(true)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
      })
      setTurnstileToken('')
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section id="how-it-works" className="w-full py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center justify-center space-y-4 text-center">
          <div className="w-full space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Get in touch
            </div>
            <h2 className="w-full text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter">
              Ready to learn more?
            </h2>
            <div className="w-full flex justify-center">
              <p className="max-w-4xl text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
                Contact us to learn more about how Nabla can help with your compliance needs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12">
          <div className="bg-card rounded-lg p-6 sm:p-8 shadow-md">
            {isSuccess ? (
              <div className="text-center py-8 animate-in fade-in-50 duration-500">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-4">Thank you for reaching out. We'll get back to you soon.</p>
                <Button 
                  asChild
                  className="mt-2"
                >
                  <a href="https://cal.com/team/nabla/45-min-intro-call" target="_blank" rel="noopener noreferrer">
                    Schedule a Call
                  </a>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your compliance needs..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAAg7XmJhSrHO1Ag2'}
                    onVerify={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken('')}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm text-center animate-in fade-in-50">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting || !turnstileToken}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        <CTA 
          badge="Ready to Start?"
          title="Pass your next audit with confidence"
          description="Start generating OSCAL reports from your firmware binaries within 24 hours of signing up. No credit card required."
          primaryButtonText="Join Discord Community"
          primaryButtonTextMobile="Join Discord"
          secondaryButtonText="Contact Sales"
          secondaryButtonTextMobile="Contact Sales"
          primaryButtonHref="https://discord.gg/SYwGtsBT6S"
          secondaryButtonHref="mailto:trial@usenabla.com"
        />
      </div>
    </section>
  )
}