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
  faction_tag: string | null;
  signal_type: "enemy_sighting" | "resource_cluster" | "safe_route" | "jump_activity" | "trade_signal" | "manual_report";
  source: "player" | "system" | "world_event" | "knowledge_base";
  summary: string;
  intensity: number;
  importance_score: number;
  confidence_score: number;
  verification_state: "unverified" | "emerging" | "verified" | "contested" | "stale";
  dedupe_hash: string;
  source_count: number;
  unique_sources: number;
  unique_factions: number;
  consensus_score: number;
  recency_score: number;
  reputation_score: number;
  confidence_components: Json | null;
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

export type RouteSummaryRow = {
  origin_location: string;
  destination_location: string;
  threat_score: number;
  safety_score: number;
  confidence_score: number;
  verification_state: "unverified" | "emerging" | "verified" | "contested" | "stale";
  route_state: string;
  advisory: Json | null;
  top_signals: Json | null;
  updated_at: string;
};

export type FactionIntelRow = {
  faction: string;
  report_count: number;
  verified_count: number;
  avg_confidence: number;
  dominant_signal: ReportRow["signal_type"] | null;
  top_locations: Json | null;
  updated_at: string;
};

export type StructuredIntelSnapshotRow = {
  id: string;
  snapshot_type: string;
  payload: Json;
  walrus_blob_id: string | null;
  route_count: number;
  sector_count: number;
  faction_count: number;
  created_at: string;
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
  lifetime_credits: number;
  tier_progress: number;
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
  action_key: string | null;
  delta: number;
  importance_score: number;
  usefulness_score: number;
  verification_outcome: string | null;
  balance_after: number | null;
  access_tier_snapshot: string | null;
  metadata: Json | null;
  created_at: string;
};

export type AccessTierRow = {
  tier_id: string;
  display_name: string;
  min_credits: number;
  description: string | null;
  privileges: Json | null;
  is_default: boolean;
  created_at: string;
};

export type ContributionActionRow = {
  action_key: string;
  display_name: string;
  description: string | null;
  base_reward: number;
  importance_weight: number;
  usefulness_weight: number;
  metadata: Json | null;
  is_active: boolean;
  created_at: string;
};
