import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";
import CommandCenterClient from "./CommandCenterClient";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Client Command Center | BVN",
    description:
      "The BVN Official client command center: every live build, paid task, and interactive application demo in one place, with status and direct links.",
    path: "/clients",
    ogTitle: "BVN Client Command Center",
    eyebrow: "Command Center",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function ClientsIndexPage() {
  return <CommandCenterClient />;
}
