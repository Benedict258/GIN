# GIN SSU Extension

This Move package defines a GIN extension module for EVE Frontier Smart Storage Units (SSU).
It provides:

- `GinAuth` witness for authorizing storage unit extensions.
- `authorize_on_storage_unit` entry function to register the extension.
- Safe, owner-only deposit/withdraw wrappers.
- `record_submission` event for anchoring intel references.

Dependencies:
- `world` Move package from EVE Frontier world contracts.

Update `Move.toml` dependencies and addresses if your world package lives elsewhere.
