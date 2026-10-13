"use client";

import { Loader, Lock, Mail } from "lucide-react";
import { useActionState } from "react";
import { signIn } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="ad-login__form">
      <label className="ad-input">
        <span>Email</span>
        <span className="ad-input__box">
          <Mail />
          <input name="email" type="email" autoComplete="username" required placeholder="you@clentr.com" />
        </span>
      </label>
      <label className="ad-input">
        <span>Password</span>
        <span className="ad-input__box">
          <Lock />
          <input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" />
        </span>
      </label>
      {state?.error && (
        <p className="ad-banner ad-banner--error" role="alert">
          {state.error}
        </p>
      )}
      <button className="ad-btn ad-btn--primary ad-btn--block ad-btn--lg" disabled={pending}>
        {pending && <Loader className="ad-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
