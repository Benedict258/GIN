module gin::registry {
    use sui::event;

    public struct AdminCap has key, store {
        id: UID,
    }

    public struct GinState has key {
        id: UID,
        total_artifacts: u64,
        total_credits_awarded: u64,
    }

    public struct IntelligenceArtifact has key, store {
        id: UID,
        artifact_type: vector<u8>,
        walrus_blob_id: vector<u8>,
        confidence_score: u64,
        publisher: address,
        sequence: u64,
    }

    public struct ContributionReceipt has key, store {
        id: UID,
        contributor: address,
        credits: u64,
        report_digest: vector<u8>,
        sequence: u64,
    }

    public struct ArtifactPublished has copy, drop {
        publisher: address,
        confidence_score: u64,
        sequence: u64,
    }

    public struct CreditsAwarded has copy, drop {
        contributor: address,
        credits: u64,
        sequence: u64,
    }

    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap { id: object::new(ctx) };
        let state = GinState {
            id: object::new(ctx),
            total_artifacts: 0,
            total_credits_awarded: 0,
        };

        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::share_object(state);
    }

    public fun total_artifacts(state: &GinState): u64 {
        state.total_artifacts
    }

    public fun total_credits_awarded(state: &GinState): u64 {
        state.total_credits_awarded
    }

    public entry fun publish_artifact(
        _cap: &AdminCap,
        state: &mut GinState,
        artifact_type: vector<u8>,
        walrus_blob_id: vector<u8>,
        confidence_score: u64,
        ctx: &mut TxContext,
    ) {
        let sequence = state.total_artifacts + 1;
        state.total_artifacts = sequence;

        let artifact = IntelligenceArtifact {
            id: object::new(ctx),
            artifact_type,
            walrus_blob_id,
            confidence_score,
            publisher: tx_context::sender(ctx),
            sequence,
        };

        transfer::public_transfer(artifact, tx_context::sender(ctx));
        event::emit(ArtifactPublished {
            publisher: tx_context::sender(ctx),
            confidence_score,
            sequence,
        });
    }

    public entry fun award_credits(
        _cap: &AdminCap,
        state: &mut GinState,
        contributor: address,
        credits: u64,
        report_digest: vector<u8>,
        ctx: &mut TxContext,
    ) {
        let sequence = state.total_credits_awarded + 1;
        state.total_credits_awarded = sequence;

        let receipt = ContributionReceipt {
            id: object::new(ctx),
            contributor,
            credits,
            report_digest,
            sequence,
        };

        transfer::public_transfer(receipt, contributor);
        event::emit(CreditsAwarded {
            contributor,
            credits,
            sequence,
        });
    }
}
