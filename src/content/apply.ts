/** "Request a call" application: the questions, shared by the form, the API and the admin inbox. */

export const STAGES = ["Just an idea", "Wireframes ready", "Design ready", "Already in development"] as const;
export const BUDGETS = ["₹50K – ₹1L", "₹1L – ₹3L", "₹3L – ₹7L", "₹7L+"] as const;
export const TIMELINES = ["ASAP · 2–4 weeks", "1–2 months", "Flexible"] as const;
export const EXPECTS = ["Full product build", "MVP only", "Consulting / guidance", "Not sure yet"] as const;
export const BEFORE = ["Yes", "No"] as const;

export type Application = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  idea: string;
  stage: string;
  problem: string;
  budget: string;
  timeline: string;
  expect: string;
  before: string;
  why: string;
  extra: string;
};

/** Field limits; also the list of every answer, in order. */
export const LIMITS: Record<keyof Application, number> = {
  name: 120,
  email: 200,
  phone: 40,
  instagram: 80,
  idea: 1500,
  stage: 60,
  problem: 1500,
  budget: 40,
  timeline: 40,
  expect: 60,
  before: 10,
  why: 1500,
  extra: 2000,
};

/** Labels for the admin inbox and the email. */
export const LABELS: Record<keyof Application, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone / WhatsApp",
  instagram: "Instagram",
  idea: "What they want to build",
  stage: "Stage",
  problem: "Problem & audience",
  budget: "Budget",
  timeline: "Timeline",
  expect: "Expecting from us",
  before: "Worked with developers before",
  why: "Why Clentr",
  extra: "Anything else",
};

const MARK = "apply:v1";

/** Applications are kept in the leads table; the answers ride in `details` as JSON. */
export const packApplication = (a: Application) => JSON.stringify({ _: MARK, ...a });

export function readApplication(details: string | null): Application | null {
  if (!details?.startsWith(`{"_":"${MARK}"`)) return null;
  try {
    return JSON.parse(details) as Application;
  } catch {
    return null;
  }
}
