"use client";
import { useState, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnnouncementBanner } from "@/components/announcement-banner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BadgeCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OnboardingContent() {
  const router = useRouter();
  const search = useSearchParams();
  const api_key = search.get("api_key") || "";

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    referred_by: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key, ...form }),
    });

    const payload = await res.json();

    if (res.ok) {
      // Send user to confirm page to wait for magic link click
      const { uid, api_key: apiKeyResp, email } = payload;
      router.push(
        `/confirm?uid=${uid}&api_key=${apiKeyResp}&email=${encodeURIComponent(email)}`,
      );
    } else {
      setError(payload?.error || "Unexpected error");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative grid & gradient */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      {/* Main content */}
      <main className="relative z-10">
        <AnnouncementBanner />
        <Navbar />

        <section className="py-20 lg:py-32">
          <div className="container">
            <Card className="mx-auto max-w-4xl shadow-xl md:grid md:grid-cols-2 md:divide-x overflow-hidden">
              {/* Intro / benefits */}
              <div className="relative hidden md:block bg-muted/40 p-8">
                <h2 className="text-3xl font-bold mb-4">
                  Welcome to Atelier Logos
                </h2>
                <p className="text-muted-foreground mb-6">
                  Just a few details and you’ll be ready to start using your new
                  API key.
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    Unlimited requests*
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    Powerful analysis endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    Cancel any time
                  </li>
                </ul>
                <p className="mt-6 text-xs text-muted-foreground">
                  *within your plan’s rate limit
                </p>
              </div>

              {/* Form */}
              <CardContent className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-2xl">
                    Tell us about yourself
                  </CardTitle>
                  <CardDescription>
                    Your API key:{" "}
                    <code className="font-mono text-xs break-all">
                      {api_key}
                    </code>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="first_name"
                      placeholder="First name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="last_name"
                      placeholder="Last name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="company"
                    placeholder="Company"
                    value={form.company}
                    onChange={handleChange}
                  />
                  <Input
                    name="referred_by"
                    placeholder="Referred by (optional)"
                    value={form.referred_by}
                    onChange={handleChange}
                  />

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Complete Onboarding"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <section className="relative bg-gradient-to-b from-muted/30 to-background">
          <Footer />
        </section>
      </main>

      {/* Floaty blobs */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none animate-pulse delay-1000" />
    </div>
  );
}
