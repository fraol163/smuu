"use client";

import { TranslationProvider } from "@/lib/translations";
import { AuthProvider } from "@/lib/auth-context";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </TranslationProvider>
  );
}
