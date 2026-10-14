"use client";

import { useActionState } from "react";
import { Check, Loader } from "lucide-react";
import { saveLibraryCopy } from "../../resource-actions";

/** The heading and intro at the top of /resources. */
export function LibraryCopy({ title, dim, lead }: { title: string; dim: string; lead: string }) {
  const [state, action, saving] = useActionState(saveLibraryCopy, undefined);
  return (
    <form action={action} className="ad-card pf-sec rl-copy">
      <header className="pf-sec__head">
        <h2>Library page text</h2>
        <p>The heading and intro visitors see above the resources.</p>
      </header>
      <div className="pf-row">
        <label className="pf-field">
          <span>Heading</span>
          <input name="title" defaultValue={title} required />
        </label>
        <label className="pf-field">
          <span>
            Heading, second part <em>Shown in grey</em>
          </span>
          <input name="dim" defaultValue={dim} />
        </label>
      </div>
      <label className="pf-field">
        <span>Intro</span>
        <textarea name="lead" rows={2} defaultValue={lead} />
      </label>
      <div className="rl-copy__foot">
        {state?.error && <p className="sf-err">{state.error}</p>}
        {state?.ok && <p className="rl-copy__ok">{state.ok}</p>}
        <button className="ad-btn ad-btn--primary" disabled={saving}>
          {saving ? <Loader className="ad-spin" /> : <Check />}
          Save text
        </button>
      </div>
    </form>
  );
}
