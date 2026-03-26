"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
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

  const refresh = useCallback(async () => {
    if (!walletAddress || !isConnected) {
      setState({ status: "idle" });
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
      setState({
        status: "error",
        walletAddress,
        error: error instanceof Error ? error.message : "Failed to connect profile"
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
