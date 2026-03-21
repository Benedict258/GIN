"use client";

import { EveFrontierProvider } from "@evefrontier/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AssemblyPanel } from "./assembly-panel";

export function DAppKitShell() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <EveFrontierProvider queryClient={queryClient}>
        <AssemblyPanel />
      </EveFrontierProvider>
    </QueryClientProvider>
  );
}
