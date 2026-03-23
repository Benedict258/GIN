"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useConnection } from "@evefrontier/dapp-kit";
import type { ProfileContext as ProfileContextType } from "@gin/shared";
import { connectProfile } from "../lib/api";

export type ProfileStatus = "idle" | "connecting" | "connected" | "error";

interface ProfileState {
  status: ProfileStatus;
  walletAddress?: string;
  profileContext?: ProfileContextType;
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
      const profileContext = await connectProfile(walletAddress);
      setState({ status: "connected", walletAddress, profileContext });
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

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
