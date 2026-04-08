import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gumball Machine — Daily Gumloop Credits",
  description: "Spin the gumball machine to earn daily Gumloop credits!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
