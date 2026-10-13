export const site = {
  name: "Clentr",
  url: "https://clentr.vercel.app",
  email: "shaikazad@clentr.com",
  description:
    "Clentr takes ideas from first sketch to shipped software across mobile apps, web platforms, desktop tools and AI systems.",
};

export const bookCallHref = `mailto:${site.email}?subject=${encodeURIComponent("Book a 30-min call")}`;

export const nav = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "AI", href: "/#ai" },
  { label: "Process", href: "/#process" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/contact" },
];

export const services = [
  { key: "mobile-apps", title: "Mobile apps", icon: "smartphone", body: "Native iOS in SwiftUI and cross-platform apps in Expo / React Native." },
  { key: "web-platforms", title: "Web platforms", icon: "app-window", body: "Product sites, consoles and dashboards on Next.js, backed by Postgres or Supabase." },
  { key: "applied-ai", title: "Applied AI", icon: "brain-circuit", body: "LLM features with structured output, agents, voice and on-device models." },
  { key: "computer-vision", title: "Computer vision", icon: "scan-eye", body: "Image and video pipelines — classical CV first, learned models where they help." },
  { key: "desktop-native", title: "Desktop & native", icon: "monitor", body: "Menu-bar utilities and desktop apps with Tauri, Rust, Swift and AppKit." },
  { key: "backend-cloud", title: "Backend & cloud", icon: "cloud", body: "APIs, webhooks, edge functions and containers that recover cleanly." },
  { key: "mvp-prototypes", title: "MVPs & prototypes", icon: "rocket", body: "A clickable prototype in days, a testable MVP in weeks — validated before you scale." },
  { key: "integrations", title: "Integrations & payments", icon: "workflow", body: "Stripe, CRMs, WhatsApp, maps and third-party APIs — wired in and kept reliable." },
] as const;

export const tools = [
  "swift", "typescript", "next-js", "react", "expo", "supabase", "postgresql", "firebase", "python", "fastapi",
  "node-js", "rust", "tauri", "three-js", "opencv", "gemini", "ollama", "langgraph", "mongodb", "docker", "cloud-run", "vercel",
];

export const aiCapabilities = [
  { key: "personal-ai-assistants", title: "Personal AI assistants", icon: "bot-message-square", head: "A bot that sounds like your brand.", body: "Website, WhatsApp and in-app assistants trained on your products, tone and policies — with a clean hand-off to a human.", tags: ["Your brand voice", "Website & WhatsApp", "Human hand-off"] },
  { key: "ai-agents", title: "AI agents", icon: "bot", head: "Agents that finish the job.", body: "Multi-step agents that read, decide and act through your tools — with approvals, audit logs and limits you control.", tags: ["Tool use", "Approvals", "Audit trail"] },
  { key: "workflow-automation", title: "Workflow automation", icon: "workflow", head: "Busywork, automated.", body: "Leads, invoices, tickets and reports move between your apps on their own — enriched, checked and logged.", tags: ["Triggers & webhooks", "AI enrichment", "Error alerts"] },
  { key: "knowledge-assistants", title: "Knowledge assistants", icon: "book-open", head: "Answers from your own documents.", body: "Search across policies, docs and tickets with answers that cite their sources — so your team can trust them.", tags: ["Cited answers", "Permissions-aware", "Always up to date"] },
  { key: "voice-agents", title: "Voice agents", icon: "phone-call", head: "Phone calls, answered.", body: "Real-time voice agents that book, reschedule and answer questions — under a second, interruptible, 24/7.", tags: ["Under 1 s latency", "Bookings", "Call summaries"] },
  { key: "document-ai", title: "Document AI", icon: "scan-text", head: "Paperwork, read for you.", body: "Invoices, receipts and forms turned into clean, validated data — straight into your accounting or ERP.", tags: ["OCR + validation", "Line items", "Export anywhere"] },
] as const;

export const principles = [
  { title: "Product first", icon: "compass", body: "We decide what the product must do before choosing the technology." },
  { title: "Every state designed", icon: "layers", body: "Offline, empty, expired and failed states get the same care as the demo path." },
  { title: "Honest engineering", icon: "shield-check", body: "Structured outputs, schemas and validation. No guesswork in production." },
  { title: "Built to be maintained", icon: "git-branch", body: "Clear architecture, typed boundaries and decisions written down." },
] as const;

export const comparison = {
  columns: ["Clentr", "Hiring in-house", "A typical agency"],
  rows: [
    ["Who designs and who builds", "One team, start to finish", "You hire both — then manage both", "Designers hand off to developers"],
    ["Your first working build", "Week two, then every week", "After a 2–3 month search", "When the queue reaches you"],
    ["When things go wrong", "Error, empty and offline states designed in", "Depends on who you hired", "Fixed after launch, if at all"],
    ["Who owns the code", "You, from the first commit", "You", "Often tied to their stack"],
    ["After launch", "We stay — analytics, fixes, next release", "Whoever is still around", "The contract ends at handover"],
    ["Shipped a product of their own?", "Yes — 7 apps live", "Rarely", "Rarely"],
  ],
};

export const process = [
  { n: "01", when: "Week 1", title: "Discover", icon: "search", body: "We map the problem, the people and the constraints before anything is drawn.", outputs: ["Problem framing", "Scope", "Technical risks"] },
  { n: "02", when: "Weeks 1–3", title: "Design", icon: "pen-tool", body: "Flows and interfaces designed for every state — empty, loading, error and success.", outputs: ["User flows", "Interface design", "Data model"] },
  { n: "03", when: "Weeks 3–8", title: "Build", icon: "code-xml", body: "Typed, tested code on a modern stack, shipped in small increments you can see.", outputs: ["Weekly builds", "Code review", "Test coverage"] },
  { n: "04", when: "Week 8+", title: "Launch", icon: "rocket", body: "Deploy, measure, refine. We stay close while the product meets real users.", outputs: ["Deployment", "Monitoring", "Iteration"] },
] as const;

export const faqs = [
  { q: "What does a project cost?", a: "Every project is scoped to what you actually need. After a 30-minute call you get a written estimate with a timeline and a cost range — no surprises later." },
  { q: "How long until we launch?", a: "About 8 weeks for a typical MVP: discovery in week one, design in weeks one to three, build in weeks three to eight. You see working software every week." },
  { q: "Can you take over an existing or half-built app?", a: "Yes. We start with a short code and product review, tell you honestly what to keep, then improve it in small, safe releases." },
  { q: "Who owns the code and designs?", a: "You do, from the first commit. Repositories, design files and app-store accounts are set up in your name." },
  { q: "How do time zones and communication work?", a: "We overlap with US, UK and EU working hours, reply within a day, and send a written update and a working build every week." },
  { q: "Will you sign an NDA?", a: "Yes — we’re happy to sign yours, or send ours, before you share anything sensitive." },
  { q: "What do you build?", a: "Mobile apps, web platforms, AI systems, desktop tools — and the backend and cloud that runs them." },
] as const;
