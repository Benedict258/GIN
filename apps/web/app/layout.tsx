import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIN",
  description: "Galactic Intelligence Network for EVE Frontier"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
