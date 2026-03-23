# Supabase Setup

This folder will hold the initial database schema and future migrations for GIN.

The first migration (`migrations/0001_initial_schema.sql`) establishes the MVP data model for:

- player and contributor identities
- reports and verification
- sector intelligence summaries
- recommendations
- GIN Credits and credit history

The second migration (`migrations/0002_seed_demo_data.sql`) seeds:

- a demo profile linked to a contributor record
- example contributor credit history
- two sector intelligence summaries
- starter recommendations so the UI renders meaningful cards after the first sync

To reset a local Supabase instance with both migrations applied, run `supabase db reset --local` from the repo root.
