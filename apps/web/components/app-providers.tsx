"use client";

import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProfileProvider } from "../context/profile-context";
import { EveFrontierProvider } from "./frontier-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <EveFrontierProvider queryClient={queryClient}>
      <ProfileProvider>{children}</ProfileProvider>
    </EveFrontierProvider>
  );
}
