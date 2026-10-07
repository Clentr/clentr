export type Screen = { src: string; alt: string };

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  platform: string;
  summary: string;
  features: string[];
  /** Technology when known from the codebase; otherwise product highlights. */
  tags: { label: "Built with" | "Highlights"; items: string[] };
  screens: Screen[];
  /** false when the images already include their own device mockup. */
  framed: boolean;
  layout: "trio" | "duo" | "duo-reverse";
  group: "shipped" | "built";
};

export const projects: Project[] = [
  {
    slug: "episode",
    name: "Episode",
    tagline: "Your life, told one episode at a time.",
    category: "Lifestyle · AI",
    platform: "iPhone",
    summary:
      "A journal that turns each day into an episode of your life — with a title, summary, cliffhanger and poster. Seven episodes make a season, with a recap at the end of every week.",
    features: [
      "Episode title, summary and cliffhanger from each entry",
      "A poster generated for every episode",
      "Seven episodes form a season with a weekly recap",
      "Choose the kind of episode that fits your day",
    ],
    tags: { label: "Highlights", items: ["AI generation", "Posters", "Seasons", "Subscriptions"] },
    screens: [
      { src: "/apps/episode-premiere.webp", alt: "Episode series premiere poster" },
      { src: "/apps/episode-home.webp", alt: "Episode home screen with this week's episodes" },
      { src: "/apps/episode-season.webp", alt: "Episode season recap with episode posters" },
    ],
    framed: true,
    layout: "trio",
    group: "shipped",
  },
  {
    slug: "resumemint",
    name: "ResumeMint",
    tagline: "Turn any job posting into your next opportunity.",
    category: "Careers · AI",
    platform: "iPhone",
    summary:
      "Upload a resume once, paste or share a job link, and get a tailored, ATS-ready resume with a match score — ready to download as PDF or DOCX.",
    features: [
      "Reads postings from LinkedIn, Indeed, Workday, Greenhouse and Lever",
      "ATS keyword matching and a match score",
      "Every change reviewable, section by section",
      "Share a job to the app from anywhere",
    ],
    tags: { label: "Built with", items: ["SwiftUI", "Firebase", "Gemini"] },
    screens: [
      { src: "/apps/resumemint-upload.webp", alt: "ResumeMint upload your resume screen" },
      { src: "/apps/resumemint-keywords.webp", alt: "ResumeMint tailoring a resume with ATS keywords" },
    ],
    framed: false,
    layout: "duo",
    group: "shipped",
  },
  {
    slug: "between-us",
    name: "Between Us",
    tagline: "A gentle space for you and your person.",
    category: "Relationships",
    platform: "iPhone",
    summary:
      "A private relationship companion. Check in with how you feel, write to each other in a shared space, and notice patterns across days, weeks and months.",
    features: [
      "Check-ins — hurt, loved, appreciated, need to talk",
      "Our Space: private messages that don't last forever",
      "Insights across days, weeks and months",
      "A shared history of check-ins",
    ],
    tags: { label: "Highlights", items: ["Couples", "Check-ins", "Insights", "Private"] },
    screens: [
      { src: "/apps/between-activity.webp", alt: "Between Us today's activity" },
      { src: "/apps/between-home.webp", alt: "Between Us home with today's relationship pulse" },
      { src: "/apps/between-insights.webp", alt: "Between Us insights for this week" },
    ],
    framed: true,
    layout: "trio",
    group: "shipped",
  },
  {
    slug: "saythis",
    name: "SayThis",
    tagline: "Find the right words, instantly.",
    category: "Social · AI",
    platform: "iPhone",
    summary:
      "Describe an awkward or high-pressure moment by typing or speaking, and get calm, ready-to-say lines in seconds — plus a clean way to exit.",
    features: [
      "Context-aware lines generated in seconds",
      "Voice-to-text for in-the-moment use",
      "Tone presets: pro, minimalist and warm",
      "No account; prompts and recordings aren't stored",
    ],
    tags: { label: "Highlights", items: ["AI generation", "Speech recognition", "Privacy first"] },
    screens: [
      { src: "/apps/saythis-input.webp", alt: "SayThis describing a situation" },
      { src: "/apps/saythis-lines.webp", alt: "SayThis ready-to-say lines and an exit line" },
    ],
    framed: true,
    layout: "duo-reverse",
    group: "shipped",
  },
  {
    slug: "c24-cardio",
    name: "C24 Cardio",
    tagline: "Train hard. Stay ready.",
    category: "Fitness",
    platform: "iPhone",
    summary:
      "A combat-conditioning round timer. Set rounds, work and rest, then train to loud audio cues — every session saved on-device with streaks and records.",
    features: [
      "Custom rounds, work and rest durations",
      "Loud audio cues for every transition",
      "Progress by day, week, month and year",
      "Streaks, best days and records — no account needed",
    ],
    tags: { label: "Highlights", items: ["Round timer", "Audio cues", "On-device data"] },
    screens: [
      { src: "/apps/c24-timer.webp", alt: "C24 Cardio work round countdown" },
      { src: "/apps/c24-setup.webp", alt: "C24 Cardio session setup with rounds, duration and rest" },
      { src: "/apps/c24-progress.webp", alt: "C24 Cardio training progress" },
    ],
    framed: true,
    layout: "trio",
    group: "shipped",
  },
  {
    slug: "dealsamor",
    name: "DealsAmor",
    tagline: "Good things, close by.",
    category: "Local commerce",
    platform: "iOS · Android · Web",
    summary:
      "Offer discovery, wallet credentials and in-store redemption for local businesses — one product with surfaces for customers, creators and store staff.",
    features: [
      "Nearby offers with list and map browsing",
      "Wallet with rotating redemption codes",
      "Creator referrals with tiered rewards",
      "Business console for offers and performance",
    ],
    tags: { label: "Built with", items: ["Expo", "React Native", "Next.js", "Supabase"] },
    screens: [
      { src: "/work/dealsamor-discover.webp", alt: "DealsAmor discover screen with nearby offers" },
      { src: "/work/dealsamor-wallet.webp", alt: "DealsAmor wallet with active offers" },
    ],
    framed: true,
    layout: "duo",
    group: "built",
  },
  {
    slug: "cafemanager",
    name: "CafeManager",
    tagline: "Run the café from your pocket.",
    category: "Hospitality",
    platform: "iPhone",
    summary:
      "Inventory, sales, recipes and suppliers in one app — with an assistant that reads supplier bills from a photo and answers questions by voice.",
    features: [
      "Live revenue, profit and low-stock alerts",
      "Supplier bills parsed from a photo",
      "Natural-language assistant with spoken answers",
      "Recipe cost and margin analysis",
    ],
    tags: { label: "Built with", items: ["SwiftUI", "Firebase", "Apple Vision", "Speech"] },
    screens: [
      { src: "/work/cafe-dashboard.webp", alt: "CafeManager dashboard" },
      { src: "/work/cafe-assistant.webp", alt: "CafeManager assistant reading a supplier bill" },
    ],
    framed: true,
    layout: "duo-reverse",
    group: "built",
  },
];

/** Engineering work without public screens, listed compactly. */
export const moreWork = [
  { name: "Wayfare", kind: "Structured AI trip planner", stack: "React · Three.js · Zod · Groq" },
  { name: "Siren", kind: "Surveillance intelligence", stack: "Python · OpenCV · FastAPI" },
  { name: "Mask", kind: "Desktop GUI for coding agents", stack: "Tauri · Rust · React" },
  { name: "Edith", kind: "Local-first macOS assistant", stack: "Swift · AppKit · SQLite · Ollama" },
  { name: "Voice Orchestrator", kind: "Multi-tenant voice AI", stack: "FastAPI · LangGraph · Vapi" },
];
