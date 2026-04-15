"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { AssistantReply } from "@gin/shared";
import { queryAssistant, updateProfilePreferences } from "../lib/api";
import { useProfile } from "../hooks/useProfile";
import { isLocalProfileId, saveLocalFocus } from "../lib/demo-local";

type Message = {
  role: "user" | "assistant";
  content: string;
  reply?: AssistantReply;
};

export function AssistantPanel() {
  const profileState = useProfile();
  const profileId = profileState.profileContext?.profile.id;
  const [focusSector, setFocusSector] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    const userMessage: Message = { role: "user", content: prompt.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setStatus("idle");
    setStatusMessage("");

    startTransition(async () => {
      try {
        const response = await queryAssistant({
          prompt: userMessage.content,
          profileId,
          sector: focusSector.trim() || undefined
        });
        setMessages((prev) => [...prev, { role: "assistant", content: response.reply, reply: response }]);
      } catch (error) {
        setStatus("error");
        setStatusMessage(error instanceof Error ? error.message : "Assistant query failed");
      }
    });
  }

  async function handleFocusSave() {
    if (!profileId || !focusSector.trim()) {
      return;
    }

    try {
      if (isLocalProfileId(profileId)) {
        saveLocalFocus(profileId, focusSector.trim());
        setStatus("idle");
        setStatusMessage("Alert focus updated in local demo mode.");
        return;
      }

      await updateProfilePreferences({ profileId, lastKnownSector: focusSector.trim() }, profileState.walletAddress);
      setStatus("idle");
      setStatusMessage("Alert focus updated.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Failed to update alert focus");
    }
  }

  return (
    <article className="panel panel-wide">
      <p className="panel-label">GIN Advisor</p>
      <h2>Chat with the network</h2>
      <p className="status">
        Ask for safe routes, deployment checklists, or escalation advice. Answers are grounded in the latest knowledge
        articles and contributor intel.
      </p>

      <div className="inline-form">
        <label className="field-group">
          <span>Alert focus sector</span>
          <input
            type="text"
            value={focusSector}
            onChange={(event) => setFocusSector(event.target.value)}
            placeholder="Jegou Relay"
          />
        </label>
        <button className="action-button" type="button" onClick={handleFocusSave} disabled={!profileId || !focusSector.trim()}>
          Save focus
        </button>
      </div>

      <form className="inline-form" onSubmit={handleAsk}>
        <label className="field-group" style={{ flex: 1 }}>
          <span>Question for GIN</span>
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="How do I secure Jegou?"
          />
        </label>
        <button className="action-button" type="submit" disabled={isPending || !prompt.trim()}>
          {isPending ? "Thinking..." : "Ask"}
        </button>
      </form>

      {status !== "idle" ? <p className={`status ${status === "error" ? "status-error" : "status-success"}`}>{statusMessage}</p> : null}

      <ul className="assistant-thread">
        {messages.map((message, index) => (
          <li key={`${message.role}-${index}`}>
            <strong>{message.role === "user" ? "You" : "GIN"}</strong>
            <p className="status">{message.content}</p>
            {message.reply?.suggestedActions?.length ? (
              <p className="status-small">Actions: {message.reply.suggestedActions.join(", ")}</p>
            ) : null}
            {message.reply?.relatedArticles?.length ? (
              <p className="status-small">
                Related guides: {message.reply.relatedArticles.map((article) => article.title).join(", ")}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
 }
