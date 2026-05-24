"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const savedUser = localStorage.getItem("smu-user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.push(redirect);
        } else {
          switch (user.role) {
            case "student": router.push("/dashboard/student"); break;
            case "employer": router.push("/dashboard/employer"); break;
            case "admin": router.push("/dashboard/admin"); break;
            default: router.push("/");
          }
        }
      }
    } else {
      setError(result.error || t("msg.invalid_credentials"));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="border border-border bg-card shadow-xl rounded-sm overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="text-center pb-4 pt-8">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-sm bg-white p-2 mx-auto mb-6 shadow-lg border border-primary/30">
              <img src="/Untitled.jpeg" alt="SMU Emblem" className="h-full w-full object-contain" />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-accent border-2 border-background" />
            </div>
            <CardTitle className="text-3xl font-serif font-bold text-foreground tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="font-sans font-medium uppercase tracking-tighter text-xs">
              Institutional Access Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-sm border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.email")}</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background border-2 h-11 focus-visible:ring-offset-0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("form.password")}</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-background border-2 h-11 focus-visible:ring-offset-0" />
              </div>

              <Button type="submit" className="w-full h-12 text-md font-bold btn-editorial" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</> : t("form.login")}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="font-medium text-primary hover:underline">Register here</Link>
            </div>

            <div className="mt-6 rounded-md border border-border bg-muted/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo Accounts</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Student:</span>
                  <code className="rounded bg-background px-2 py-0.5 text-xs">abebe@smu.edu.et</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employer:</span>
                  <code className="rounded bg-background px-2 py-0.5 text-xs">hirut@techco.com</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Admin:</span>
                  <code className="rounded bg-background px-2 py-0.5 text-xs">admin@smu.edu.et</code>
                </div>
                <p className="pt-2 text-xs text-muted-foreground">Password: <code className="rounded bg-background px-1">password123</code> (or <code className="rounded bg-background px-1">admin123</code> for admin)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
