import { Geist, Geist_Mono } from "next/font/google";

// Shared by every file that renders its own <html> (the [lang] layout and
// global-not-found.tsx), so they load the same font files once.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
