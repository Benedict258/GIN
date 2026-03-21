"use client";

import dynamic from "next/dynamic";

const DAppKitShell = dynamic(
  () => import("./dapp-kit-shell").then((mod) => mod.DAppKitShell),
  {
    ssr: false,
    loading: () => <article className="panel">Loading dApp kit...</article>
  }
);

export function DAppKitSlot() {
  return <DAppKitShell />;
}
