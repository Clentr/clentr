export const site = {
  name: "Clentr",
  url: "https://clentr.vercel.app",
  email: "dineshkotipalli@clentr.com",
  tagline: "Software engineering studio",
  copyrightYear: 2026,
  description:
    "Clentr designs and engineers mobile apps, web platforms, desktop tools and applied-AI systems — from first sketch to shipped product.",
};

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  {
    id: "mobile",
    title: "Mobile apps",
    body: "Native iOS in SwiftUI and cross-platform apps in Expo / React Native — wallets, dashboards, camera and voice flows.",
    tags: ["SwiftUI", "Expo", "React Native"],
  },
  {
    id: "web",
    title: "Web platforms",
    body: "Product sites, consoles and multi-surface platforms on Next.js and React, backed by Postgres or document stores.",
    tags: ["Next.js", "React", "Supabase"],
  },
  {
    id: "ai",
    title: "Applied AI",
    body: "LLM features that return structured output, agent workflows, voice pipelines and local on-device models.",
    tags: ["LangGraph", "Gemini", "Ollama"],
  },
  {
    id: "vision",
    title: "Computer vision",
    body: "Video and image pipelines that use classical CV first and reach for learned models only where they earn it.",
    tags: ["OpenCV", "Vision", "Python"],
  },
  {
    id: "desktop",
    title: "Desktop & native tools",
    body: "Menu-bar utilities and cross-platform desktop apps with Rust, Tauri, Swift and AppKit.",
    tags: ["Tauri", "Rust", "AppKit"],
  },
  {
    id: "backend",
    title: "Backend & cloud",
    body: "APIs, webhooks, edge functions and containerised services — built to recover cleanly when things fail.",
    tags: ["FastAPI", "Firebase", "Cloud Run"],
  },
] as const;

export const process = [
  {
    n: "01",
    title: "Discover",
    body: "We map the problem, the people and the constraints before anything is drawn.",
    out: ["Problem framing", "Scope", "Technical risks"],
  },
  {
    n: "02",
    title: "Design",
    body: "Flows and interfaces designed for every state — empty, loading, error and success.",
    out: ["User flows", "Interface design", "Data model"],
  },
  {
    n: "03",
    title: "Build",
    body: "Typed, tested code on a modern stack, shipped in small increments you can see.",
    out: ["Weekly builds", "Code review", "Test coverage"],
  },
  {
    n: "04",
    title: "Launch",
    body: "Deploy, measure, refine. We stay close while the product meets real users.",
    out: ["Deployment", "Monitoring", "Iteration"],
  },
] as const;

export const principles = [
  {
    k: "Product first",
    v: "We ask what the product must do for the person holding it, then choose the technology.",
  },
  {
    k: "Every state designed",
    v: "Offline, empty, expired, failed — the unhappy paths get the same care as the demo path.",
  },
  {
    k: "Honest engineering",
    v: "Structured outputs, schemas and validation. Systems that say what they did, not what they hoped.",
  },
  {
    k: "Built to be maintained",
    v: "Clear architecture, typed boundaries and decisions written down for whoever comes next.",
  },
] as const;

export const stack = [
  { group: "Interface", items: ["React", "Next.js", "TypeScript", "SwiftUI", "React Native", "Expo", "Three.js"] },
  { group: "Systems", items: ["Rust", "Tauri", "Swift", "AppKit", "Python", "FastAPI", "Node.js"] },
  { group: "Data", items: ["Supabase", "PostgreSQL", "Firebase", "MongoDB", "SQLite"] },
  { group: "Intelligence", items: ["LangGraph", "Gemini", "Groq", "Ollama", "OpenCV", "Apple Vision", "Vapi"] },
  { group: "Cloud", items: ["Vercel", "Google Cloud Run", "Supabase Edge", "Firebase Functions", "Docker"] },
] as const;
