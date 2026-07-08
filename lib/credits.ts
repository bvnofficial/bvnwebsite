// Server-side wallet reads. Uses the service-role admin client (bypasses RLS).
// SERVER ONLY — never import into a client component.
import { createAdminClient } from "@/utils/supabase/admin";

export interface CreditTx {
  id: string;
  amount: number;
  kind: string;
  description: string | null;
  created_at: string;
}

export interface WalletData {
  ready: boolean; // false when Supabase env or the credits tables aren't set up yet
  balance: number;
  transactions: CreditTx[];
  entitlements: string[]; // owned item ids
}

const EMPTY: WalletData = { ready: false, balance: 0, transactions: [], entitlements: [] };

export async function getWalletData(userId: string): Promise<WalletData> {
  const admin = createAdminClient();
  if (!admin) return EMPTY;

  try {
    const [walletRes, txRes, entRes] = await Promise.all([
      admin.from("wallets").select("balance").eq("user_id", userId).maybeSingle(),
      admin
        .from("credit_transactions")
        .select("id,amount,kind,description,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),
      admin.from("entitlements").select("item_id").eq("user_id", userId),
    ]);

    // Table missing (migration not run yet) → not ready.
    if (walletRes.error) return EMPTY;

    return {
      ready: true,
      balance: walletRes.data?.balance ?? 0,
      transactions: (txRes.data as CreditTx[]) ?? [],
      entitlements: (entRes.data ?? []).map((e: { item_id: string }) => e.item_id),
    };
  } catch {
    return EMPTY;
  }
}
