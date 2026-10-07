export type Screen = { src: string; caption: string; alt: string };

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
  /** The product's own brand colour, used for its glow and accents. */
  color: string;
  /** Screens in the order a user moves through the app. */
  flow: Screen[];
  group: "shipped" | "built";
};

const s = (src: string, caption: string, alt: string): Screen => ({ src, caption, alt });

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
    ],
    tags: { label: "Highlights", items: ["AI generation", "Posters", "Seasons", "Subscriptions"] },
    color: "#e2b86b",
    flow: [
      s("/apps/ep-1.webp", "Launch", "Episode launch screen"),
      s("/apps/ep-2.webp", "Series premiere", "Series premiere poster"),
      s("/apps/ep-3.webp", "Log the day", "Writing today's journal entry with photos"),
      s("/apps/ep-4.webp", "Choose a title", "Choosing the episode title"),
      s("/apps/ep-5.webp", "Pick the cliffhanger", "Picking the episode's cliffhanger"),
      s("/apps/ep-6.webp", "The episode", "Finished episode with poster and summary"),
      s("/apps/ep-7.webp", "This week", "Home screen with this week's episodes"),
      s("/apps/ep-8.webp", "Season recap", "Season recap with every episode poster"),
      s("/apps/ep-9.webp", "All episodes", "List of the season's episodes"),
    ],
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
    ],
    tags: { label: "Built with", items: ["SwiftUI", "Firebase", "Gemini"] },
    color: "#5fcfa5",
    flow: [
      s("/apps/rm-1.webp", "Upload once", "Adding a resume"),
      s("/apps/rm-2.webp", "Paste a job link", "Pasting a job link from LinkedIn"),
      s("/apps/rm-3.webp", "Read the job", "The job description extracted and analysed"),
      s("/apps/rm-4.webp", "Match keywords", "Tailoring the resume with ATS keywords"),
    ],
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
    ],
    tags: { label: "Highlights", items: ["Couples", "Check-ins", "Insights", "Private"] },
    color: "#e59a8c",
    flow: [
      s("/apps/bu-1.webp", "Check in", "Home with today's relationship pulse"),
      s("/apps/bu-2.webp", "Today together", "Today's activity and reflections"),
      s("/apps/bu-3.webp", "Insights", "Weekly insights and relationship pattern"),
      s("/apps/bu-4.webp", "Privacy & settings", "About Between Us and relationship settings"),
    ],
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
      "No account; prompts and recordings aren't stored",
    ],
    tags: { label: "Highlights", items: ["AI generation", "Speech recognition", "Privacy first"] },
    color: "#6cb4e4",
    flow: [
      s("/apps/st-1.webp", "Launch", "SayThis launch screen"),
      s("/apps/st-2.webp", "Set your tone", "Choosing a tone: pro, minimalist or warm"),
      s("/apps/st-3.webp", "Describe it", "Describing an awkward moment"),
      s("/apps/st-4.webp", "What to say", "A ready-to-say line"),
      s("/apps/st-5.webp", "How to exit", "A line to make a clean exit"),
      s("/apps/st-6.webp", "Why it works", "Why the advice works"),
      s("/apps/st-7.webp", "The full answer", "Lines, exit and reasoning together"),
      s("/apps/st-8.webp", "You're ready", "You're ready"),
    ],
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
      "Streaks, records and history — no account needed",
    ],
    tags: { label: "Highlights", items: ["Round timer", "Audio cues", "On-device data"] },
    color: "#f07a35",
    flow: [
      s("/apps/c24-1.webp", "Set the session", "Choosing rounds, duration and rest"),
      s("/apps/c24-2.webp", "Go", "Round start countdown"),
      s("/apps/c24-3.webp", "Work", "Work round timer"),
      s("/apps/c24-4.webp", "Pause", "End workout confirmation"),
      s("/apps/c24-5.webp", "Progress", "Training progress and records"),
    ],
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
    features: ["Nearby offers with list and map browsing", "Wallet with rotating redemption codes", "Business console for offers"],
    tags: { label: "Built with", items: ["Expo", "React Native", "Next.js", "Supabase"] },
    color: "#c0708e",
    flow: [
      s("/work/dealsamor-discover.webp", "Discover", "Nearby offers"),
      s("/work/dealsamor-wallet.webp", "Wallet", "Wallet with active offers"),
    ],
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
    features: ["Live revenue, profit and stock alerts", "Supplier bills parsed from a photo", "Voice assistant"],
    tags: { label: "Built with", items: ["SwiftUI", "Firebase", "Apple Vision", "Speech"] },
    color: "#c9925a",
    flow: [
      s("/work/cafe-dashboard.webp", "Dashboard", "Café dashboard"),
      s("/work/cafe-assistant.webp", "Assistant", "Assistant reading a supplier bill"),
    ],
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
