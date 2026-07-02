import type { Metadata } from "next";
import ClientWorkflowsFrame from "./ClientWorkflowsFrame";

export const metadata: Metadata = {
  title: "Client Workflows — GHL Ops Console | BVN",
  robots: { index: false, follow: false }, // internal tool — never indexed
};

export default function ClientWorkflowsPage() {
  return <ClientWorkflowsFrame />;
}
