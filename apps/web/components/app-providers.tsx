"use client";

import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProfileProvider } from "../context/profile-context";
import { FrontierProvider } from "./frontier-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <FrontierProvider queryClient={queryClient}>
      <ProfileProvider>{children}</ProfileProvider>
    </FrontierProvider>
  );
}
