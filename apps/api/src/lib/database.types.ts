export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ReportRow = {
  id: string;
  reporter_id: string;
  location: string;
  signal_type: "enemy_sighting" | "resource_cluster" | "safe_route" | "jump_activity" | "trade_signal" | "manual_report";
  source: "player" | "system" | "world_event" | "knowledge_base";
  summary: string;
  intensity: number;
  importance_score: number;
  confidence_score: number;
  verification_state: "unverified" | "emerging" | "verified" | "contested" | "stale";
  metadata: Json | null;
  created_at: string;
  updated_at: string;
};

export type SectorSummaryRow = {
  location: string;
  threat_score: number;
  opportunity_score: number;
  confidence_score: number;
  verification_state: "unverified" | "emerging" | "verified" | "contested" | "stale";
  top_signals: Json | null;
  updated_at: string;
};

export type RecommendationRow = {
  id: string;
  profile_id: string | null;
  title: string;
  summary: string;
  recommended_action: string;
  confidence_score: number;
  evidence: Json | null;
  related_locations: Json | null;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  wallet_address: string | null;
  handle: string | null;
  display_name: string | null;
  access_tier: string;
  created_at: string;
  updated_at: string;
};

export type ContributorProfileRow = {
  profile_id: string;
  reputation_score: number;
  credits_balance: number;
  contribution_count: number;
  last_contribution_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreditEventRow = {
  id: string;
  profile_id: string;
  event_type:
    | "report_submitted"
    | "report_confirmed"
    | "report_disputed"
    | "world_data_contributed"
    | "intel_purchased"
    | "manual_adjustment";
  delta: number;
  importance_score: number;
  metadata: Json | null;
  created_at: string;
};
