"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
