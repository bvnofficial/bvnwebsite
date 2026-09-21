"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VID_KEY = "bvn_vid";

// Logs one anonymous page view per route change to /api/track. A random visitor
// id in localStorage lets repeat visits count as one person — no account, no
// personal data. Renders nothing.
export default function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      let vid = localStorage.getItem(VID_KEY);
      if (!vid) {
        vid = crypto.randomUUID();
        localStorage.setItem(VID_KEY, vid);
      }
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: vid, path: pathname, referrer: document.referrer || "" }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [pathname]);
  return null;
}
