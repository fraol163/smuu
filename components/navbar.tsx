"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Globe, User, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "am" : "en");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "student":
        return "/dashboard/student";
      case "employer":
        return "/dashboard/employer";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/login";
    }
  };

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/jobs", label: t("nav.jobs") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-5 group">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-sm bg-white p-1 shadow-[0_0_25px_rgba(191,155,48,0.2)] transition-transform group-hover:rotate-3 duration-500 border border-primary/30">
              <img 
                src="/Untitled.jpeg" 
                alt="SMU Emblem" 
                className="h-full w-full object-contain"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent border border-background" />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-serif font-bold text-white leading-tight tracking-tight group-hover:text-primary transition-colors">
                St. Mary&apos;s
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/60 leading-none mt-1">
                Career Connect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-12 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:text-primary ${
                  pathname === link.href
                    ? "text-primary border-b border-primary/50 pb-1"
                    : "text-white/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-white/40 hover:text-primary hover:bg-white/5 transition-all"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest">
                {language === "en" ? "አማርኛ" : "EN"}
              </span>
            </Button>

            {/* Auth Buttons / User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-3 px-3 py-1 rounded-sm border border-white/5 hover:bg-white/5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/20 border border-primary/30">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-white/80">{user.name.split(" ")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect p-2 rounded-sm border-white/10">
                  <DropdownMenuItem asChild className="rounded-sm focus:bg-primary/20 focus:text-primary cursor-pointer">
                    <Link href={getDashboardLink()} className="flex items-center gap-3 p-3">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-sm focus:bg-destructive/20 focus:text-destructive text-destructive/80 cursor-pointer flex items-center gap-3 p-3"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{t("nav.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-6 sm:flex">
                <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors">
                  {t("nav.login")}
                </Link>
                <Button size="sm" asChild className="btn-editorial h-10 px-6 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Link href="/register">{t("nav.register")}</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/60 hover:text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-2xl md:hidden">
          <div className="space-y-2 px-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-sm px-4 py-3 text-xs font-bold uppercase tracking-[0.3em] transition-all ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-6 border-t border-white/5 mt-6 space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white"
                >
                  {t("nav.login")}
                </Link>
                <Button asChild className="btn-editorial w-full h-12 text-xs font-bold uppercase tracking-[0.3em]">
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    {t("nav.register")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
