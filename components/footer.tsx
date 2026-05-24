"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/translations";
import { Globe, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/5 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-20 lg:grid-cols-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/" className="flex items-center gap-5 group">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-sm bg-white p-1.5 shadow-[0_0_25px_rgba(191,155,48,0.15)] transition-transform group-hover:rotate-3 duration-500 border border-primary/30">
                <img src="/Untitled.jpeg" alt="SMU Emblem" className="h-full w-full object-contain" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-accent border-2 border-background" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-white leading-tight tracking-tight">St. Mary&apos;s University</span>
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary/60 leading-none mt-1">Career Connect</span>
              </div>
            </Link>
            <p className="text-xl text-white/40 leading-relaxed font-serif italic max-w-md">
              &quot;Commitment to Excellence in Academic and Professional Development.&quot;
            </p>
            <p className="max-w-md text-sm text-white/50 leading-relaxed font-medium">
              Bridging the gap between academic theory and professional practice. Empowering St. Mary&apos;s University students to navigate their future with confidence and competence.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://www.smuc.edu.et" target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-sm border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-500 cursor-pointer group">
                <Globe className="h-5 w-5 text-white/40 group-hover:text-background" />
              </a>
              <a href="mailto:career@smuc.edu.et" className="h-12 w-12 rounded-sm border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-500 cursor-pointer group">
                <Mail className="h-5 w-5 text-white/40 group-hover:text-background" />
              </a>
              <a href="tel:+251112345678" className="h-12 w-12 rounded-sm border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all duration-500 cursor-pointer group">
                <Phone className="h-5 w-5 text-white/40 group-hover:text-background" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid gap-12 sm:grid-cols-3">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Academic</h3>
              <ul className="space-y-6">
                <li>
                  <Link href="/jobs" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Job Board
                  </Link>
                </li>
                <li>
                  <Link href="/register/student" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Student Registry
                  </Link>
                </li>
                <li>
                  <Link href="/register/employer" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Employer Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">University</h3>
              <ul className="space-y-6">
                <li>
                  <a href="https://www.smuc.edu.et" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    SMU Official
                  </a>
                </li>
                <li>
                  <a href="https://www.smuc.edu.et/index.php/students/campus-life" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Campus Life
                  </a>
                </li>
                <li>
                  <a href="https://www.smuc.edu.et/index.php/about-smu/alumni" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-primary flex items-center group transition-colors">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Alumni Network
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-10">Contact</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start text-xs font-bold uppercase tracking-widest text-white/40">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span className="leading-relaxed">Addis Ababa, Ethiopia<br/><span className="text-white/20">Sarbet Area</span></span>
                </div>
                <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-white/40">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a href="mailto:career@smuc.edu.et" className="hover:text-primary transition-colors">career@smuc.edu.et</a>
                </div>
                <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-white/40">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a href="tel:+251112345678" className="hover:text-primary transition-colors">+251-11-234-5678</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
            &copy; {new Date().getFullYear()} St. Mary&apos;s University. Professional Excellence.
          </p>
          <div className="flex gap-12">
            <Link href="/" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/" className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/10 hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
