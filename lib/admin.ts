// Admin allowlist. Add emails here to grant admin access (manual credits, etc.).
// Kept simple + in-code so it's obvious who's privileged and easy to audit.
export const ADMIN_EMAILS = ["bvn@bvnofficial.com"];

export function isAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
