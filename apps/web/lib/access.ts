import type { AccessStatusResponse } from "@gin/shared";

const DEFAULT_PUBLIC_PANELS = ["reports", "sectors"];

export function extractPanelPrivileges(privileges?: Record<string, unknown>) {
  if (!privileges) {
    return [] as string[];
  }

  const panels = privileges["panels"];

  if (!Array.isArray(panels)) {
    return [] as string[];
  }

  return panels.filter((panel): panel is string => typeof panel === "string");
}

export function resolveUnlockedPanels(accessStatus?: AccessStatusResponse) {
  if (!accessStatus) {
    return DEFAULT_PUBLIC_PANELS;
  }

  const unlocked = extractPanelPrivileges(accessStatus.tier.privileges);
  return unlocked.length ? unlocked : DEFAULT_PUBLIC_PANELS;
}

export function hasPanelAccess(accessStatus: AccessStatusResponse | undefined, panelKey: string) {
  return resolveUnlockedPanels(accessStatus).includes(panelKey);
}
