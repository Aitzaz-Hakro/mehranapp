import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    "MUET past papers 2020",
    "MUET past papers 2019",
    "MUET past papers 2018",
    "MUET past papers 2017",
    "MUET past papers 2016",
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
  metadataBase: new URL("https://mehranapp.vercel.app/"),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "https://mehranapp.vercel.app/",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
