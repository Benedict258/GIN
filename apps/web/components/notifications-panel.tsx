"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Notification } from "@gin/shared";
import { fetchProfilePreferences, updateProfilePreferences } from "../lib/api";
import { useProfile } from "../hooks/useProfile";
import { getLocalFocus, isLocalProfileId, saveLocalFocus } from "../lib/demo-local";

const severityCopy: Record<Notification["severity"], string> = {
  info: "Advisory",
  warning: "Warning",
  danger: "Critical"
};

type NotificationsPanelProps = {
  notifications: Notification[];
};

export function NotificationsPanel({ notifications }: NotificationsPanelProps) {
  const latestNotifications = notifications.slice(0, 6);
  const profileState = useProfile();
  const profileId = profileState.profileContext?.profile.id;
  const walletAddress = profileState.walletAddress;
  const [sectorPreference, setSectorPreference] = useState("");
  const [alertOptIn, setAlertOptIn] = useState(true);
  const [prefStatus, setPrefStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [prefMessage, setPrefMessage] = useState("");

  useEffect(() => {
    if (!profileId) {
      setSectorPreference("");
      setAlertOptIn(true);
      setPrefStatus("idle");
      setPrefMessage("");
      return;
    }

    let cancelled = false;
    setPrefStatus("loading");
    setPrefMessage("Syncing preferences...");

    if (isLocalProfileId(profileId)) {
      const localFocus = getLocalFocus(profileId);
      setSectorPreference(localFocus);
      setAlertOptIn(true);
      setPrefStatus("idle");
      setPrefMessage("Local demo preferences loaded");
      return;
    }

    fetchProfilePreferences(profileId, walletAddress)
      .then((preference) => {
        if (cancelled) {
          return;
        }
        setSectorPreference(preference.lastKnownSector ?? "");
        setAlertOptIn(preference.alertOptIn);
        setPrefStatus("idle");
        setPrefMessage("");
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setPrefStatus("error");
        setPrefMessage(error instanceof Error ? error.message : "Failed to load preferences");
      });

    return () => {
      cancelled = true;
    };
  }, [profileId, walletAddress]);

  const preferenceStatusClass = useMemo(() => {
    if (prefStatus === "error") {
      return "status-small status-error";
    }
    if (prefStatus === "success") {
      return "status-small status-success";
    }
    return "status-small";
  }, [prefStatus]);

  async function handlePreferencesSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profileId) {
      return;
    }

    setPrefStatus("loading");
    setPrefMessage("Saving preferences...");

    try {
      if (isLocalProfileId(profileId)) {
        saveLocalFocus(profileId, sectorPreference.trim());
        setPrefStatus("success");
        setPrefMessage("Preferences synced locally");
        setTimeout(() => {
          setPrefStatus("idle");
          setPrefMessage("");
        }, 3200);
        return;
      }

      const preference = await updateProfilePreferences(
        {
          profileId,
          alertOptIn,
          lastKnownSector: sectorPreference.trim() || undefined
        },
        walletAddress
      );
      setSectorPreference(preference.lastKnownSector ?? "");
      setAlertOptIn(preference.alertOptIn);
      setPrefStatus("success");
      setPrefMessage("Preferences synced");
      setTimeout(() => {
        setPrefStatus("idle");
        setPrefMessage("");
      }, 3200);
    } catch (error) {
      setPrefStatus("error");
      setPrefMessage(error instanceof Error ? error.message : "Failed to update preferences");
    }
  }

  return (
    <article className="panel">
      <p className="panel-label">Intel Updates</p>
      <h2>Operational Alerts</h2>
      {latestNotifications.length ? (
        <ul className="notification-list">
          {latestNotifications.map((notification) => (
            <li key={notification.id}>
              <div className="notification-header">
                <div>
                  <strong>{notification.title}</strong>
                  {notification.sector ? <span className="status-small">{notification.sector}</span> : null}
                </div>
                <span className={`badge-${notification.severity}`}>
                  {severityCopy[notification.severity]}
                </span>
              </div>
              <p className="status">{notification.message}</p>
              <p className="status-small">
                {new Date(notification.createdAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </p>
              {notification.actionUrl ? (
                <a className="status-small" href={notification.actionUrl} target="_blank" rel="noreferrer">
                  View instructions
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="status">No live broadcasts. Submit data or trigger a cycle to wake GIN.</p>
      )}

      <section className="notification-preferences">
        <p className="panel-label">Alert Focus</p>
        {profileId ? (
          <form onSubmit={handlePreferencesSubmit} className="preference-form">
            <div className="field-group preference-field">
              <span>Focus Sector</span>
              <input
                type="text"
                placeholder="e.g. Jegou Relay"
                value={sectorPreference}
                onChange={(event) => setSectorPreference(event.target.value)}
              />
            </div>
            <label className="preference-toggle">
              <input
                type="checkbox"
                checked={alertOptIn}
                onChange={(event) => setAlertOptIn(event.target.checked)}
              />
              <span>Receive broadcast pings</span>
            </label>
            <button className="save-preferences-button" type="submit" disabled={prefStatus === "loading"}>
              {prefStatus === "loading" ? "Saving..." : "Save Preferences"}
            </button>
            {prefMessage ? <p className={preferenceStatusClass}>{prefMessage}</p> : null}
          </form>
        ) : (
          <p className="status">Connect your wallet to focus alerts on a sector.</p>
        )}
      </section>
    </article>
  );
}
