import { CreditsPanel } from "../../components/credits-panel";

const mockProofs = [
  {
    label: "Reward Issued",
    digest: "5s3bP9h8n1d7a4k2m7x1t8q9n2c5f1e8z0v4m1r2",
    status: "Anchored on Sui"
  },
  {
    label: "Verification Proof",
    digest: "7t2kR4e1p9d3m6x8z2s4n5b1c7v3a9q2m6t8s1",
    status: "Validation recorded"
  }
];

export default function RewardsPage() {
  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Rewards + Proofs</p>
        <h2>Credits + On-chain Receipts</h2>
        <p className="lede-tight">
          Verified intelligence can issue credits and publish proof receipts on Sui. Use this view to validate rewards
          and digests during the demo.
        </p>
      </section>

      <CreditsPanel />

      <section className="panel">
        <p className="panel-label">Proof Ledger</p>
        <h2>Latest Digests</h2>
        <ul className="ledger-list">
          {mockProofs.map((proof) => (
            <li key={proof.digest}>
              <div className="ledger-row">
                <strong>{proof.label}</strong>
                <span className="badge-info">{proof.status}</span>
              </div>
              <p className="status-small">{proof.digest}</p>
              <a
                className="status-small"
                href={`https://explorer.sui.io/transaction/${proof.digest}?network=testnet`}
                target="_blank"
                rel="noreferrer"
              >
                Verify on Sui Explorer
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
