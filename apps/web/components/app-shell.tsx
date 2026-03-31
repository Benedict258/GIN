import Link from "next/link";
import { StatusStrip } from "./status-strip";
import { NavToggle } from "./nav-toggle";

const NAV_ITEMS = [
  { label: "Overview", href: "/overview" },
  { label: "Submit Intel", href: "/submit" },
  { label: "Verified Intel", href: "/verified" },
  { label: "Assembly View", href: "/assembly" },
  { label: "Activity", href: "/activity" },
  { label: "Rewards", href: "/rewards" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="side-nav" id="primary-nav">
        <div className="brand">
          <span className="brand-mark">GIN</span>
          <span className="brand-subtitle">Galactic Intelligence Network</span>
        </div>
        <nav className="nav-list">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-footer">
          <p className="nav-footnote">Utopia-ready tactical console</p>
        </div>
      </aside>

      <div className="app-body">
        <header className="top-bar">
          <div className="topbar-left">
            <NavToggle />
            <div>
              <p className="panel-label">Faction Intelligence Network</p>
              <h1 className="topbar-title">Intel Ops</h1>
            </div>
          </div>
          <StatusStrip />
        </header>
        <div className="content-wrap">{children}</div>
      </div>
    </div>
  );
}
