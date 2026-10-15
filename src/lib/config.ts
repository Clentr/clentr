/** Runtime settings. Everything optional switches off cleanly when its setting is missing. */
export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  /** e.g. "clentr/30min" — the part after cal.com/ */
  // Falls back to the studio's public booking page, used for the link sent to approved call requests.
  calLink: (process.env.NEXT_PUBLIC_CAL_LINK || "dinesh-kotipalli-opwmsq/30min").replace(/^https?:\/\/(app\.)?cal\.com\//, "").replace(/^\/+|\/+$/g, ""),
};

export const hasSupabase = Boolean(config.supabaseUrl && config.supabaseAnonKey);

/** Emails allowed into /admin (comma-separated in ADMIN_EMAILS). Server only. */
export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
