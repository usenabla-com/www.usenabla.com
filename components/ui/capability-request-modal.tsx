"use client";

import { useState } from "react";
import { DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAnalytics } from "@/hooks/use-analytics";

interface FormData {
  name: string;
  title: string;
  company: string;
  email: string;
}

export function CapabilityRequestModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    title: "",
    company: "",
    email: "",
  });
  const { track, identify, reset } = useAnalytics();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Track the capability statement request event
    track("Capability Statement Requested", { email });

    // Pre-fill email in form and open modal
    setFormData((prev) => ({ ...prev, email }));
    setOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.title || !formData.company || !formData.email) {
      return;
    }

    setLoading(true);

    try {
      // Identify the user in PostHog
      identify(formData.email, {
        name: formData.name,
        title: formData.title,
        company: formData.company,
        email: formData.email,
        capability_statement_requested: true,
        capability_statement_requested_at: new Date().toISOString(),
      });

      // Track completion event
      track("Capability Statement Form Completed", {
        name: formData.name,
        title: formData.title,
        company: formData.company,
        email: formData.email,
      });

      // Set a cookie to allow PDF access
      document.cookie = `posthog_identified=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when closing
      setSubmitted(false);
      setFormData({ name: "", title: "", company: "", email: "" });
      setEmail("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-72"
          required
        />
        <Button
          type="submit"
          size="lg"
          className="gap-4 sm:gap-4 px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
        >
          Get Capabilities Statement <DownloadIcon className="w-4 h-4" />
        </Button>
      </form>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Request Capabilities Statement</DialogTitle>
                <DialogDescription>
                  Please provide your details to receive our capabilities statement.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="Director of Compliance"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={handleInputChange("company")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@acme.com"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit & Get PDF"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Thank you!</DialogTitle>
                <DialogDescription>
                  You now have access to our capabilities statement.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Click the button below to view or download our capabilities statement.
                  We&apos;ll also send a copy to {formData.email}.
                </p>
                <Button asChild className="w-full">
                  <a href="/capabilities.pdf" target="_blank" rel="noopener noreferrer">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    View Capabilities Statement
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
