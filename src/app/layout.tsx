import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { siteUrl } from "@/lib/site-config";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Learn Maelstrom Labs",
    template: "%s | Learn Maelstrom Labs",
  },
  metadataBase: new URL(siteUrl),
  description:
    "A static knowledge base for electronics projects, tutorials, product notes, and hardware news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
