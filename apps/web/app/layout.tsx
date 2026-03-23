import type { Metadata } from "next";
import "./globals.css";
import { ProvidersSlot } from "../components/providers-slot";

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
      <body>
        <ProvidersSlot>{children}</ProvidersSlot>
      </body>
    </html>
  );
}
