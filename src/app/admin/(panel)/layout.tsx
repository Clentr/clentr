import { LogOut } from "lucide-react";
import { Lockup } from "@/components/ui/Logo";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { newLeadCount } from "@/lib/analytics";
import { requireAdmin } from "@/lib/supabase/auth";
import { signOut } from "../actions";
import { SideNav } from "../_ui/SideNav";

// Reads the session cookie on every request.
export const instant = false;

export default async function Panel({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const count = await newLeadCount();
  const name = user.email?.split("@")[0].replace(/[._-]+/g, " ") ?? "Admin";
  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <div className="ad-side__brand">
          <Lockup href="/admin" label="Clentr admin" />
          <span className="ad-tag">Admin</span>
        </div>
        <SideNav newLeads={count} />
        <div className="ad-side__foot">
          <ThemeSwitch />
          <form action={signOut} className="ad-me">
            <span className="ad-me__avatar" aria-hidden="true">
              {name.slice(0, 1).toUpperCase()}
            </span>
            <span className="ad-me__who">
              <b>{name}</b>
              <small>{user.email}</small>
            </span>
            <button className="ad-iconbtn" aria-label="Sign out" title="Sign out">
              <LogOut />
            </button>
          </form>
        </div>
      </aside>
      <main className="ad-main">{children}</main>
    </div>
  );
}
