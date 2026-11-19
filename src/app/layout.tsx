import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins, Parisienne } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--ff-serif",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--ff-sans",
  display: "swap",
});

const parisienne = Parisienne({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--ff-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Senior Hub — Coppell High School",
  description:
    "Your one-stop hub for all senior information. Announcements, events, deadlines and resources for the Class of 2027.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Senior Hub",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#100d0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${parisienne.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
