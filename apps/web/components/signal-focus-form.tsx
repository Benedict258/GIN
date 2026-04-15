"use client";

import { FormEvent, useState } from "react";
import CornerFrameAnimatedButton from "@/components/ui/corner-frame-animated-button-1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCharacterLimit } from "@/components/hooks/use-character-limit";
import { cn } from "@/lib/utils";
import { useProfile } from "../hooks/useProfile";
import { updateProfilePreferences } from "../lib/api";
import { isLocalProfileId, saveLocalFocus } from "../lib/demo-local";

type SignalFocusFormProps = {
  className?: string;
};

export function SignalFocusForm({ className }: SignalFocusFormProps) {
  const profileState = useProfile();
  const profileId = profileState.profileContext?.profile.id;
  const walletAddress = profileState.walletAddress;
  const { value, characterCount, handleChange, maxLength } = useCharacterLimit({ maxLength: 40 });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("Set a focus sector so GIN prioritizes alerts and advisor context.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profileId) {
      setStatus("error");
      setMessage("Connect your wallet to save focus sectors.");
      return;
    }

    setStatus("saving");
    setMessage("Syncing alert preferences...");

    try {
      if (isLocalProfileId(profileId)) {
        saveLocalFocus(profileId, value.trim());
        setStatus("success");
        setMessage(value.trim() ? `Tracking ${value.trim()} (local demo mode)` : "Focus reset to global feed.");
        return;
      }

      await updateProfilePreferences(
        {
          profileId,
          lastKnownSector: value.trim() || undefined
        },
        walletAddress
      );
      setStatus("success");
      setMessage(value.trim() ? `Tracking ${value.trim()}` : "Focus reset to global feed.");
      setTimeout(() => {
        setStatus("idle");
      }, 3500);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to update focus");
    }
  }

  const statusClass =
    status === "error"
      ? "text-red-400"
      : status === "success"
        ? "text-[var(--primary)]"
        : "text-muted-foreground";

  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border bg-background/80 p-6 text-foreground shadow-xl backdrop-blur lg:p-8",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="panel-label text-xs tracking-[0.3em] text-accent">Signal Focus</p>
          <h3 className="mt-2 text-2xl font-semibold">Prioritize a sector</h3>
          <p className={`mt-2 text-sm ${statusClass}`}>{message}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {characterCount}/{maxLength} characters
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:flex-1">
          <Label htmlFor="focus-sector">Sector or structure</Label>
          <Input
            id="focus-sector"
            placeholder="Jegou Relay, Utopia Prime, or custom tags"
            value={value}
            onChange={handleChange}
            className="mt-2"
            disabled={!profileId || status === "saving"}
          />
        </div>
        <CornerFrameAnimatedButton
          type="submit"
          buttonText={status === "saving" ? "Saving..." : "Update Focus"}
          className="mt-2 w-full rounded-md text-base text-white md:w-auto"
          color="bg-[var(--primary)]"
          disabled={!profileId || status === "saving"}
        />
      </form>
    </section>
  );
}
