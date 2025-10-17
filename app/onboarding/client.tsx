"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isFreeOrDisposable } from "@/lib/email-domains";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [plan, setPlan] = useState<"Relay" | "Fabric">("Relay");
  const [acceptTos, setAcceptTos] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptDpa, setAcceptDpa] = useState(false);
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const calMountedRef = useRef(false);

  useEffect(() => {
    const p = search.get("plan");
    if (p === "Fabric") setPlan("Fabric");
  }, [search]);

  const disabledNext = useMemo(() => {
    if (step === 1) return !acceptTos;
    if (step === 2) return !acceptPrivacy;
    if (step === 3) return !acceptDpa;
    if (step === 4) return !email || !!emailError || !org;
    return false;
  }, [step, acceptTos, acceptPrivacy, acceptDpa, email, emailError, org]);

  useEffect(() => {
    let cancelled = false;
    if (!email) {
      setEmailError(null);
      return;
    }
    (async () => {
      try {
        const { blocked, reason } = await isFreeOrDisposable(email);
        if (cancelled) return;
        if (blocked) {
          setEmailError(
            reason === "disposable"
              ? "Please use a business email — disposable addresses aren’t allowed for trials."
              : "Please use a business email — free mailbox providers aren’t allowed for trials."
          );
        } else {
          setEmailError(null);
        }
      } catch {
        if (!cancelled) setEmailError(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s));
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  async function finish() {
    try {
      setLoading(true);
      setError(null);
      const ph = (window as any).posthog;
      const posthog_id = ph?.get_distinct_id?.();
      const session_id = ph?.get_session_id?.();

      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email,
          org,
          posthog_id,
          session_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save onboarding");

      // Track analytics after successful onboarding
      ph?.capture("onboarding_completed", {
        plan,
        email,
        org,
        posthog_id,
        session_id,
      });

      // Stay on this page and show success with Cal.com embed
      setFinished(true);
      setStep(4);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!finished || !calLoaded || calMountedRef.current) return;
    const win = window as any;
    if (!win.Cal) return;
    try {
      win.Cal("init", "45-min-meeting", { origin: "https://app.cal.com" });
      win.Cal.ns["45-min-meeting"]("inline", {
        elementOrSelector: "#my-cal-inline-45-min-meeting",
        config: { layout: "month_view" },
        calLink: "jbohrman/45-min-meeting",
      });
      win.Cal.ns["45-min-meeting"]("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#FF5F1F" }, dark: { "cal-brand": "#FF5F1F" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      calMountedRef.current = true;
    } catch (e) {
      console.error("Cal.com embed failed", e);
    }
  }, [finished, calLoaded]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <Script src="https://app.cal.com/embed/embed.js" strategy="afterInteractive" onLoad={() => setCalLoaded(true)} />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Start your 14‑day {plan} trial</h1>
          <p className="text-sm text-muted-foreground">Complete these steps to begin your trial.</p>
        </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {[1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded ${step >= i ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Plan Picker */}
      <div className="mb-6">
        <div className="inline-flex rounded-md border p-1">
          {["Relay","Fabric"].map((p) => (
            <button
              key={p}
              className={`px-3 py-1.5 text-sm rounded ${plan === p ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => setPlan(p as any)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-lg border p-4 space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">1. Terms and Conditions</h2>
            <div className="text-sm text-muted-foreground">Please review and accept our Terms of Service to continue.</div>
            <div className="h-72 overflow-y-auto rounded border p-4 bg-background/50">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <h3>Atelier Logos LLC. DBA Nabla — Terms of Service</h3>
                <p><strong>Last Updated:</strong> October 14, 2025</p>
                <p>
                  If you signed a separate Cover Page to access the Product with the same account, and that agreement has not ended, the terms below do not apply to you. Instead, your separate Cover Page applies to your use of the Product.
                </p>
                <p>
                  This Agreement is between Atelier Logos LLC. DBA Nabla ("Provider") and the company or person accessing or using the Product ("Customer"). This Agreement consists of: (1) the Order Form below and (2) the Framework Terms defined below. If you are accessing or using the Product on behalf of your company, you represent that you are authorized to accept this Agreement on its behalf. By signing up, accessing, or using the Product, Customer accepts this Agreement.
                </p>

                <h4>Cover Page</h4>
                <h5>Order Form Summary</h5>
                <p>
                  <strong>Framework Terms.</strong> This Order Form incorporates and is governed by the Key Terms below and the Common Paper Cloud Service Agreement Standard Terms Version 2.1 (<a href="https://commonpaper.com/standards/cloud-service-agreement/2.1/" target="_blank" rel="noreferrer">link</a>), which are incorporated by reference. Any modifications to the Standard Terms made in the Cover Page control over conflicts with the Standard Terms. Capitalized words have the meanings given in the Cover Page or the Standard Terms.
                </p>
                <ul>
                  <li><strong>Cloud Service:</strong> An evidence fabric API for programmatic compliance.</li>
                  <li><strong>Order Date:</strong> The Effective Date.</li>
                  <li><strong>Subscription Period:</strong> 1 year(s).</li>
                </ul>

                <h5>Cloud Service Fees</h5>
                <p>
                  Certain parts of the Product have different pricing plans, which are available at Provider’s pricing page (<a href="https://www.usenabla.com" target="_blank" rel="noreferrer">https://www.usenabla.com</a>). Customer will pay Provider the applicable Fees based on the Product tier and Customer’s usage. Provider may update Product pricing by giving at least 30 days notice to Customer (including by email or notification within the Product), and the change will apply in the next Subscription Period.
                </p>

                <h5>Payment Process</h5>
                <ul>
                  <li><strong>Bill by invoice:</strong> Provider invoices Customer annually.</li>
                  <li>Customer pays each invoice within <strong>14 day(s)</strong> from the last day of the Subscription Period.</li>
                  <li><strong>Non-Renewal Notice Period:</strong> At least 30 days before the end of the current Subscription Period.</li>
                </ul>

                <h4>Cloud Service Use</h4>
                <ul>
                  <li><strong>License:</strong> Subject to this Agreement, Provider grants Customer a non-exclusive, non-transferable right to access and use the Cloud Service and API for Customer’s internal business purposes during the Subscription Period.</li>
                  <li><strong>Acceptable Use:</strong> Customer will not (a) reverse engineer or circumvent technical controls; (b) use the Cloud Service to violate law or third-party rights; or (c) resell, sublicense, or provide access to third parties except as expressly permitted.</li>
                  <li><strong>API Terms:</strong> API keys are confidential. Customer is responsible for all usage under its keys and must implement reasonable safeguards (e.g., secure storage, rotation) and respect documented rate limits.</li>
                  <li><strong>Availability & Support:</strong> Provider will use commercially reasonable efforts to make the Cloud Service available and to respond to support requests via designated channels. The Cloud Service may evolve over time with updates and improvements.</li>
                </ul>

                <h4>Security & Data</h4>
                <ul>
                  <li><strong>Security:</strong> Provider implements appropriate technical and organizational measures commensurate with the nature of the Cloud Service, including access controls and encryption in transit.</li>
                  <li><strong>Privacy:</strong> Processing of personal data is governed by the parties’ Data Processing Agreement (DPA) and Provider’s Privacy Policy.</li>
                  <li><strong>Customer Content:</strong> Customer is responsible for the lawfulness and accuracy of data it provides and for obtaining any required consents.</li>
                </ul>

                <h4>Professional Services (Optional)</h4>
                <p>
                  If Customer purchases Professional Services under a separate statement of work (SOW), the following applies in addition to these Terms. If Professional Services are not purchased, this section does not apply.
                </p>
                <h5>Scope of Services</h5>
                <ul>
                  <li><strong>Dashboard Creation:</strong> Building or customizing data visualization dashboards using customer‑provided data, APIs, or evidence lakes.</li>
                  <li><strong>Excel Report Enrichment:</strong> Transforming or enriching exported evidence or compliance reports with automated formulas, macros, or integrated metrics.</li>
                  <li><strong>Firmware Audit Automation:</strong> Developing automated binary analysis workflows to assess firmware, generate SBOMs, or identify compliance and security artifacts.</li>
                  <li><strong>Diagrams‑as‑Code Automation:</strong> Creating automated architecture, dependency, or compliance boundary diagrams from structured evidence or configuration data.</li>
                </ul>
                <p>Each engagement’s exact scope, deliverables, and timeline are defined in a mutually agreed SOW.</p>

                <h5>Delivery Model</h5>
                <p>Services are performed by Provider personnel and may leverage automation. Any generated artifacts are reviewed before delivery.</p>

                <h5>Customer Responsibilities</h5>
                <p>Customer provides accurate, timely inputs and access (for example, datasets, credentials, firmware samples). Delays in access may impact schedules.</p>

                <h5>Intellectual Property</h5>
                <p>Unless otherwise stated in an SOW, deliverables are licensed for Customer’s internal use. Provider retains ownership of underlying software, templates, frameworks, and automation used to produce deliverables.</p>

                <h5>Data Handling</h5>
                <p>Customer data processed during Services is handled per the Privacy Policy and is limited to the scope of the engagement.</p>

                <h5>Exclusions</h5>
                <p>Professional Services do not include ongoing managed services, continuous monitoring, or third‑party integration beyond the agreed scope. Out‑of‑scope work may require a change order.</p>

                <h5>Fees and Invoicing</h5>
                <h6>Engagement Basis</h6>
                <ul>
                  <li><strong>Fixed‑scope:</strong> Well‑defined deliverables (for example, dashboards, diagrams‑as‑code, firmware pipelines); quoted as a project total; invoiced on milestones or completion.</li>
                  <li><strong>Time‑and‑materials:</strong> Open‑ended consulting/integration; billed at standard hourly or daily rates.</li>
                </ul>
                <h6>Indicative Rates</h6>
                <ul>
                  <li>Advisory / Integration Consulting: $275–$350 per hour</li>
                  <li>Engineering / Automation Development: $350–$500 per hour</li>
                  <li>Firmware &amp; Binary Analysis Automation: $400–$600 per hour</li>
                  <li>Fixed Deliverables: $5,000–$25,000 per deliverable (complexity dependent)</li>
                </ul>
                <h6>Retainers and Minimums</h6>
                <p>Some engagements may require a 25–50% retainer. Minimum commitment is generally eight (8) hours unless otherwise agreed.</p>
                <h6>Invoicing and Payment</h6>
                <p>Invoices are issued at project start (fixed‑scope) or monthly (time‑and‑materials). Net 30 terms apply. Late payments may incur up to 1.5% monthly interest or the maximum allowed by law. Work may pause on delinquency.</p>
                <h6>Expenses</h6>
                <p>Pre‑approved, reasonable out‑of‑pocket expenses (for example, compute, test environments) are billed at cost.</p>
                <h6>Changes in Scope</h6>
                <p>Out‑of‑scope requests require a written change order with updated hours/fees.</p>
                <h6>Refunds and Cancellations</h6>
                <p>Because Services reserve engineering time and produce custom deliverables, fees are non‑refundable once work begins. Either party may terminate an engagement for uncured material breach with written notice.</p>

                <h4>Key Terms</h4>
                <ul>
                  <li><strong>Customer:</strong> The company or person who accesses or uses the Product. If accepting on behalf of a company, "Customer" means that company.</li>
                  <li><strong>Provider:</strong> Atelier Logos LLC. DBA Nabla</li>
                  <li><strong>Effective Date:</strong> The date Customer first accepts this Agreement.</li>
                  <li><strong>Governing Law:</strong> The laws of the State of Wyoming</li>
                  <li><strong>Chosen Courts:</strong> The state or federal courts located in Wyoming</li>
                </ul>

                <h5>Covered Claims</h5>
                <ul>
                  <li><strong>Provider Covered Claims:</strong> Claims that the Cloud Service, when used as permitted, infringes others’ IP rights.</li>
                  <li><strong>Customer Covered Claims:</strong> Claims arising from Customer Content or Customer’s breach of the Agreement, including use restrictions.</li>
                </ul>

                <h5>General Cap Amount</h5>
                <p>The fees paid or payable by Customer to Provider in the 12 months immediately before the claim.</p>

                <h5>Notice Address</h5>
                <ul>
                  <li><strong>For Provider:</strong> legal@usenabla.com</li>
                  <li><strong>For Customer:</strong> The main email address on Customer's account</li>
                </ul>
              </article>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={acceptTos} onChange={(e) => setAcceptTos(e.target.checked)} />
              I agree to the Terms and Conditions
            </label>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">2. Privacy Policy</h2>
            <div className="h-72 overflow-y-auto rounded border p-4 bg-background/50">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <h3>Atelier Logos LLC. DBA Nabla — Privacy Policy</h3>
                <p><strong>Last Updated:</strong> October 14, 2025</p>
                <p>
                  This Privacy Policy describes how we collect, use, and share information when you use Nabla’s software, APIs, websites, and related services (collectively, the “Services”). By using the Services, you agree to this Privacy Policy.
                </p>

                <h4>Information We Collect</h4>
                <ul>
                  <li><strong>Information you provide:</strong> Account details (name, email, organization), configuration data, evidence or files uploaded or transmitted to the Services, and communications with us.</li>
                  <li><strong>Automatically collected:</strong> Usage logs, device/browser information, IP address, and performance metrics gathered via cookies or similar technologies.</li>
                  <li><strong>From third parties (if authorized):</strong> Connectors or integrations you enable (for example, cloud providers, code repositories) may provide data for use in the Services.</li>
                </ul>

                <h4>How We Use Information</h4>
                <ul>
                  <li>Provide, operate, maintain, and improve the Services and their core features (including APIs).</li>
                  <li>Secure the Services, prevent misuse, detect and investigate incidents.</li>
                  <li>Communicate with you about updates, features, and support; respond to inquiries.</li>
                  <li>Perform analytics to understand usage and enhance user experience.</li>
                  <li>Comply with legal obligations and enforce our agreements.</li>
                </ul>

                <h4>Legal Bases (EEA/UK only)</h4>
                <p>We rely on one or more of the following legal bases: contract performance, legitimate interests, consent (where required), and compliance with legal obligations.</p>

                <h4>Sharing and Sub‑processors</h4>
                <p>
                  We may share information with service providers that process data on our behalf to support the Services (for example, hosting, analytics, customer communications). We require sub‑processors to implement appropriate safeguards and only process data per our instructions.
                </p>

                <h4>International Transfers</h4>
                <p>
                  We may transfer information internationally, including to the United States. Where required, we use appropriate safeguards (such as Standard Contractual Clauses) for such transfers.
                </p>

                <h4>Security</h4>
                <p>
                  We implement technical and organizational measures to protect information, including encryption in transit, access controls, and vulnerability management. No system is perfectly secure, and we cannot guarantee absolute security.
                </p>

                <h4>Retention</h4>
                <p>
                  We retain information for as long as necessary to provide the Services, comply with legal obligations, resolve disputes, and enforce agreements. Retention periods may vary based on data type and purpose.
                </p>

                <h4>Your Rights</h4>
                <ul>
                  <li><strong>Access/Update/Delete:</strong> You may have the right to request access to, correction of, or deletion of your information, subject to applicable law.</li>
                  <li><strong>Portability/Restriction/Objection:</strong> Where applicable, you may request portability, restrict processing, or object to processing.</li>
                  <li><strong>Marketing:</strong> You can opt out of non‑essential communications at any time using unsubscribe links or by contacting us.</li>
                </ul>

                <h4>Children’s Privacy</h4>
                <p>The Services are not directed to children under 16, and we do not knowingly collect personal information from them.</p>

                <h4>Changes</h4>
                <p>We may update this Privacy Policy from time to time. Material changes will be posted in the Services or sent via email where appropriate.</p>

                <h4>Contact</h4>
                <p>Questions or requests: <a href="mailto:legal@usenabla.com">legal@usenabla.com</a></p>
              </article>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
              I agree to the Privacy Policy
            </label>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">3. Data Processing Agreement (DPA)</h2>
            <div className="text-sm text-muted-foreground">Please review and accept our Data Processing Agreement to continue.</div>
            <div className="h-72 overflow-y-auto rounded border p-4 bg-background/50">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <h3>Data Processing Agreement (Controller–Processor)</h3>
                <p>
                  This Data Processing Agreement ("DPA") forms part of the Agreement between the Customer (Controller) and Atelier Logos LLC. DBA Nabla (Processor). Capitalized terms not defined in this DPA have the meanings given in the Agreement.
                </p>

                <h4>1. Subject Matter and Duration</h4>
                <p>
                  Processor will process Personal Data on behalf of Controller solely to provide the Cloud Service and related support, for the Subscription Period and any wind‑down period required by the Agreement.
                </p>

                <h4>2. Nature and Purpose of Processing</h4>
                <p>
                  Processing includes collection, storage, retrieval, analysis, transmission, and deletion as necessary to operate the Cloud Service and perform support and, if purchased, Professional Services.
                </p>

                <h4>3. Categories of Data Subjects and Data</h4>
                <p>
                  Data Subjects may include Controller’s personnel, customers, and end users. Personal Data may include identifiers (for example, name, email), organization details, usage logs, and other data submitted by Controller to the Cloud Service. Controller is responsible for the lawfulness of Personal Data provided.
                </p>

                <h4>4. Controller Instructions</h4>
                <p>
                  Processor will process Personal Data only on documented instructions from Controller as set forth in the Agreement and this DPA, unless required by applicable law. Where legally permitted, Processor will promptly notify Controller if an instruction appears to violate applicable law.
                </p>

                <h4>5. Confidentiality</h4>
                <p>
                  Processor ensures persons authorized to process Personal Data are subject to appropriate confidentiality obligations.
                </p>

                <h4>6. Security</h4>
                <p>
                  Processor implements appropriate technical and organizational measures to protect Personal Data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure or access, including access controls, encryption in transit, logical separation, and vulnerability management.
                </p>

                <h4>7. Sub‑processors</h4>
                <p>
                  Controller authorizes Processor to use sub‑processors to support the Cloud Service. Processor will impose data protection obligations on sub‑processors no less protective than this DPA and remains responsible for their performance. A current list of sub‑processors will be provided upon request.
                </p>

                <h4>8. International Transfers</h4>
                <p>
                  Processor may transfer Personal Data internationally, including to the United States. Where required, Processor will ensure appropriate transfer mechanisms (for example, SCCs or other lawful transfer tools) are in place.
                </p>

                <h4>9. Data Subject Requests</h4>
                <p>
                  Taking into account the nature of processing, Processor will reasonably assist Controller by appropriate technical and organizational measures, insofar as possible, to respond to data subject requests under applicable data protection laws.
                </p>

                <h4>10. Breach Notification</h4>
                <p>
                  Processor will notify Controller without undue delay after becoming aware of a Personal Data Breach affecting Personal Data and will provide information reasonably required for Controller to meet its reporting obligations.
                </p>

                <h4>11. Assistance and DPIAs</h4>
                <p>
                  Processor will provide reasonable assistance to Controller with data protection impact assessments and consultations with supervisory authorities, taking into account the nature of processing and the information available to Processor.
                </p>

                <h4>12. Audit</h4>
                <p>
                  Upon written request no more than once annually (unless required by a supervisory authority or following a Personal Data Breach), Processor will provide a summary of relevant independent audit reports or other information sufficient to demonstrate compliance. On‑site audits may be conducted with reasonable notice, during normal business hours, without unreasonably disrupting operations.
                </p>

                <h4>13. Return or Deletion</h4>
                <p>
                  Upon termination or expiration of the Agreement, Processor will delete or return Personal Data at Controller’s election, unless retention is required by law.
                </p>

                <h4>14. Liability</h4>
                <p>
                  The Parties’ aggregate liability under this DPA is subject to the limitations and exclusions in the Agreement.
                </p>

                <h4>15. Contact</h4>
                <p>Privacy inquiries: <a href="mailto:legal@usenabla.com">legal@usenabla.com</a></p>
              </article>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={acceptDpa} onChange={(e)=>setAcceptDpa(e.target.checked)} />
              I agree to the Data Processing Agreement
            </label>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium">4. Trial Details</h2>
            {!finished ? (
              <>
                <div className="text-sm text-muted-foreground">Provide your contact and organization details so we can set up your workspace.</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <input className={`rounded border px-3 py-2 text-sm w-full ${emailError ? 'border-red-500' : ''}`} placeholder="Work email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                    {emailError && <div className="mt-1 text-xs text-red-600">{emailError}</div>}
                  </div>
                  <input className="rounded border px-3 py-2 text-sm" placeholder="Organization" value={org} onChange={(e)=>setOrg(e.target.value)} />
                </div>

                {/* Trial Terms (separate from TOS) */}
                <div className="mt-4 rounded-lg border p-4 bg-background/50">
                  <article className="prose prose-sm dark:prose-invert max-w-none">
                    <h4>Trial Terms</h4>
                    <p className="text-muted-foreground">
                      These Trial Terms apply to your 14‑day use of Nabla’s Cloud Service and API during onboarding. They are separate from, and in addition to, the Terms of Service.
                    </p>
                    <ul>
                      <li><strong>Duration:</strong> The trial begins upon completion of onboarding and ends 14 calendar days later.</li>
                      <li><strong>Scope:</strong> Access to the Nabla evidence fabric API, core features, and standard usage limits suitable for evaluation.</li>
                      <li><strong>Fair Use:</strong> Trial usage must be reasonable and non‑abusive. Load testing, scraping, or attempts to circumvent rate limits are not permitted.</li>
                      <li><strong>Data Handling:</strong> Customer is responsible for the legality and accuracy of data submitted. Trial data is processed per our Privacy Policy and DPA.</li>
                      <li><strong>Support:</strong> Best‑effort email support during the trial. Response times may vary.</li>
                      <li><strong>No Fees During Trial:</strong> You will not be charged during the trial. Conversion to a paid plan is optional and requires your confirmation.</li>
                      <li><strong>Termination:</strong> Either party may end the trial at any time for any reason. Access may be suspended for security or abuse concerns.</li>
                      <li><strong>Post‑Trial:</strong> At trial end, access may be limited or disabled unless a paid subscription is activated. You may request deletion or export of Customer Content as permitted by the Service.</li>
                      <li><strong>Feedback:</strong> You grant Provider a non‑exclusive right to use feedback to improve the Service.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground">Questions about these terms? Contact <a href="mailto:legal@usenabla.com">legal@usenabla.com</a>.</p>
                  </article>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You’re all set. We’ve emailed you your API key. If you have any questions, you can schedule an onboarding call here:
                </p>
                <div className="rounded border">
                  <div id="my-cal-inline-45-min-meeting" style={{ width: "100%", height: "600px", overflow: "auto" }} />
                </div>
              </div>
            )}
          </div>
        )}
        {/* Close steps container */}
        </div>
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={prev} disabled={step === 1 || finished}>Back</Button>
          {step < 4 && <Button onClick={next} disabled={disabledNext}>Next</Button>}
          {step === 4 && !finished && (
            <Button onClick={finish} disabled={loading || disabledNext}>{loading ? 'Starting…' : 'Start trial'}</Button>
          )}
        </div>
      </div>
    </main>
  );
}
