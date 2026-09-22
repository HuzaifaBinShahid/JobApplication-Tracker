import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Application Ledger",
  description: "A calm, practical record of every job application."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
