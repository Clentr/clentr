/*
 * Editable site content. Each home section has a schema (drives the admin form) and defaults
 * (today's copy). Admin edits are stored per section in `site_content` and merged over these.
 */
import { aiCapabilities, comparison, faqs, principles, process, services, site, tools } from "./site";

export type Field =
  | { k: string; label: string; type: "text" | "textarea" | "icon" | "image" | "url"; hint?: string; rows?: number; optional?: boolean }
  | { k: string; label: string; type: "strings"; hint?: string }
  | { k: string; label: string; type: "range"; min: number; max: number; step?: number; unit?: string; hint?: string }
  | { k: string; label: string; type: "table"; columns: string[]; hint?: string }
  | { k: string; label: string; type: "list"; of: Field[]; item: string; title?: string; hint?: string; max?: number };

type Head = { chip: string; icon: string; title: string; dim: string; lead: string };
const head = (lead = true): Field[] => [
  { k: "chip", label: "Label above the heading", type: "text" },
  { k: "icon", label: "Label icon", type: "icon" },
  { k: "title", label: "Heading", type: "text" },
  { k: "dim", label: "Heading — grey ending", type: "text", hint: "Shown in grey after the heading." },
  ...(lead ? [{ k: "lead", label: "Intro line", type: "textarea", rows: 2, optional: true } as Field] : []),
];

/* ---------- Built-in sections ---------- */

export const defaults = {
  hero: {
    pill: "Taking on new projects this quarter",
    title: "We build your product like it’s our own.",
    dim: "Because we ship our own.",
    lead: "Clentr is a design and engineering studio for founders. Mobile apps, web platforms and AI systems — from first sketch to launch in about 8 weeks.",
    primary: "Request a call",
    secondary: "See what we’ve shipped",
  },
  problem: {
    chip: "The problem",
    icon: "triangle-alert",
    title: "Most first products fail",
    dim: "before users ever see them.",
    lead: "Not because the idea is wrong — because the team around it breaks.",
    items: [
      { title: "Agencies hand off and disappear.", body: "You get a repository and an invoice — not a product people actually use.", fix: "We stay after launch — analytics, fixes and the next release." },
      { title: "Freelancers cover one skill.", body: "Design, backend and launch fall between the cracks, and you become the project manager.", fix: "One senior team covers design, engineering and launch." },
      { title: "Hiring takes months.", body: "Your window doesn’t wait while a team is found, interviewed and onboarded.", fix: "We start in week one. You see working software every week." },
    ],
    resolve: "We’re the team that does all of it —",
    resolveDim: "and stays after launch.",
  },
  own: {
    chip: "We ship our own",
    icon: "rocket",
    title: "We’re not just builders for hire.",
    dim: "We’re product makers.",
    body: "ResumeMint, Episode, SayThis and more are Clentr’s own products, live with real users. Running them teaches us what agencies never learn — what makes people download, stay and pay. Every client project gets that same playbook.",
    cta: "See what we’ve shipped",
  },
  offers: {
    chip: "How we work with you",
    icon: "layers",
    title: "Whatever you’re building,",
    dim: "we’ll take it from here.",
    lead: "Apps, platforms, AI systems, internal tools — pick how you want to work. The same senior team carries it from first sketch to scale.",
    items: [
      { key: "mvp", name: "Product Launch", tagline: "From idea to a live product in about 8 weeks — a mobile app, web platform, SaaS or internal tool.", best: "Founders with an idea or a half-built v1", when: "~8 weeks", points: ["Discovery and product strategy", "Design for every state", "iOS, Android, web or desktop", "Launch, analytics and handover"] },
      { key: "ai", name: "AI & Automation", tagline: "Assistants, agents, voice and workflow automation running inside your business.", best: "Teams with repetitive work to take off their plate", when: "2–6 weeks", points: ["Assistants trained on your data", "Agents with approvals and audit logs", "Automations across your tools", "Monitoring and cost controls"] },
      { key: "partner", name: "Dedicated Product Team", tagline: "A senior design and engineering team that grows your product month after month.", best: "Live products that need to scale", when: "Monthly", points: ["Weekly releases you can see", "Design, engineering and QA on tap", "Performance, analytics and growth work", "Scale up or down anytime"] },
    ],
    stackLine: "We work across Swift, React Native, Next.js, Python, Rust and more.",
    stack: ["swift", "react", "next-js", "expo", "typescript", "python", "rust", "supabase", "firebase", "gemini"],
  },
  work: {
    chip: "Our work",
    icon: "folder",
    title: "Everything we’ve built,",
    dim: "in one folder.",
    lead: "Every app, platform and experiment — organised like the Mac we build them on. Hover a folder to peek inside, click to open the project.",
  } as Head,
  statement: {
    toolsLabel: "Tools we trust in production",
    tools: tools.map((t) => ({ key: t, name: t.replace(/-/g, " "), image: "" })),
  },
  services: {
    chip: "What we deliver",
    icon: "layers",
    title: "Idea in, product out.",
    dim: "We build all of it.",
    lead: "Apps, platforms, AI and the systems behind them — one senior team designs, builds and ships, so nothing gets lost between hand-offs.",
    items: services.map((s) => ({ key: s.key as string, title: s.title as string, icon: s.icon as string, body: s.body as string, image: "" })),
  },
  ai: {
    chip: "Applied AI",
    icon: "sparkles",
    title: "AI that takes work",
    dim: "off your team’s plate.",
    lead: "Six systems we build and deploy for businesses today. Pick one — or let it play.",
    items: aiCapabilities.map((c) => ({ key: c.key as string, title: c.title as string, icon: c.icon as string, head: c.head as string, body: c.body as string, tags: [...c.tags] as string[], image: "" })),
  },
  trust: {
    chip: "Why founders trust us",
    icon: "shield-check",
    title: "Trusted by founders",
    dim: "who ship.",
    lead: "{shipped} products shipped and {rnd} more in R&D — designed and engineered by the same team.",
    shippedLabel: "products shipped",
    shippedText: "Journaling, careers, relationships, social, fitness, local commerce and hospitality — live with real users.",
    shippedImage: "",
    platforms: "4",
    platformsLabel: "platforms, one team",
    platformsImage: "",
    scaleTitle: "Built to scale",
    scaleText: "From MVP to v1 to scale — on the same codebase.",
    scaleImage: "",
    replyNum: "< 1 day",
    replyLabel: "to a real reply",
    replyQ: "Can you take over our half-built app?",
    replyA: "Yes — send the repo. We'll review it this week.",
  },
  principles: {
    chip: "Why Clentr",
    icon: "star",
    title: "Why founders",
    dim: "pick Clentr.",
    lead: "",
    items: principles.map((p) => ({ title: p.title as string, icon: p.icon as string, body: p.body as string })),
    compareTitle: "Studio, hire or agency?",
    compareDim: "The honest version.",
    compareColumns: comparison.columns.slice(1) as string[],
    compareRows: comparison.rows.map((r) => [...r]) as string[][],
  },
  process: {
    chip: "Process",
    icon: "git-pull-request",
    title: "From first sketch to",
    dim: "shipped.",
    lead: "You’ll see working software every week. No black-box months.",
    items: process.map((s) => ({ n: s.n as string, when: s.when as string, title: s.title as string, icon: s.icon as string, body: s.body as string, outputs: [...s.outputs] as string[], image: "" })),
  },
  faq: {
    chip: "FAQs",
    icon: "message-circle",
    title: "Questions,",
    dim: "answered.",
    lead: "Tap a question — our assistant answers instantly, and a real person follows up within a day.",
    greeting: "Hi! I can answer anything about working with Clentr. Pick a question below.",
    items: faqs.map((f) => ({ q: f.q as string, a: f.a as string })),
  },
  cta: {
    title: "Have an idea, or a half-built app?",
    title2: "Let’s ship it.",
    text: "Tell us what you’re building. Within a day, you’ll get a real reply with how we’d approach it, a rough timeline and a cost range.",
  },
  contact: { email: site.email },
  appearance: { glass: 45 },
};

export type SiteContent = typeof defaults;
export type SectionKey = keyof SiteContent;

type Def = { name: string; about: string; icon: string; fields: Field[]; anchor?: string };

/** Admin metadata for each built-in section, in page order. */
export const builtIn: Record<SectionKey, Def> = {
  hero: {
    name: "Hero",
    about: "Headline, intro and buttons at the top of the page, with the work carousel.",
    icon: "sparkles",
    fields: [
      { k: "pill", label: "Small banner above the headline", type: "text" },
      { k: "title", label: "Headline", type: "text" },
      { k: "dim", label: "Headline — grey ending", type: "text" },
      { k: "lead", label: "Intro paragraph", type: "textarea", rows: 3 },
      { k: "primary", label: "Main button", type: "text", hint: "Opens the call request form." },
      { k: "secondary", label: "Second button", type: "text", hint: "Scrolls to the work." },
    ],
  },
  problem: {
    name: "The problem",
    about: "Three ways first products fail, then how Clentr answers them.",
    icon: "triangle-alert",
    fields: [
      ...head(),
      { k: "items", label: "Problems", type: "list", item: "problem", title: "title", max: 3, of: [{ k: "title", label: "Problem", type: "text" }, { k: "body", label: "Text", type: "textarea", rows: 2 }, { k: "fix", label: "How Clentr fixes it", type: "text" }] },
      { k: "resolve", label: "Answer line", type: "text" },
      { k: "resolveDim", label: "Answer line — grey ending", type: "text" },
    ],
  },
  own: {
    name: "We ship our own",
    about: "The big statement: Clentr builds and runs its own products. The paragraph lights up as it scrolls by.",
    icon: "rocket",
    fields: [
      { k: "chip", label: "Label above the heading", type: "text" },
      { k: "icon", label: "Label icon", type: "icon" },
      { k: "title", label: "Statement — first line", type: "text" },
      { k: "dim", label: "Statement — highlighted line", type: "text" },
      { k: "body", label: "Paragraph", type: "textarea", rows: 4 },
      { k: "cta", label: "Link text", type: "text" },
    ],
  },
  offers: {
    name: "How we work with you",
    about: "The three ways to work with Clentr. No prices on the page.",
    icon: "layers",
    anchor: "how-we-work",
    fields: [
      ...head(),
      { k: "items", label: "Offers", type: "list", item: "offer", title: "name", max: 3, of: [{ k: "name", label: "Name", type: "text" }, { k: "tagline", label: "Line", type: "textarea", rows: 2 }, { k: "best", label: "Best for", type: "text" }, { k: "when", label: "Timeline", type: "text" }, { k: "points", label: "What’s included", type: "strings" }] },
      { k: "stackLine", label: "Stack line", type: "text" },
    ],
  },
  work: { name: "Work (Mac Finder)", about: "Every project as a folder. Projects themselves are managed under Projects.", icon: "folder", anchor: "work", fields: head() },
  statement: {
    name: "Tools",
    about: "Scrolling tool logos.",
    icon: "code-xml",
    fields: [
      { k: "toolsLabel", label: "Label above the logos", type: "text" },
      {
        k: "tools",
        label: "Tool logos",
        type: "list",
        item: "logo",
        title: "name",
        max: 40,
        hint: "Built-in logos keep their artwork; upload an image for any new one (square, transparent PNG works best).",
        of: [
          { k: "name", label: "Name", type: "text" },
          { k: "image", label: "Logo", type: "image", optional: true },
        ],
      },
    ],
  },
  services: {
    name: "Services",
    about: "The capability cards, each with its own animation.",
    icon: "layers",
    anchor: "services",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Services",
        type: "list",
        item: "service",
        title: "title",
        max: 12,
        of: [
          { k: "title", label: "Title", type: "text" },
          { k: "icon", label: "Icon", type: "icon" },
          { k: "body", label: "Description", type: "textarea", rows: 2 },
          { k: "image", label: "Image", type: "image", optional: true, hint: "Optional. New services need one; on the built-in eight it replaces the animation." },
        ],
      },
    ],
  },
  ai: {
    name: "Applied AI",
    about: "The tabbed AI showcase with live product scenes.",
    icon: "brain-circuit",
    anchor: "ai",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Capabilities",
        type: "list",
        item: "capability",
        title: "title",
        max: 8,
        of: [
          { k: "title", label: "Tab title", type: "text" },
          { k: "icon", label: "Icon", type: "icon" },
          { k: "head", label: "Headline", type: "text" },
          { k: "body", label: "Description", type: "textarea", rows: 2 },
          { k: "tags", label: "Tags", type: "strings" },
          { k: "image", label: "Image", type: "image", optional: true, hint: "Optional. New capabilities need one; on the original six it replaces the built-in scene." },
        ],
      },
    ],
  },
  trust: {
    name: "Trust",
    about: "Proof points. Use {shipped} and {rnd} for live project counts.",
    icon: "shield-check",
    fields: [
      ...head(),
      { k: "shippedLabel", label: "Shipped — label", type: "text", hint: "The number is counted from Projects." },
      { k: "shippedText", label: "Shipped — description", type: "textarea", rows: 2 },
      { k: "shippedImage", label: "Shipped — image", type: "image", optional: true, hint: "Leave empty to keep the app-icon artwork." },
      { k: "platforms", label: "Platforms — number", type: "text" },
      { k: "platformsLabel", label: "Platforms — label", type: "text" },
      { k: "platformsImage", label: "Platforms — image", type: "image", optional: true, hint: "Leave empty to keep the platforms diagram." },
      { k: "scaleTitle", label: "Scale card — title", type: "text" },
      { k: "scaleText", label: "Scale card — text", type: "text" },
      { k: "scaleImage", label: "Scale card — image", type: "image", optional: true, hint: "Leave empty to keep the growth chart." },
      { k: "replyNum", label: "Reply card — figure", type: "text" },
      { k: "replyLabel", label: "Reply card — label", type: "text" },
      { k: "replyQ", label: "Reply card — question bubble", type: "text" },
      { k: "replyA", label: "Reply card — answer bubble", type: "text" },
    ],
  },
  principles: {
    name: "Principles & comparison",
    about: "Four principles, then the studio vs hire vs agency table.",
    icon: "compass",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Principles",
        type: "list",
        item: "principle",
        title: "title",
        max: 8,
        of: [
          { k: "title", label: "Title", type: "text" },
          { k: "icon", label: "Icon", type: "icon" },
          { k: "body", label: "Description", type: "textarea", rows: 2 },
        ],
      },
      { k: "compareTitle", label: "Comparison heading", type: "text" },
      { k: "compareDim", label: "Comparison heading — grey ending", type: "text" },
      { k: "compareColumns", label: "Other two columns", type: "strings", hint: "Clentr is always the first column." },
      { k: "compareRows", label: "Rows", type: "table", columns: ["Row", "Clentr", "Column 2", "Column 3"] },
    ],
  },
  process: {
    name: "Process",
    about: "The stages, each opening with its own animation.",
    icon: "git-pull-request",
    anchor: "process",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Stages",
        type: "list",
        item: "stage",
        title: "title",
        max: 6,
        of: [
          { k: "n", label: "Number", type: "text" },
          { k: "when", label: "When", type: "text" },
          { k: "title", label: "Title", type: "text" },
          { k: "icon", label: "Icon", type: "icon" },
          { k: "body", label: "Description", type: "textarea", rows: 2 },
          { k: "outputs", label: "Outputs", type: "strings" },
          { k: "image", label: "Image", type: "image", optional: true, hint: "Optional. New stages need one; on the original four it replaces the built-in animation." },
        ],
      },
    ],
  },
  faq: {
    name: "FAQs",
    about: "The assistant that answers the common questions.",
    icon: "messages-square",
    anchor: "faqs",
    fields: [
      ...head(),
      { k: "greeting", label: "Assistant greeting", type: "textarea", rows: 2 },
      {
        k: "items",
        label: "Questions",
        type: "list",
        item: "question",
        title: "q",
        max: 12,
        of: [
          { k: "q", label: "Question", type: "text" },
          { k: "a", label: "Answer", type: "textarea", rows: 3 },
        ],
      },
    ],
  },
  cta: {
    name: "Closing call to action",
    about: "The dark band before the footer.",
    icon: "send",
    fields: [
      { k: "title", label: "Heading — first line", type: "text" },
      { k: "title2", label: "Heading — second line", type: "text" },
      { k: "text", label: "Text", type: "textarea", rows: 2 },
    ],
  },
  appearance: {
    name: "Appearance",
    about: "Site-wide look: how strong the frosted-glass effect is on the nav, buttons and chips.",
    icon: "sparkles",
    fields: [{ k: "glass", label: "Glass effect", type: "range", min: 0, max: 100, step: 1, unit: "%", hint: "0 = solid, 100 = very see-through and blurred." }],
  },
  contact: {
    name: "Contact details",
    about: "The studio email used across the site and footer.",
    icon: "mail",
    fields: [{ k: "email", label: "Email", type: "text" }],
  },
};

/** Sections that appear on the home page, in their default order ("contact" is site-wide). */
export const homeOrder: SectionKey[] = ["hero", "problem", "own", "work", "statement", "services", "offers", "ai", "trust", "principles", "process", "faq", "cta"];

/* ---------- Templates for new sections ---------- */

export type Template = "features" | "media" | "stats" | "quote" | "logos" | "cta";

export const templates: Record<Template, Def & { sample: Record<string, unknown> }> = {
  features: {
    name: "Feature grid",
    about: "Heading and up to eight cards with an icon, title and text.",
    icon: "layers",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Cards",
        type: "list",
        item: "card",
        title: "title",
        max: 8,
        of: [
          { k: "icon", label: "Icon", type: "icon" },
          { k: "title", label: "Title", type: "text" },
          { k: "body", label: "Text", type: "textarea", rows: 2 },
        ],
      },
    ],
    sample: {
      chip: "Why Clentr",
      icon: "sparkles",
      title: "A new section",
      dim: "in our design.",
      lead: "Edit this text in the admin panel.",
      items: [
        { icon: "rocket", title: "First point", body: "A short line about it." },
        { icon: "shield-check", title: "Second point", body: "A short line about it." },
        { icon: "layers", title: "Third point", body: "A short line about it." },
      ],
    },
  },
  media: {
    name: "Text + image",
    about: "A heading, paragraph and button beside an image.",
    icon: "app-window",
    fields: [
      ...head(false),
      { k: "body", label: "Paragraph", type: "textarea", rows: 4 },
      { k: "points", label: "Bullet points", type: "strings" },
      { k: "image", label: "Image", type: "image" },
      { k: "button", label: "Button text", type: "text", optional: true },
      { k: "href", label: "Button link", type: "url", optional: true, hint: "Use “book” to open the call request form." },
      { k: "flip", label: "Image side", type: "text", hint: "“left” or “right”." },
    ],
    sample: { chip: "Spotlight", icon: "star", title: "Tell a story", dim: "with an image.", body: "Write a paragraph here.", points: ["First point", "Second point"], image: "", button: "Request a call", href: "book", flip: "right" },
  },
  stats: {
    name: "Numbers",
    about: "Up to four figures with labels. Use real numbers only.",
    icon: "trending-up",
    fields: [
      ...head(),
      {
        k: "items",
        label: "Figures",
        type: "list",
        item: "figure",
        title: "value",
        max: 4,
        of: [
          { k: "value", label: "Figure", type: "text" },
          { k: "label", label: "Label", type: "text" },
          { k: "text", label: "Detail", type: "text", optional: true },
        ],
      },
    ],
    sample: { chip: "By the numbers", icon: "trending-up", title: "Results that", dim: "add up.", lead: "", items: [{ value: "12", label: "products", text: "" }] },
  },
  quote: {
    name: "Testimonial",
    about: "A quote from a real client, with their name and role.",
    icon: "messages-square",
    fields: [
      { k: "quote", label: "Quote", type: "textarea", rows: 4 },
      { k: "name", label: "Name", type: "text" },
      { k: "role", label: "Role and company", type: "text" },
      { k: "photo", label: "Photo", type: "image", optional: true },
    ],
    sample: { quote: "Paste a real client quote here.", name: "Client name", role: "Founder, Company", photo: "" },
  },
  logos: {
    name: "Logo strip",
    about: "A row of client or partner logos.",
    icon: "star",
    fields: [
      { k: "label", label: "Label", type: "text" },
      { k: "logos", label: "Logos", type: "list", item: "logo", title: "name", max: 12, of: [{ k: "name", label: "Name", type: "text" }, { k: "image", label: "Logo", type: "image" }] },
    ],
    sample: { label: "Teams we’ve built with", logos: [] },
  },
  cta: {
    name: "Call to action",
    about: "A highlighted band with a heading and buttons.",
    icon: "send",
    fields: [
      { k: "title", label: "Heading", type: "text" },
      { k: "text", label: "Text", type: "textarea", rows: 2 },
      { k: "button", label: "Button text", type: "text" },
      { k: "href", label: "Button link", type: "url", hint: "Use “book” to open the call request form." },
    ],
    sample: { title: "Have an idea?", text: "Tell us about it — we reply within a day.", button: "Request a call", href: "book" },
  },
};

/** A section added from the admin panel. */
export type CustomSection = { id: string; template: Template; name: string; data: Record<string, unknown> };

/** Order and visibility of everything on the home page. Custom sections appear as "s:<id>". */
export type Layout = { order: string[]; hidden: string[] };
export const defaultLayout: Layout = { order: homeOrder, hidden: [] };
