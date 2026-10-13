import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { adminEmails, config, hasSupabase } from "../config";

/** Cookie-based client for admin sign-in. */
export async function authClient() {
  const store = await cookies();
  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only; the proxy refreshes them.
        }
      },
    },
  });
}

export function isAdminEmail(email?: string | null) {
  return Boolean(email && adminEmails().includes(email.toLowerCase()));
}

/** The signed-in admin, or a redirect to the login page. */
export async function requireAdmin() {
  await connection(); // always per request, never prerendered (the session check reads the clock)
  if (!hasSupabase) redirect("/admin/login?setup=1");
  const supabase = await authClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email : null;
  if (!claims || !isAdminEmail(email)) redirect("/admin/login");
  return { id: String(claims.sub), email };
}
