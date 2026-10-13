import { Lockup } from "@/components/ui/Logo";
import { hasSupabase } from "@/lib/config";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default function Login() {
  return (
    <main className="ad-login">
      <div className="ad-login__glow" aria-hidden="true" />
      <div className="ad-login__card">
        <Lockup />
        <div>
          <h1>Welcome back</h1>
          <p>Sign in to manage clentr.com.</p>
        </div>
        {hasSupabase ? (
          <LoginForm />
        ) : (
          <p className="ad-banner ad-banner--warn">
            The database isn’t connected yet. Add the Supabase keys to <code>.env.local</code>, then restart the server.
          </p>
        )}
      </div>
      <p className="ad-login__foot">Clentr studio admin · Authorised people only</p>
    </main>
  );
}
