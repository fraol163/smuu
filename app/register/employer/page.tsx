"use client";

import { useState } from "react";
import Link from "next/link";
import { TranslationProvider, useTranslation } from "@/lib/translations";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const SECTORS = [
  "Banking & Finance",
  "Technology",
  "NGO",
  "Telecom",
  "Government",
  "Manufacturing",
  "Healthcare",
  "Education",
  "Retail",
  "Other",
];

function EmployerRegisterForm() {
  const { t } = useTranslation();
  const { registerEmployer } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company_name: "",
    company_sector: "",
    company_description: "",
    company_website: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await registerEmployer({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      company_name: formData.company_name,
      company_sector: formData.company_sector,
      company_description: formData.company_description,
      company_website: formData.company_website,
    });

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Registration failed");
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
        <Card className="w-full max-w-md border border-border bg-card text-center shadow-2xl rounded-sm overflow-hidden relative z-10">
          <div className="h-2 bg-success w-full" />
          <CardContent className="pt-12 pb-10 px-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/20">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground tracking-tight">Registration Successful!</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("msg.registration_success")}
            </p>
            <Button asChild className="mt-8 w-full h-12 text-md font-bold btn-editorial">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
      <div className="w-full max-w-lg relative z-10">
        <Link
          href="/register"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Registration Options
        </Link>

        <Card className="border border-border bg-card shadow-2xl rounded-sm overflow-hidden">
          <div className="h-2 bg-accent w-full" />
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-3xl font-serif font-bold tracking-tight">Employer Registration</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
              Connect with St. Mary&apos;s Academic Talent
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Representative Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-background border-2 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Company Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="bg-background border-2 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                  className="bg-background border-2 focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.company_name")}</Label>
                  <Input
                    id="company_name"
                    placeholder="Institutional Name"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, company_name: e.target.value }))
                    }
                    required
                    className="bg-background border-2 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_sector" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.sector")}</Label>
                  <Select
                    value={formData.company_sector}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, company_sector: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-2 focus-visible:ring-offset-0">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.website")}</Label>
                <Input
                  id="company_website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.company_website}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company_website: e.target.value }))
                  }
                  className="bg-background border-2 focus-visible:ring-offset-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.company_desc")}</Label>
                <Textarea
                  id="company_description"
                  placeholder="Briefly describe your institutional mission..."
                  value={formData.company_description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company_description: e.target.value }))
                  }
                  rows={3}
                  className="bg-background border-2 focus-visible:ring-offset-0"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-md font-bold btn-editorial" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t("form.register")
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EmployerRegisterPage() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <EmployerRegisterForm />
      </AuthProvider>
    </TranslationProvider>
  );
}
