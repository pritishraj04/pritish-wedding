import { Cormorant_Garamond, Great_Vibes, Montserrat, Playfair_Display, Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const wonderling = localFont({
  src: "../public/assets/fonts/the-wonderling-font-family/trialwonderling-regular.otf",
  variable: "--font-wonderling",
  display: "swap",
});

const hallbothy = localFont({
  src: "../public/assets/fonts/hallbothy-font/Hallbothy-Regular.ttf",
  variable: "--font-hallbothy",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


import type { Viewport } from 'next';
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", cormorant.variable, greatVibes.variable, playfair.variable, "font-sans", geist.variable, wonderling.variable, hallbothy.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-black text-[#F5E6C8] overflow-hidden">{children}</body>
    </html>
  );
}
