import type { Metadata } from "next";
import { Big_Shoulders, JetBrains_Mono } from "next/font/google";
import { event } from "@/config/event";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${event.name} | National Level Capture The Flag`,
  description: `${event.name} ${event.edition} is a 3-hour online jeopardy cybersecurity tournament by ${event.organizer}, ${event.organizerRole}.`,
  // First flag of the hunt: this value is base64.
  other: { "arena-signal": "U0xBWXt2aWV3X3NvdXJjZV9oYXVudHN9" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${jetbrains.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
