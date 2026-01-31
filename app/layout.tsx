import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Livestoq — Redefining the way livestock is trusted",
  description: "AI-assisted livestock marketplace designed to reduce livestock transaction fraud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
