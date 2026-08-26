"use client";

import { PortalShell, AdminView } from "../shared";

export default function RegalAdminPage() {
  return (
    <PortalShell activeKey="admin">
      <AdminView />
    </PortalShell>
  );
}
