import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export const metadata: Metadata = {
  title: {
    default: "Subredify — Reply to Reddit Threads That Rank on Google",
    template: "%s | Subredify",
  },
  description:
    "Subredify monitors Reddit for ICP conversations, scores threads for Google rank probability, and generates subreddit-rule-compliant reply drafts. Find your buyers. Reply early. Rank faster.",
  metadataBase: new URL(BASE_URL),
  keywords: [
    "reddit monitoring",
    "reddit icp",
    "reddit seo",
    "subreddit monitoring",
    "reddit reply tool",
    "reddit rank opportunity",
    "b2b reddit marketing",
    "icp conversations reddit",
  ],
  authors: [{ name: "Subredify", url: BASE_URL }],
  creator: "Subredify",
  publisher: "Subredify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Subredify",
  },
  twitter: {
    card: "summary_large_image",
    site: "@subredify",
    creator: "@subredify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-mono bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
