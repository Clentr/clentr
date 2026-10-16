/** "Request a call" application: the questions, shared by the form, the API and the admin inbox. */

export const STAGES = ["Just an idea", "Wireframes ready", "Design ready", "Already in development"] as const;
export const BUDGETS = ["₹50K – ₹1L", "₹1L – ₹3L", "₹3L – ₹7L", "₹7L+"] as const;
export const TIMELINES = ["ASAP · 2–4 weeks", "1–2 months", "Flexible"] as const;
export const EXPECTS = ["Full product build", "MVP only", "Consulting / guidance", "Not sure yet"] as const;
export const BEFORE = ["Yes", "No"] as const;

/** Country codes for the phone field: national number length (and first digit for mobiles where it's fixed). */
export type Country = { iso: string; name: string; code: string; len: [number, number]; start?: RegExp; sample: string };
export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", code: "+91", len: [10, 10], start: /^[6-9]/, sample: "98765 43210" },
  { iso: "US", name: "United States / Canada", code: "+1", len: [10, 10], start: /^[2-9]/, sample: "415 555 0132" },
  { iso: "GB", name: "United Kingdom", code: "+44", len: [10, 10], start: /^7/, sample: "7400 123456" },
  { iso: "AE", name: "United Arab Emirates", code: "+971", len: [9, 9], start: /^5/, sample: "50 123 4567" },
  { iso: "SA", name: "Saudi Arabia", code: "+966", len: [9, 9], start: /^5/, sample: "51 234 5678" },
  { iso: "QA", name: "Qatar", code: "+974", len: [8, 8], sample: "3312 3456" },
  { iso: "KW", name: "Kuwait", code: "+965", len: [8, 8], sample: "5001 2345" },
  { iso: "OM", name: "Oman", code: "+968", len: [8, 8], sample: "9212 3456" },
  { iso: "BH", name: "Bahrain", code: "+973", len: [8, 8], sample: "3600 1234" },
  { iso: "SG", name: "Singapore", code: "+65", len: [8, 8], start: /^[89]/, sample: "8123 4567" },
  { iso: "MY", name: "Malaysia", code: "+60", len: [9, 10], start: /^1/, sample: "12 345 6789" },
  { iso: "AU", name: "Australia", code: "+61", len: [9, 9], start: /^4/, sample: "412 345 678" },
  { iso: "NZ", name: "New Zealand", code: "+64", len: [8, 10], start: /^2/, sample: "21 123 4567" },
  { iso: "DE", name: "Germany", code: "+49", len: [10, 11], start: /^1/, sample: "1512 3456789" },
  { iso: "FR", name: "France", code: "+33", len: [9, 9], start: /^[67]/, sample: "6 12 34 56 78" },
  { iso: "NL", name: "Netherlands", code: "+31", len: [9, 9], start: /^6/, sample: "6 1234 5678" },
  { iso: "IE", name: "Ireland", code: "+353", len: [9, 9], start: /^8/, sample: "85 123 4567" },
  { iso: "ZA", name: "South Africa", code: "+27", len: [9, 9], start: /^[678]/, sample: "71 123 4567" },
  { iso: "NG", name: "Nigeria", code: "+234", len: [10, 10], start: /^[789]/, sample: "802 123 4567" },
  { iso: "KE", name: "Kenya", code: "+254", len: [9, 9], start: /^[17]/, sample: "712 123456" },
  { iso: "LK", name: "Sri Lanka", code: "+94", len: [9, 9], start: /^7/, sample: "71 234 5678" },
  { iso: "NP", name: "Nepal", code: "+977", len: [10, 10], start: /^9/, sample: "984 1234567" },
  { iso: "BD", name: "Bangladesh", code: "+880", len: [10, 10], start: /^1/, sample: "1812 345678" },
  { iso: "PK", name: "Pakistan", code: "+92", len: [10, 10], start: /^3/, sample: "301 2345678" },
];

export const flagOf = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));

/** Groups a national number for display, e.g. 9876543210 → "98765 43210". */
export function groupDigits(d: string, iso: string) {
  if (iso === "IN") return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
  const out: string[] = [];
  let rest = d;
  while (rest.length > 4) {
    out.push(rest.slice(0, 3));
    rest = rest.slice(3);
  }
  return [...out, rest].filter(Boolean).join(" ");
}

/** The problem with a national number for this country, or null when it's valid. */
export function phoneProblem(c: Country, digits: string) {
  const [min, max] = c.len;
  if (!digits) return "Please add a number we can reach you on.";
  if (digits.length < min || digits.length > max)
    return `${c.name} numbers have ${min === max ? min : `${min}–${max}`} digits after ${c.code}. You entered ${digits.length}.`;
  if (c.start && !c.start.test(digits)) return `That doesn’t look like a mobile number for ${c.name}.`;
  return null;
}

/** Checks a stored phone ("+91 98765 43210"). Unknown codes need 7–15 digits in total. */
export function phoneValid(phone: string) {
  const m = phone.trim().match(/^(\+\d{1,4})\s+([\d\s]+)$/);
  if (!m) return false;
  const digits = m[2].replace(/\D/g, "");
  const c = COUNTRIES.find((x) => x.code === m[1]);
  return c ? !phoneProblem(c, digits) : (m[1].length - 1 + digits.length >= 7 && m[1].length - 1 + digits.length <= 15);
}

/** "@handle", from a handle or a profile link; "" if it isn't a valid Instagram username. */
export function instagramHandle(v: string) {
  const h = v.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/[/?#].*$/, "").replace(/^@/, "");
  return /^(?!.*\.\.)(?!\.)[A-Za-z0-9._]{1,30}(?<!\.)$/.test(h) ? `@${h}` : "";
}

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
