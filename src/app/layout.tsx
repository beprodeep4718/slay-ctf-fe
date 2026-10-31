import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import { event } from "@/config/event";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${event.name} | National Level Capture The Flag`,
  description: `${event.name} is a national level, on-site Capture The Flag competition at ${event.host}.`,
  // First flag of the hunt: this value is base64.
  other: { "arena-signal": "c2xheXt2aWV3X3NvdXJjZV9oYXVudHN9" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
