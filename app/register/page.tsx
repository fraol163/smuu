"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Building2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-grain bg-grid-subtle">
      <div className="w-full max-w-2xl relative z-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-12 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-sm bg-white p-2 mx-auto mb-6 shadow-lg border border-primary/30">
            <img src="/Untitled.jpeg" alt="SMU Emblem" className="h-full w-full object-contain" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-accent border-2 border-background" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">Join SMU Career Connect</h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Select Your Institutional Path</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Link href="/register/student" className="group">
            <Card className="h-full border-2 border-border bg-card transition-all duration-500 hover:border-primary group-hover:shadow-2xl rounded-sm overflow-hidden flex flex-col">
              <div className="h-1.5 bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardHeader className="flex-1">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10 group-hover:bg-primary/10 transition-colors">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif font-bold tracking-tight">{t("hero.cta.student")}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  For current SMU students and recent graduates looking for internships and professional career opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-8">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3"><span className="h-1 w-1 bg-primary" /> Verified academic profile</li>
                  <li className="flex items-center gap-3"><span className="h-1 w-1 bg-primary" /> Departmental job matching</li>
                </ul>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Register as Student <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/register/employer" className="group">
            <Card className="h-full border-2 border-border bg-card transition-all duration-500 hover:border-accent group-hover:shadow-2xl rounded-sm overflow-hidden flex flex-col">
              <div className="h-1.5 bg-accent/20 group-hover:bg-accent transition-colors" />
              <CardHeader className="flex-1">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-accent/5 border border-accent/10 group-hover:bg-accent/10 transition-colors">
                  <Building2 className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl font-serif font-bold tracking-tight">{t("hero.cta.employer")}</CardTitle>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  For companies and organizations seeking to recruit verified academic talent from St. Mary&apos;s University.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-8">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3"><span className="h-1 w-1 bg-accent" /> Access academic talent pool</li>
                  <li className="flex items-center gap-3"><span className="h-1 w-1 bg-accent" /> Direct campus recruitment</li>
                </ul>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Register as Employer <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
