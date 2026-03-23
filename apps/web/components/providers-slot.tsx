"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ClientProviders = dynamic(
  () => import("./app-providers").then((mod) => mod.AppProviders),
  {
    ssr: false,
    loading: () => null
  }
);

export function ProvidersSlot({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
