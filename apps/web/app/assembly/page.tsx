import { Suspense } from "react";
import { FrontierContextBadge } from "../../components/frontier-context-badge";
import { DAppKitSlot } from "../../components/dapp-kit-slot";

export const dynamic = "force-dynamic";

const proofItems = [
  {
    label: "Artifact publish",
    digest: "Gy3mD1eX2rS4a9n2T7qF7q4yR1d9X0d8n8v1h2k3",
    status: "Anchored on Sui"
  },
  {
    label: "Contributor credits",
    digest: "9oT3kQ6fT6a1b1d8p1f7x2g9m3k2d1j5m9z1p7s2",
    status: "Reward settled"
  }
];

export default function AssemblyPage() {
  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Assembly View</p>
        <h2>Smart Object Context</h2>
        <p className="lede-tight">
          GIN operates inside a live Utopia assembly context. Connect EVE Vault to bind the current smart object and
          sync intelligence to the in-world operator view.
        </p>
      </section>

      <section className="panel">
        <p className="panel-label">Frontier Link</p>
        <h2>Wallet + Identity</h2>
        <div className="status-card">
          <FrontierContextBadge />
        </div>
      </section>

      <Suspense fallback={<article className="panel">Loading assembly context...</article>}>
        <DAppKitSlot />
      </Suspense>

      <section className="panel panel-wide">
        <p className="panel-label">Recent Proofs</p>
        <h2>On-chain Receipts</h2>
        <ul className="ledger-list">
          {proofItems.map((proof) => (
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
