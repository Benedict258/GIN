import type { Metadata } from "next";
import "./globals.css";
import { ProvidersSlot } from "../components/providers-slot";
import { AppShell } from "../components/app-shell";

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
        <ProvidersSlot>
          <AppShell>{children}</AppShell>
        </ProvidersSlot>
      </body>
    </html>
  );
}
