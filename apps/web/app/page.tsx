import Link from "next/link";
import DataGridHero from "../components/ui/data-grid-hero";

export default function Home() {
  return (
    <div className="content-grid">
      <section className="panel panel-wide">
        <p className="panel-label">Intel Ops</p>
        <h2>Galactic Intelligence Network</h2>
        <p className="lede-tight">
          GIN is a verification-first intelligence layer for EVE Frontier. Operators submit reports, the trust pipeline
          validates them, and only cleared intel becomes actionable for fleets and assemblies.
        </p>
      </section>

      <section className="panel panel-wide">
        <DataGridHero
          rows={18}
          cols={28}
          spacing={3}
          duration={6}
          color="rgba(255, 107, 44, 0.18)"
          animationType="pulse"
          pulseEffect
          mouseGlow
          opacityMin={0.05}
          opacityMax={0.55}
          background="rgba(8, 13, 18, 0.85)"
        >
          <h1>Intel Ops Command Console</h1>
          <p>
            Connect a wallet, submit operational intelligence, and watch trusted signals propagate through the
            verification mesh before they reach the field.
          </p>
          <div className="hero-actions">
            <Link className="action-button" href="/overview">
              Enter Intel Ops
            </Link>
            <Link className="action-button ghost" href="/submit">
              Submit Intel
            </Link>
          </div>
        </DataGridHero>
      </section>
    </div>
  );
}
