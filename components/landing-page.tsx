"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";
import { PLATFORM_STATS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Building2,
  Briefcase,
  Trophy,
  Target,
  ShieldCheck,
  Globe,
  CheckCircle2,
  GraduationCap,
  Search,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";

export function LandingPage() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      value: PLATFORM_STATS.activeStudents.toLocaleString(),
      label: t("stats.students"),
    },
    {
      icon: Building2,
      value: PLATFORM_STATS.activeEmployers.toLocaleString(),
      label: t("stats.employers"),
    },
    {
      icon: Briefcase,
      value: PLATFORM_STATS.activeJobs.toLocaleString(),
      label: t("stats.jobs"),
    },
    {
      icon: Trophy,
      value: PLATFORM_STATS.successfulPlacements.toLocaleString(),
      label: t("stats.placements"),
    },
  ];

  const features = [
    {
      icon: Target,
      title: t("features.matching.title"),
      description: t("features.matching.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("features.verified.title"),
      description: t("features.verified.desc"),
    },
    {
      icon: Globe,
      title: t("features.bilingual.title"),
      description: t("features.bilingual.desc"),
    },
    {
      icon: CheckCircle2,
      title: t("features.free.title"),
      description: t("features.free.desc"),
    },
  ];

  const departments = [
    { name: t("dept.cs"), abbr: "CS", students: PLATFORM_STATS.departmentDistribution["Computer Science"] },
    { name: t("dept.marketing"), abbr: "MKT", students: PLATFORM_STATS.departmentDistribution["Marketing"] },
    { name: t("dept.accounting"), abbr: "ACC", students: PLATFORM_STATS.departmentDistribution["Accounting"] },
    { name: t("dept.tourism"), abbr: "TRM", students: PLATFORM_STATS.departmentDistribution["Tourism"] },
    { name: t("dept.economics"), abbr: "ECO", students: PLATFORM_STATS.departmentDistribution["Economics"] },
  ];

  const trustedEmployers = [
    "Commercial Bank of Ethiopia",
    "Ethio Telecom",
    "USAID",
    "United Nations",
    "Safaricom",
  ];

  return (
    <div className="bg-grain min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32 bg-grid-subtle bg-editorial-hero border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-10">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-sm border border-primary/30 bg-primary/10 text-[10px] font-bold uppercase tracking-[0.3em] text-primary shadow-[0_0_15px_rgba(191,155,48,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_var(--color-primary)]"></span>
                </span>
                Institutional Excellence • Prestige & Potential
              </div>
              
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-white leading-[1] tracking-tighter">
                {t("hero.title").split(' ').map((word, i) => (
                  <span key={i} className={i === 2 ? "text-primary italic" : ""}>{word} </span>
                ))}
              </h1>
              
              <p className="max-w-xl text-xl text-muted-foreground leading-relaxed font-sans border-l-2 border-primary/50 pl-8 py-2">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-wrap gap-8 pt-4">
                <Button size="lg" asChild className="h-16 px-10 text-md font-bold btn-editorial">
                  <Link href="/register/student">
                    {t("hero.cta.student")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-16 px-10 text-md font-bold border-2 border-primary/40 hover:bg-primary/5 hover:border-primary text-primary transition-all duration-500">
                  <Link href="/register/employer">{t("hero.cta.employer")}</Link>
                </Button>
              </div>

              {/* Trusted by Editorial Style */}
              <div className="pt-16">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40 mb-8 flex items-center gap-6">
                  Distinguished Entity Partners
                  <span className="h-px flex-1 bg-gradient-to-right from-primary/30 to-transparent"></span>
                </p>
                <div className="flex flex-wrap items-center gap-x-12 gap-y-8 opacity-40 hover:opacity-80 transition-all duration-700">
                  {trustedEmployers.map((company) => (
                    <span key={company} className="text-sm font-serif font-bold tracking-widest text-white/70">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Stats Editorial */}
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-sm">
                {stats.map((stat, i) => (
                  <div 
                    key={stat.label}
                    className="group relative bg-card/40 backdrop-blur-sm p-10 hover:bg-primary/[0.03] transition-all duration-500"
                  >
                    <div className="absolute top-6 right-8 text-primary/5 font-serif text-8xl font-bold select-none group-hover:text-primary/10 transition-all duration-500">
                      0{i + 1}
                    </div>
                    <div className="relative z-10">
                      <p className="text-5xl font-serif font-bold text-primary mb-2 shadow-sm">
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 p-8 glass-effect relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Trophy className="h-16 w-16 text-primary" />
                </div>
                <p className="text-md font-serif leading-relaxed italic text-white/90 relative z-10">
                  &quot;St. Mary&apos;s Career Connect bridges the gap between academic theory and industry practice, empowering the next generation of Ethiopian leaders.&quot;
                </p>
                <div className="mt-6 flex items-center gap-4 relative z-10">
                  <div className="h-10 w-10 rounded-full border-2 border-primary/30 bg-primary/10" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Academic Affairs</p>
                    <p className="text-[9px] font-bold uppercase tracking-tighter opacity-50">St. Mary&apos;s University</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Grid */}
      <section className="py-40 border-b border-white/5 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">
                {t("features.title")}
              </h2>
              <p className="mt-8 text-xl text-muted-foreground leading-relaxed">
                We provide the tools and connections necessary for students to transition seamlessly from university life to a professional career through institutional vetting and smart matching.
              </p>
            </div>
            <Button variant="link" className="text-primary font-bold group p-0 h-auto text-sm uppercase tracking-widest" asChild>
              <Link href="https://www.smuc.edu.et/index.php/about-smu/mission-vision-and-values" target="_blank" className="flex items-center">
                Institutional Mission
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background p-12 hover:bg-primary/[0.02] transition-all duration-500 group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/5 border border-primary/10 text-primary mb-10 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section - Minimalist Cards */}
      <section className="py-40 bg-grid-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">
              Diverse Departments, <span className="text-primary italic">Unified Potential</span>
            </h2>
            <p className="mt-8 text-muted-foreground text-xl leading-relaxed font-medium">
              Tailored career paths for students across our five core academic disciplines.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-5">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="group p-10 border-2 border-white/5 bg-card/40 backdrop-blur-sm text-center hover:border-primary/30 hover:bg-primary/[0.03] transition-all duration-700 rounded-sm"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/10 group-hover:border-primary group-hover:text-primary transition-all duration-700 text-2xl font-serif font-bold text-white/40">
                  {dept.abbr}
                </div>
                <h3 className="mt-8 font-bold text-white tracking-widest text-xs uppercase">{dept.name}</h3>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-3xl font-serif font-bold text-primary group-hover:scale-110 transition-transform">{dept.students}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mt-2">Active Candidates</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Numbered Steps */}
      <section className="py-40 bg-card/80 text-white relative overflow-hidden border-y border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <h2 className="text-4xl md:text-7xl font-serif font-bold tracking-tighter leading-[1.1]">
                The Path to <br/><span className="text-primary italic">Professional Mastery</span>
              </h2>
              <div className="space-y-16">
                {[
                  {
                    step: "01",
                    title: "Archive Your Achievement",
                    desc: "Showcase your academic journey and specialized skills through our verified profile protocol.",
                  },
                  {
                    step: "02",
                    title: "Departmental Alignment",
                    desc: "Our neural matching engine identifies opportunities that resonate with your specific academic focus.",
                  },
                  {
                    step: "03",
                    title: "Execute Your Future",
                    desc: "Secure placement with distinguished partners and initiate your professional legacy.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-10 group">
                    <span className="text-6xl font-serif font-bold text-primary italic opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                      {item.step}
                    </span>
                    <div className="pt-2">
                      <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square glass-effect p-12 rounded-sm group">
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <div className="relative z-10 w-full h-full border border-primary/20 rounded-sm bg-background/60 shadow-2xl flex flex-col p-8">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                  <div className="h-3 w-3 rounded-full bg-primary/50" />
                  <div className="h-3 w-3 rounded-full bg-white/20" />
                  <div className="h-3 w-3 rounded-full bg-white/20" />
                  <div className="ml-auto text-[8px] font-bold uppercase tracking-[0.4em] text-primary/60 italic">Academic Secure v4.2</div>
                </div>
                <div className="space-y-6">
                  <div className="h-10 bg-white/5 w-3/4 rounded-sm" />
                  <div className="h-32 bg-white/5 w-full rounded-sm" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-primary/10 rounded-sm border border-primary/20" />
                    <div className="h-16 bg-white/5 rounded-sm" />
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t border-white/10 flex justify-center">
                   <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary animate-pulse">Interface Transmission Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold Editorial */}
      <section className="py-40 bg-background relative">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <GraduationCap className="h-16 w-16 text-primary mx-auto mb-10 opacity-40 animate-bounce-slow" />
          <h2 className="text-5xl md:text-8xl font-serif font-bold text-white mb-10 tracking-tighter leading-[1]">
            Your Legacy <span className="text-primary italic">Begins Here.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground mb-16 leading-relaxed font-medium">
            Join the SMU Career Connect community. A sanctuary for ambitious students and visionary institutional partners.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Button size="lg" asChild className="h-20 px-12 text-xl font-bold btn-editorial">
              <Link href="/register/student">
                Initiate Career
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-20 px-12 text-xl font-bold border-2 border-primary/40 hover:bg-primary/5 text-primary">
              <Link href="/jobs">Browse Archive</Link>
            </Button>
          </div>
          <p className="mt-20 text-[10px] font-bold uppercase tracking-[0.5em] text-primary/30">
            St. Mary&apos;s University • Established 2024 • Academic Excellence
          </p>
        </div>
      </section>
    </div>
  );
}
