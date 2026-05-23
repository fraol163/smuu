"use client";

import { TranslationProvider } from "@/lib/translations";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return (
    <TranslationProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <LandingPage />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </TranslationProvider>
  );
}
