module gin_extension::gin_extension;

use sui::event;
use sui::object::{Self, ID, UID};
use sui::transfer;
use sui::tx_context::TxContext;
use world::access::OwnerCap;
use world::character::Character;
use world::inventory::Item;
use world::storage_unit::StorageUnit;

/// GIN extension witness type.
public struct GinAuth has drop {}

/// Shared state for tracking GIN extension activity.
public struct GinExtensionState has key {
    id: UID,
    total_submissions: u64,
}

/// Emitted when a GIN submission is recorded.
public struct SubmissionRecorded has copy, drop {
    storage_unit_id: ID,
    reporter: address,
    digest: vector<u8>,
    confidence_score: u64,
    sequence: u64,
}

fun init(ctx: &mut TxContext) {
    let state = GinExtensionState { id: object::new(ctx), total_submissions: 0 };
    transfer::share_object(state);
}

/// Authorize the GIN extension on a storage unit.
public entry fun authorize_on_storage_unit(
    storage_unit: &mut StorageUnit,
    owner_cap: &OwnerCap<StorageUnit>,
) {
    world::storage_unit::authorize_extension<GinAuth>(storage_unit, owner_cap);
}

/// Record a submission reference for auditing and proof.
public entry fun record_submission(
    state: &mut GinExtensionState,
    storage_unit: &StorageUnit,
    digest: vector<u8>,
    confidence_score: u64,
    ctx: &mut TxContext,
) {
    let sequence = state.total_submissions + 1;
    state.total_submissions = sequence;
    event::emit(SubmissionRecorded {
        storage_unit_id: object::id(storage_unit),
        reporter: tx_context::sender(ctx),
        digest,
        confidence_score,
        sequence,
    });
}

/// Owner-only deposit path, wraps storage_unit::deposit_by_owner.
public entry fun deposit_item_by_owner(
    storage_unit: &mut StorageUnit,
    item: Item,
    character: &Character,
    owner_cap: &OwnerCap<StorageUnit>,
    ctx: &mut TxContext,
) {
    world::storage_unit::deposit_by_owner<StorageUnit>(
        storage_unit,
        item,
        character,
        owner_cap,
        ctx,
    );
}

/// Owner-only withdraw path, wraps storage_unit::withdraw_by_owner.
public entry fun withdraw_item_by_owner(
    storage_unit: &mut StorageUnit,
    character: &Character,
    owner_cap: &OwnerCap<StorageUnit>,
    type_id: u64,
    quantity: u32,
    ctx: &mut TxContext,
) {
    let item = world::storage_unit::withdraw_by_owner<StorageUnit>(
        storage_unit,
        character,
        owner_cap,
        type_id,
        quantity,
        ctx,
    );
    transfer::public_transfer(item, tx_context::sender(ctx));
}
