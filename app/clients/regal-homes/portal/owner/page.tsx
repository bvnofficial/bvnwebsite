"use client";

import { PortalShell, OwnerView } from "../shared";

export default function RegalOwnerPage() {
  return (
    <PortalShell activeKey="owner">
      <OwnerView />
    </PortalShell>
  );
}
