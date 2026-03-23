"use client";

import { EveFrontierProvider } from "@evefrontier/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ProfileProvider } from "../context/profile-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <EveFrontierProvider queryClient={queryClient}>
        <ProfileProvider>{children}</ProfileProvider>
      </EveFrontierProvider>
    </QueryClientProvider>
  );
}
