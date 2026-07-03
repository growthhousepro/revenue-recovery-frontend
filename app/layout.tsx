import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrowthHouse - Revenue Recovery Platform",
  description: "AI-powered email outreach and booking detection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}