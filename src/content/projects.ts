export type ProjectVisual =
  | { type: "screens"; images: { src: string; alt: string }[]; ratio: "phone" | "tall" }
  | { type: "video"; src: string; poster: string; alt: string }
  | { type: "art"; kind: "atlas" | "siren" | "mask" | "edith" | "voice" };

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  category: string;
  platform: string;
  summary: string;
  features: string[];
  stack: string[];
  visual: ProjectVisual;
  layout: "feature" | "split" | "split-reverse" | "compact";
};

export const projects: Project[] = [
  {
    slug: "dealsamor",
    name: "DealsAmor",
    kicker: "Local commerce platform",
    category: "Commerce",
    platform: "iOS · Android · Web",
    summary:
      "Offer discovery, wallet credentials and in-store redemption for local businesses — one product with three surfaces for customers, creators and store staff.",
    features: [
      "Nearby offers with list and map browsing",
      "Wallet with rotating redemption codes shown at the register",
      "Creator referrals with tiered rewards",
      "Business console for offers and performance",
    ],
    stack: ["Expo", "React Native", "Next.js", "Supabase", "TypeScript"],
    visual: {
      type: "screens",
      ratio: "phone",
      images: [
        { src: "/work/dealsamor-discover.webp", alt: "DealsAmor discover screen listing nearby offers" },
        { src: "/work/dealsamor-offer.webp", alt: "DealsAmor offer detail screen" },
        { src: "/work/dealsamor-wallet.webp", alt: "DealsAmor wallet with active offers" },
        { src: "/work/dealsamor-register.webp", alt: "DealsAmor redemption code shown at the register" },
      ],
    },
    layout: "feature",
  },
  {
    slug: "cafemanager",
    name: "CafeManager",
    kicker: "Operations app for cafés",
    category: "Hospitality",
    platform: "iOS",
    summary:
      "Inventory, sales, recipes and suppliers in one iOS app — with an assistant that reads supplier bills from a photo and answers questions by voice.",
    features: [
      "Live revenue, profit and low-stock alerts",
      "Supplier bills parsed from a photo into inventory",
      "Natural-language assistant with spoken answers",
      "Recipe cost and margin analysis",
    ],
    stack: ["SwiftUI", "Firebase", "Apple Vision", "Speech"],
    visual: {
      type: "screens",
      ratio: "tall",
      images: [
        { src: "/work/cafe-dashboard.webp", alt: "CafeManager dashboard with revenue and stock alerts" },
        { src: "/work/cafe-assistant.webp", alt: "CafeManager assistant analysing a supplier bill photo" },
        { src: "/work/cafe-predictions.webp", alt: "CafeManager inventory health predictions" },
      ],
    },
    layout: "split",
  },
  {
    slug: "resume-tailor",
    name: "Resume Tailor",
    kicker: "AI career copilot",
    category: "Careers · AI",
    platform: "iOS",
    summary:
      "Share a job post from LinkedIn, Indeed or Greenhouse; the app extracts the role, tailors your resume to it and tracks the application.",
    features: [
      "Job import straight from the iOS share sheet",
      "In-app sign-in to job boards with WKWebView",
      "Resume tailoring and ATS match score",
      "Kanban board for every application",
    ],
    stack: ["SwiftUI", "Firebase Functions", "Gemini", "WKWebView"],
    visual: {
      type: "video",
      src: "/work/resume-tailor.mp4",
      poster: "/work/resume-tailor-poster.jpg",
      alt: "Screen recording: sharing a job post to Resume Tailor and receiving a tailored resume",
    },
    layout: "split-reverse",
  },
  {
    slug: "wayfare",
    name: "Wayfare",
    kicker: "Structured AI trip planner",
    category: "Travel · AI",
    platform: "Web",
    summary:
      "Describe a trip in plain words and get a day-by-day itinerary — returned as validated JSON, checked against the real world and plotted on a map and 3D globe.",
    features: [
      "Schema-validated model output, repaired when it breaks",
      "2D map and 3D globe views",
      "A lab that shows the model failing on purpose",
    ],
    stack: ["React", "Three.js", "Zod", "Groq", "Framer Motion"],
    visual: { type: "art", kind: "atlas" },
    layout: "compact",
  },
  {
    slug: "siren",
    name: "Siren",
    kicker: "Surveillance intelligence",
    category: "Computer vision",
    platform: "Web · Server",
    summary:
      "Sits above existing cameras and turns continuous video into a searchable record of what happened — classical vision first, learned models only when they earn it.",
    features: [
      "Live camera wall over RTSP / ONVIF sources",
      "Motion and object tracking pipeline",
      "Event timeline instead of raw footage",
    ],
    stack: ["Python", "OpenCV", "FastAPI", "React"],
    visual: { type: "art", kind: "siren" },
    layout: "compact",
  },
  {
    slug: "mask",
    name: "Mask",
    kicker: "Desktop interface for coding agents",
    category: "Developer tools",
    platform: "macOS · Windows · Linux",
    summary:
      "A native desktop GUI for Claude Code. The terminal becomes an implementation detail; streaming messages, tool calls, task progress and diffs become the interface.",
    features: [
      "Typed event stream from the agent to the UI",
      "Tool cards, live task progress and file diffs",
      "Real shell in an embedded PTY terminal",
    ],
    stack: ["Tauri", "Rust", "React", "TypeScript"],
    visual: { type: "art", kind: "mask" },
    layout: "split",
  },
  {
    slug: "edith",
    name: "Edith",
    kicker: "Local-first macOS assistant",
    category: "Productivity",
    platform: "macOS",
    summary:
      "A menu-bar utility that replaces Activity Monitor, Spotlight and the clipboard — with an on-device agent that can act on the Mac.",
    features: [
      "Per-process memory monitor with leak hints",
      "Typo-tolerant file search on SQLite FTS5",
      "Private clipboard history",
      "Local agent that opens, searches and reminds",
    ],
    stack: ["Swift 6", "SwiftUI", "AppKit", "SQLite", "Ollama"],
    visual: { type: "art", kind: "edith" },
    layout: "compact",
  },
  {
    slug: "voice-orchestrator",
    name: "Voice Orchestrator",
    kicker: "Multi-tenant voice AI",
    category: "Real estate · SaaS",
    platform: "Web · Cloud",
    summary:
      "Agencies upload leads; the system places outbound AI voice calls, evaluates each transcript with an LLM workflow and updates lead status live.",
    features: [
      "Outbound calls with end-of-call webhooks",
      "LangGraph evaluation of every transcript",
      "Tenant-isolated live dashboard",
    ],
    stack: ["FastAPI", "LangGraph", "Vapi", "MongoDB", "Cloud Run"],
    visual: { type: "art", kind: "voice" },
    layout: "compact",
  },
];
