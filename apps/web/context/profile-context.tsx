"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConnection } from "@evefrontier/dapp-kit";
import type { AccessStatusResponse, CreditEvent, ProfileContext as ProfileContextType } from "@gin/shared";
import { connectProfile, fetchAccessStatus, fetchCreditsLedger } from "../lib/api";

export type ProfileStatus = "idle" | "connecting" | "connected" | "error";

interface ProfileState {
  status: ProfileStatus;
  walletAddress?: string;
  profileContext?: ProfileContextType;
  accessStatus?: AccessStatusResponse;
  ledger?: CreditEvent[];
  error?: string;
}

interface ProfileContextValue extends ProfileState {
  refresh: () => Promise<void>;
}

const noop = async () => {};

const defaultState: ProfileContextValue = {
  status: "idle",
  refresh: noop
};

export const ProfileContext = createContext<ProfileContextValue>(defaultState);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { isConnected, walletAddress } = useConnection();
  const [state, setState] = useState<ProfileState>({ status: "idle" });
  const demoFallbackRef = useRef(false);

  useEffect(() => {
    demoFallbackRef.current = false;
  }, [walletAddress]);

  const refresh = useCallback(async () => {
    if (!walletAddress || !isConnected) {
      setState({ status: "idle" });
      demoFallbackRef.current = false;
      return;
    }

    if (demoFallbackRef.current) {
      return;
    }

    setState({ status: "connecting", walletAddress });

    try {
      const profileContext = await retry(() => connectProfile(walletAddress, walletAddress));
      const profileId = profileContext.profile.id;

      const [accessStatusResult, ledgerResult] = await Promise.allSettled([
        retry(() => fetchAccessStatus(profileId, walletAddress)),
        retry(() => fetchCreditsLedger(profileId, 25, walletAddress))
      ]);

      const accessStatus = accessStatusResult.status === "fulfilled" ? accessStatusResult.value : undefined;
      const ledger = ledgerResult.status === "fulfilled" ? ledgerResult.value : undefined;

      setState({ status: "connected", walletAddress, profileContext, accessStatus, ledger });
    } catch (error) {
      const demo = buildDemoProfile(walletAddress);
      demoFallbackRef.current = true;
      setState({
        status: "connected",
        walletAddress,
        profileContext: demo.profileContext,
        accessStatus: demo.accessStatus,
        ledger: demo.ledger
      });
    }
  }, [isConnected, walletAddress]);

  useEffect(() => {
    if (!isConnected || !walletAddress) {
      setState({ status: "idle" });
      return;
    }

    void refresh();
  }, [isConnected, walletAddress, refresh]);

  useEffect(() => {
    if (!isConnected || !walletAddress) {
      return;
    }

    const handleFocus = () => {
      void refresh();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleFocus);
    };
  }, [isConnected, walletAddress, refresh]);

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

async function retry<T>(operation: () => Promise<T>, attempts = 2, delayMs = 300): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Operation failed");
}

function buildDemoProfile(walletAddress: string) {
  const now = new Date().toISOString();
  const profileId = `profile-${walletAddress.slice(-6)}`;
  const profileContext = {
    profile: {
      id: profileId,
      walletAddress,
      handle: "utopia-scout",
      displayName: "Utopia Scout",
      accessTier: "advisor",
      createdAt: now
    },
    contributor: {
      profileId,
      creditsBalance: 320,
      lifetimeCredits: 860,
      tierProgress: 72,
      reputationScore: 88,
      contributionCount: 14,
      lastContributionAt: now
    }
  };

  const tier = {
    tierId: "advisor",
    displayName: "Advisor",
    minCredits: 500,
    description: "Verified intel and advisory access",
    privileges: {
      panels: ["Verified Intel", "Advisor Snapshots", "Rewards"]
    },
    isDefault: false
  };

  const nextTier = {
    tierId: "command",
    displayName: "Command",
    minCredits: 1200,
    description: "Command briefings and fleet guidance",
    privileges: {},
    isDefault: false
  };

  const accessStatus = {
    profile: profileContext.profile,
    contributor: profileContext.contributor,
    tier,
    nextTier
  };

  const ledger = [
    {
      id: makeId(),
      profileId,
      eventType: "report_confirmed",
      actionKey: "report_confirmed",
      delta: 120,
      importanceScore: 62,
      usefulnessScore: 71,
      verificationOutcome: "verified",
      balanceAfter: 320,
      accessTierSnapshot: tier.displayName,
      metadata: { location: "Ikora Corridor", signal_type: "enemy_sighting" },
      createdAt: now
    },
    {
      id: makeId(),
      profileId,
      eventType: "world_data_contributed",
      actionKey: "world_data_contributed",
      delta: 40,
      importanceScore: 48,
      usefulnessScore: 59,
      verificationOutcome: "verified",
      balanceAfter: 200,
      accessTierSnapshot: tier.displayName,
      metadata: { location: "Utopia Prime", signal_type: "trade_signal" },
      createdAt: now
    }
  ];

  return { profileContext, accessStatus, ledger };
}

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `profile-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}
