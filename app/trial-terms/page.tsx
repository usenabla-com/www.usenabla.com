"use client"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Shield, AlertTriangle } from "lucide-react"

export default function TrialTermsPage() {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            14-Day Free Trial
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Trial Terms & Conditions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete terms and conditions for your 14-day free trial of Nabla's firmware security automation platform.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Trial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Trial Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Trial Duration</h4>
                  <p className="text-muted-foreground">14 consecutive calendar days from the date of activation</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Full Access</h4>
                  <p className="text-muted-foreground">Complete access to all enterprise features during trial period</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">No Payment Required</h4>
                  <p className="text-muted-foreground">No credit card or payment information required to start</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support Included</h4>
                  <p className="text-muted-foreground">Full technical support and onboarding assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>One trial per organization or legal entity</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Valid business email address required</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Intended for legitimate evaluation purposes only</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Must comply with our Acceptable Use Policy</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Platform Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated firmware security scanning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">GitHub App integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">CI/CD pipeline integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Advanced vulnerability detection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Compliance reporting</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Support & Resources</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Technical support via email</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Onboarding assistance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Documentation access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Best practices guidance</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Migration assistance</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trial Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Trial Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Limited to 5 repositories during trial period</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maximum of 100 security scans per day</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Historical data limited to trial period</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>API rate limits apply</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>No service level agreements (SLAs) during trial</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Security</h4>
                <p className="text-muted-foreground mb-3">
                  All data processed during your trial is subject to enterprise-grade security standards and best practices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Data encryption in transit and at rest</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Secure infrastructure and access controls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Privacy-focused data handling practices</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Retention</h4>
                <p className="text-muted-foreground">
                  Trial data is retained for 30 days after trial expiration to facilitate seamless conversion to a paid plan. 
                  After 30 days, all trial data is permanently deleted unless you have upgraded to a paid subscription.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trial Termination */}
          <Card>
            <CardHeader>
              <CardTitle>Trial Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Automatic Expiration</h4>
                  <p className="text-muted-foreground mb-3">
                    Your trial will automatically expire after 14 days. You will receive email notifications at 7 days, 3 days, and 1 day before expiration.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Early Termination</h4>
                  <p className="text-muted-foreground mb-3">
                    We reserve the right to terminate trials early for:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Violation of Acceptable Use Policy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Fraudulent or abusive behavior</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">Excessive resource usage</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Post-Trial Options</h4>
                  <p className="text-muted-foreground">
                    Upon trial expiration, you may upgrade to a paid subscription to continue using the service. 
                    Contact our sales team for enterprise pricing and custom solutions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Agreement</h4>
                <p className="text-muted-foreground">
                  By activating a trial, you agree to these Trial Terms and our standard Terms of Service. 
                  These trial-specific terms supplement but do not replace our general Terms of Service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Modifications</h4>
                <p className="text-muted-foreground">
                  We reserve the right to modify these trial terms at any time. Material changes will be communicated 
                  via email to active trial users with at least 7 days advance notice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">No Warranty</h4>
                <p className="text-muted-foreground">
                  The trial service is provided "as is" without warranties of any kind. While we strive for high availability, 
                  trial users are not covered by our standard service level agreements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Limitation of Liability</h4>
                <p className="text-muted-foreground">
                  Our liability for any claims arising from trial usage is limited to the amount paid for the trial (which is $0). 
                  We are not liable for any indirect, incidental, or consequential damages.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Questions & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If you have questions about these trial terms or need assistance during your trial:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Support</h4>
                    <p className="text-sm text-muted-foreground">Email: support@joindelta.com</p>
                    <p className="text-sm text-muted-foreground">Response time: Within 24 hours</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sales & Billing</h4>
                    <p className="text-sm text-muted-foreground">Email: sales@joindelta.com</p>
                    <p className="text-sm text-muted-foreground">For enterprise inquiries and pricing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Last updated: August 16, 2025</p>
            <p>Effective date: August 16, 2025</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}