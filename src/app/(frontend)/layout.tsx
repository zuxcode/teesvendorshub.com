import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SiteNavbar } from "@/layout/nav-bar";

const jakarta = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  description: "Premium digital assets for the modern web.",
  title: "TeesVendorsHub",
};
export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem={true}
          storageKey="tees-theme"
        >
          <NextTopLoader
            color="linear-gradient(90deg, var(--primary) 0%, var(--primary) 50%, var(--accent) 100%)"
            crawl={true}
            crawlSpeed={200}
            easing="ease"
            height={4}
            initialPosition={0.08}
            shadow="0 0 12px var(--primary), 0 0 8px var(--accent), 0 0 6px var(--accent)"
            showSpinner={false}
            speed={200}
            template='<div class="bar" role="bar"><div class="peg"></div></div>'
          />
          <NuqsAdapter>
            <main className="py-6">
              <SiteNavbar />
              {children}
            </main>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster closeButton position="top-center" richColors />
      </body>
    </html>
  );
}
