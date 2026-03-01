import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SiteShell } from "@/components/layout/site-shell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";
import { PostHogProvider } from "@/components/Providers/PostHogProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next" 
import OneSignalInit from "@/components/layout/OneSignalInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "MUET past papers",
    "MUET past papers 2024",
    "MUET past papers 2023",
    "MUET past papers 2022",
    "MUET past papers 2021",
    "MUET achievements",
    "MUET student portal",
    "Mehran University past papers",
    "Mehran University achievements",
    "engineering past papers Pakistan",
    "MUET teacher wise past papers",
    "department wise past papers",
    "semester wise past papers",
    "MUET scholar archive",
    "MUET students",
    "Mehran University achievers",
    "MUET exam preparation",
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Mehran APP - Find past papers of every department, semester, and course at MUET.",
      },
    ],
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  verification: {
    google: "6FHF-lhzSA10Rwrfqof3DyiUNQ9ZcCpik06HVWa_F9s",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },

  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/icon-512x512.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PostHogProvider>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <OneSignalInit />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8GM2HSRMYN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8GM2HSRMYN');
          `}
        </Script>
        <Analytics />
        <SpeedInsights />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
    </PostHogProvider>
  );
}
