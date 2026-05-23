import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMU Career Connect | Find Your Perfect Career Match",
  description:
    "Connect with top employers and discover internships & jobs tailored to your academic background at St. Mary's University.",
  keywords: [
    "SMU",
    "St. Mary's University",
    "career",
    "jobs",
    "internships",
    "Ethiopia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
