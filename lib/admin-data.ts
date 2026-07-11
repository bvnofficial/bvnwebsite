// Server-only: aggregates the admin user list — everyone who registered, their
// current credit balance, how many credits they've bought, when they were last
// active, and which items they've unlocked. Uses the service-role client.
import { createAdminClient } from "@/utils/supabase/admin";
import { getCreditItem } from "@/lib/credit-catalog";
import { getCourse } from "@/lib/courses";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  lastActive: string | null; // last sign-in
  balance: number;           // current wallet balance
  purchased: number;         // total credits bought via top-up
  items: string[];           // friendly names of unlocked items
}

export interface AdminUsersResult {
  ready: boolean;        // false if Supabase env missing
  creditsReady: boolean; // false if the credits tables aren't migrated yet
  users: AdminUserRow[];
}

// Turns an entitlement item_id into a human-readable label.
function labelForItem(itemId: string): string {
  const item = getCreditItem(itemId);
  if (item) return item.name;
  if (itemId.startsWith("certificate:")) {
    const slug = itemId.slice("certificate:".length);
    const course = getCourse(slug);
    return `Certificate — ${course?.title ?? slug}`;
  }
  return itemId;
}

export async function getAdminUsers(): Promise<AdminUsersResult> {
  const admin = createAdminClient();
  if (!admin) return { ready: false, creditsReady: false, users: [] };

  // 1. All registered auth users (paginated).
  const authUsers: Omit<AdminUserRow, "balance" | "purchased" | "items">[] = [];
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data || data.users.length === 0) break;
    for (const u of data.users) {
      authUsers.push({
        id: u.id,
        email: u.email || "—",
        name: (u.user_metadata?.full_name as string) ?? null,
        createdAt: u.created_at,
        lastActive: u.last_sign_in_at ?? null,
      });
    }
    if (data.users.length < 200) break;
  }

  // 2. Wallet balances.
  const balByUser = new Map<string, number>();
  const { data: wallets, error: wErr } = await admin.from("wallets").select("user_id,balance");
  const creditsReady = !wErr;
  for (const w of wallets ?? []) balByUser.set(w.user_id, w.balance);

  // 3. Total credits purchased (top-ups only, not admin adjustments).
  const purchasedByUser = new Map<string, number>();
  const { data: txs } = await admin
    .from("credit_transactions")
    .select("user_id,amount,kind")
    .eq("kind", "topup");
  for (const t of txs ?? []) {
    purchasedByUser.set(t.user_id, (purchasedByUser.get(t.user_id) ?? 0) + t.amount);
  }

  // 4. Unlocked items per user (entitlements).
  const itemsByUser = new Map<string, string[]>();
  const { data: ents } = await admin.from("entitlements").select("user_id,item_id");
  for (const e of ents ?? []) {
    const arr = itemsByUser.get(e.user_id) ?? [];
    arr.push(labelForItem(e.item_id));
    itemsByUser.set(e.user_id, arr);
  }

  const users: AdminUserRow[] = authUsers
    .map((u) => ({
      ...u,
      balance: balByUser.get(u.id) ?? 0,
      purchased: purchasedByUser.get(u.id) ?? 0,
      items: itemsByUser.get(u.id) ?? [],
    }))
    // Newest registrations first.
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return { ready: true, creditsReady, users };
}
