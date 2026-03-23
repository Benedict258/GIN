"use client";

import { useContext } from "react";
import { ProfileContext } from "../context/profile-context";

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }

  return context;
}
