"use client";

import type { ReactNode } from "react";
import { useProfile } from "../hooks/useProfile";
import { hasPanelAccess } from "../lib/access";

interface PanelGateProps {
  panelKey: string;
  fallback: ReactNode;
  children: ReactNode;
}

export function PanelGate({ panelKey, fallback, children }: PanelGateProps) {
  const { accessStatus } = useProfile();
  const allowed = hasPanelAccess(accessStatus, panelKey);

  if (allowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
