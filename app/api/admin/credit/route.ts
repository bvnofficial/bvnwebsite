import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdmin } from "@/lib/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

// Finds an auth user by email using the service-role admin API (paginated).
async function findUserByEmail(admin: SupabaseClient, email: string) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    if (!data || data.users.length === 0) break;
    const found = data.users.find((u) => (u.email || "").toLowerCase() === target);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

// Admin-only: manually add/remove credits from any account by email.
export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }
    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { email, amount, note } = await req.json();
    const targetEmail = String(email || "").trim();
    const value = Math.trunc(Number(amount));

    if (!targetEmail) {
      return NextResponse.json({ error: "Enter an account email." }, { status: 400 });
    }
    if (!value || Number.isNaN(value)) {
      return NextResponse.json({ error: "Enter a non-zero whole number." }, { status: 400 });
    }
    if (Math.abs(value) > 1_000_000) {
      return NextResponse.json({ error: "Amount out of range." }, { status: 400 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Credits are not set up yet." }, { status: 503 });
    }

    const target = await findUserByEmail(admin, targetEmail);
    if (!target) {
      return NextResponse.json(
        { error: `No account found for ${targetEmail}.` },
        { status: 404 }
      );
    }

    const desc = note?.trim()
      ? `Admin adjustment: ${note.trim()}`
      : `Admin adjustment by ${user.email}`;

    const { data: balance, error } = await admin.rpc("admin_adjust_credits", {
      p_user: target.id,
      p_amount: value,
      p_desc: desc,
    });

    if (error) {
      console.error("admin_adjust_credits rpc error:", error);
      return NextResponse.json(
        { error: "Adjustment failed. Has the credits SQL migration been run?" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      email: target.email,
      name: target.user_metadata?.full_name ?? null,
      amount: value,
      balance,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("admin credit route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
