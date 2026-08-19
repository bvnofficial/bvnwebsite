import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";

export const metadata = {
  title: "Full Schematics | BVN",
  robots: { index: false, follow: false },
};

// Admin-gated view of the internal BVN Full Schematics. Same gate as /admin.
// The document is served from /admin/schematics/raw and embedded full screen,
// so its own branding, watermark and print styles stay isolated.
export const dynamic = "force-dynamic";

export default async function SchematicsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/dashboard");

  return (
    <>
      <Link
        href="/admin"
        style={{
          position: "fixed",
          top: 14,
          left: 16,
          zIndex: 70,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(10,10,10,0.82)",
          color: "#fff",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          padding: "8px 14px",
          borderRadius: 9,
          backdropFilter: "blur(6px)",
        }}
      >
        ← Admin
      </Link>
      <iframe
        src="/admin/schematics/raw"
        title="BVN Full Schematics"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          border: 0,
          zIndex: 60,
        }}
      />
    </>
  );
}
