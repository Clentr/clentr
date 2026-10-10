// Generated from the Figma file (Clentr v5) via the REST API. Edit freely.
export type Project = {
  slug: string;
  name: string;
  color: string;
  kind: string;
  platform: string;
  status: "shipped" | "rnd";
  eyebrow: string;
  tagline: string;
  servicesLine: string;
  cta: string;
  quote: string;
  short: string;
  about: [string, string][];
  services: string[];
  product: string;
  challenge: string;
  built: string[];
  proves: string[];
  gallery: string[];
  galleryWide: string | null;
  screens: string[];
  captions: string[];
  galleryCaptions: string[];
};

export const projects: Project[] = [
  {
    "slug": "episode",
    "name": "Episode",
    "color": "#5b4fe0",
    "kind": "AI journaling",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Lifestyle · AI",
    "tagline": "Your life, told one episode at a time.",
    "servicesLine": "Mobile app · Product design · Applied AI",
    "cta": "Open on the App Store",
    "quote": "Your life, told one episode at a time",
    "short": "A journal that turns each day into an episode of your life.",
    "about": [
      [
        "Category",
        "Lifestyle · AI"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "AI generation, Posters, Seasons, Subscriptions"
      ],
      [
        "Screens designed",
        "9"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "A journal that turns each day into an episode of your life — with a title, summary, cliffhanger and poster. Seven episodes make a season, with a recap at the end of every week.",
    "challenge": "Journaling apps lose people after a week. Episode had to make writing every day feel like watching your own series — fast to log, and rewarding enough to come back tomorrow.",
    "built": [
      "Episode title, summary and cliffhanger from each entry",
      "A poster generated for every episode",
      "Seven episodes form a season with a weekly recap"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "One team from first sketch to launch."
    ],
    "gallery": [
      "cs-episode-g1",
      "cs-episode-g2",
      "cs-episode-g3",
      "cs-episode-g4"
    ],
    "galleryWide": null,
    "screens": [
      "cs-episode-s1",
      "cs-episode-s2",
      "cs-episode-s3",
      "cs-episode-s4",
      "cs-episode-s5"
    ],
    "galleryCaptions": ["01  Launch", "02  Series premiere", "03  Log the day", "04  Choose a title"],
    "captions": [
      "Pick the cliffhanger",
      "The episode",
      "This week",
      "Season recap",
      "All episodes"
    ]
  },
  {
    "slug": "resumemint",
    "name": "ResumeMint",
    "color": "#0f8f7a",
    "kind": "AI careers",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Careers · AI",
    "tagline": "Turn any job posting into your next opportunity.",
    "servicesLine": "Mobile app · Product design · Applied AI",
    "cta": "Open on the App Store",
    "quote": "Turn any job posting into your next opportunity",
    "short": "Upload a resume once, paste or share a job link, and get a tailored, ATS-ready resume with a match score.",
    "about": [
      [
        "Category",
        "Careers · AI"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Built with",
        "SwiftUI, Firebase, Gemini"
      ],
      [
        "Screens designed",
        "4"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Upload a resume once, paste or share a job link, and get a tailored, ATS-ready resume with a match score — ready to download as PDF or DOCX.",
    "challenge": "Tailoring a resume for every application is slow and error-prone. ResumeMint had to read any job posting, match it honestly and produce an ATS-ready file in under a minute.",
    "built": [
      "Reads postings from LinkedIn, Indeed, Workday, Greenhouse and Lever",
      "ATS keyword matching and a match score",
      "Every change reviewable, section by section"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: SwiftUI, Firebase, Gemini."
    ],
    "gallery": [
      "cs-resumemint-g1",
      "cs-resumemint-g2",
      "cs-resumemint-g3",
      "cs-resumemint-g4"
    ],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": ["01  Upload once", "02  Paste a job link", "03  Read the job", "04  Match keywords"],
    "captions": []
  },
  {
    "slug": "between-us",
    "name": "Between Us",
    "color": "#8e44e8",
    "kind": "Relationships",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Relationships",
    "tagline": "A gentle space for you and your person.",
    "servicesLine": "Mobile app · Product design · Backend & cloud",
    "cta": "Open on the App Store",
    "quote": "A gentle space for you and your person",
    "short": "A private relationship companion.",
    "about": [
      [
        "Category",
        "Relationships"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "Couples, Check-ins, Insights, Private"
      ],
      [
        "Screens designed",
        "4"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Backend & cloud"
    ],
    "product": "A private relationship companion. Check in with how you feel, write to each other in a shared space, and notice patterns across days, weeks and months.",
    "challenge": "Couples rarely say the small things out loud. Between Us had to make checking in gentle, private and quick — without turning a relationship into a scoreboard.",
    "built": [
      "Check-ins — hurt, loved, appreciated, need to talk",
      "Our Space: private messages that don't last forever",
      "Insights across days, weeks and months"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "One team from first sketch to launch."
    ],
    "gallery": [
      "cs-between-us-g1",
      "cs-between-us-g2",
      "cs-between-us-g3",
      "cs-between-us-g4"
    ],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": ["01  Check in", "02  Today together", "03  Insights", "04  Privacy & settings"],
    "captions": []
  },
  {
    "slug": "saythis",
    "name": "SayThis",
    "color": "#2f6fe8",
    "kind": "AI social",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Social · AI",
    "tagline": "Find the right words, instantly.",
    "servicesLine": "Mobile app · Product design · Applied AI",
    "cta": "Open on the App Store",
    "quote": "Find the right words, instantly",
    "short": "Describe an awkward or high-pressure moment by typing or speaking, and get calm, ready-to-say lines in seconds.",
    "about": [
      [
        "Category",
        "Social · AI"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "AI generation, Speech recognition, Privacy first"
      ],
      [
        "Screens designed",
        "8"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Describe an awkward or high-pressure moment by typing or speaking, and get calm, ready-to-say lines in seconds — plus a clean way to exit.",
    "challenge": "In an awkward moment you have seconds, not minutes. SayThis had to turn a messy description — typed or spoken — into calm, usable words almost instantly.",
    "built": [
      "Context-aware lines generated in seconds",
      "Voice-to-text for in-the-moment use",
      "No account; prompts and recordings aren't stored"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "One team from first sketch to launch."
    ],
    "gallery": [
      "cs-saythis-g1",
      "cs-saythis-g2",
      "cs-saythis-g3",
      "cs-saythis-g4"
    ],
    "galleryWide": null,
    "screens": [
      "cs-saythis-s1",
      "cs-saythis-s2",
      "cs-saythis-s3",
      "cs-saythis-s4"
    ],
    "galleryCaptions": ["01  Launch", "02  Set your tone", "03  Describe it", "04  What to say"],
    "captions": [
      "How to exit",
      "Why it works",
      "The full answer",
      "You're ready"
    ]
  },
  {
    "slug": "c24-cardio",
    "name": "C24 Cardio",
    "color": "#0e7fa6",
    "kind": "Fitness",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Fitness",
    "tagline": "Train hard. Stay ready.",
    "servicesLine": "Mobile app · Product design · Backend & cloud",
    "cta": "Open on the App Store",
    "quote": "Train hard. Stay ready",
    "short": "A combat-conditioning round timer.",
    "about": [
      [
        "Category",
        "Fitness"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "Round timer, Audio cues, On-device data"
      ],
      [
        "Screens designed",
        "5"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Backend & cloud"
    ],
    "product": "A combat-conditioning round timer. Set rounds, work and rest, then train to loud audio cues — every session saved on-device with streaks and records.",
    "challenge": "Fighters train with sweat in their eyes and gloves on their hands. C24 Cardio had to be readable at a glance, loud when it matters, and work with no account or signal.",
    "built": [
      "Custom rounds, work and rest durations",
      "Loud audio cues for every transition",
      "Streaks, records and history — no account needed"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "One team from first sketch to launch."
    ],
    "gallery": [
      "cs-c24-cardio-g1",
      "cs-c24-cardio-g2",
      "cs-c24-cardio-g3",
      "cs-c24-cardio-g4"
    ],
    "galleryWide": null,
    "screens": [
      "cs-c24-cardio-s1"
    ],
    "galleryCaptions": ["01  Set the session", "02  Go", "03  Work", "04  Pause"],
    "captions": [
      "Progress"
    ]
  },
  {
    "slug": "dealsamor",
    "name": "DealsAmor",
    "color": "#b03bc9",
    "kind": "Local commerce",
    "platform": "iOS · Android · Web",
    "status": "shipped",
    "eyebrow": "Case study · Local commerce",
    "tagline": "Good things, close by.",
    "servicesLine": "Mobile app · Web platform · Product design",
    "cta": "Open live site",
    "quote": "Good things, close by",
    "short": "Offer discovery, wallet credentials and in-store redemption for local businesses.",
    "about": [
      [
        "Category",
        "Local commerce"
      ],
      [
        "Platform",
        "iOS · Android · Web"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Built with",
        "Expo, React Native, Next.js, Supabase"
      ],
      [
        "Screens designed",
        "2"
      ]
    ],
    "services": [
      "Mobile app",
      "Web platform",
      "Product design",
      "Backend & cloud"
    ],
    "product": "Offer discovery, wallet credentials and in-store redemption for local businesses — one product with surfaces for customers, creators and store staff.",
    "challenge": "Local offers only work if they are easy to find and hard to abuse. DealsAmor had to serve customers, creators and store staff from one product, on every platform.",
    "built": [
      "Nearby offers with list and map browsing",
      "Wallet with rotating redemption codes",
      "Business console for offers"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: Expo, React Native, Next.js, Supabase."
    ],
    "gallery": [
      "cs-dealsamor-g1",
      "cs-dealsamor-g2"
    ],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": ["01  Discover", "02  Wallet"],
    "captions": []
  },
  {
    "slug": "cafemanager",
    "name": "CafeManager",
    "color": "#178a55",
    "kind": "Hospitality",
    "platform": "iPhone",
    "status": "shipped",
    "eyebrow": "Case study · Hospitality",
    "tagline": "Run the café from your pocket.",
    "servicesLine": "Mobile app · Product design · Applied AI",
    "cta": "Open on the App Store",
    "quote": "Run the café from your pocket",
    "short": "Inventory, sales, recipes and suppliers in one app.",
    "about": [
      [
        "Category",
        "Hospitality"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Built with",
        "SwiftUI, Firebase, Apple Vision, Speech"
      ],
      [
        "Screens designed",
        "2"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Inventory, sales, recipes and suppliers in one app — with an assistant that reads supplier bills from a photo and answers questions by voice.",
    "challenge": "Small cafés run on paper bills and memory. CafeManager had to put stock, sales and suppliers in one place — and read a supplier bill from a photo.",
    "built": [
      "Live revenue, profit and stock alerts",
      "Supplier bills parsed from a photo",
      "Voice assistant"
    ],
    "proves": [
      "Shipped to real users, not left as a prototype.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: SwiftUI, Firebase, Apple Vision, Speech."
    ],
    "gallery": [
      "cs-cafemanager-g1",
      "cs-cafemanager-g2"
    ],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": ["01  Dashboard", "02  Assistant"],
    "captions": []
  },
  {
    "slug": "wayfare",
    "name": "Wayfare",
    "color": "#0b78b8",
    "kind": "AI travel",
    "platform": "Web",
    "status": "rnd",
    "eyebrow": "R&D · Structured AI trip planner",
    "tagline": "Plan a whole trip in one sentence.",
    "servicesLine": "Web platform · Product design · Applied AI",
    "cta": "Request a demo",
    "quote": "Plan a whole trip in one sentence",
    "short": "Describe the trip and get a day-by-day itinerary with places, timings and budget.",
    "about": [
      [
        "Category",
        "Structured AI trip planner"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "In active R&D"
      ],
      [
        "Built with",
        "React, Three.js, Zod, Groq"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Describe the trip and get a day-by-day itinerary with places, timings and budget — generated as typed, validated JSON so every plan is usable, and drawn on a 3D globe.",
    "challenge": "AI trip plans often look good and fall apart in use. Wayfare had to generate itineraries that are structured, validated and actually usable on the day.",
    "built": [
      "Itineraries generated as schema-validated JSON",
      "The route drawn on a 3D globe in Three.js",
      "Fast generation on Groq"
    ],
    "proves": [
      "A working build, tested on real data before it reaches client work.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: React, Three.js, Zod, Groq."
    ],
    "gallery": [],
    "galleryWide": "cs-wayfare-gallery",
    "screens": [],
    "galleryCaptions": [],
    "captions": []
  },
  {
    "slug": "siren",
    "name": "Siren",
    "color": "#c2410c",
    "kind": "Vision",
    "platform": "Web",
    "status": "rnd",
    "eyebrow": "R&D · Surveillance intelligence",
    "tagline": "Cameras that notice what matters.",
    "servicesLine": "Web platform · Product design · Computer vision",
    "cta": "Request a demo",
    "quote": "Cameras that notice what matters",
    "short": "Intelligence on top of existing CCTV: classical computer vision first, with alerts for loitering, intrusion and left objects, served through a FastAPI backend..",
    "about": [
      [
        "Category",
        "Surveillance intelligence"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "In active R&D"
      ],
      [
        "Built with",
        "Python, OpenCV, FastAPI"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Computer vision",
      "Backend & cloud"
    ],
    "product": "Intelligence on top of existing CCTV: classical computer vision first, with alerts for loitering, intrusion and left objects, served through a FastAPI backend.",
    "challenge": "Most CCTV is watched by nobody. Siren had to notice loitering, intrusion and left objects on existing cameras — without new hardware.",
    "built": [
      "Classical CV first, learned models only where they help",
      "Alerts for loitering, intrusion and left objects",
      "Streams and events through FastAPI"
    ],
    "proves": [
      "A working build, tested on real data before it reaches client work.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: Python, OpenCV, FastAPI."
    ],
    "gallery": [],
    "galleryWide": "cs-siren-gallery",
    "screens": [],
    "galleryCaptions": [],
    "captions": []
  },
  {
    "slug": "mask",
    "name": "Mask",
    "color": "#4a505c",
    "kind": "Dev tools",
    "platform": "macOS · Windows",
    "status": "rnd",
    "eyebrow": "R&D · Desktop GUI for coding agents",
    "tagline": "One window for every coding agent.",
    "servicesLine": "Desktop app · Product design",
    "cta": "Request a demo",
    "quote": "One window for every coding agent",
    "short": "A native desktop app that runs coding agents side by side.",
    "about": [
      [
        "Category",
        "Desktop GUI for coding agents"
      ],
      [
        "Platform",
        "macOS · Windows"
      ],
      [
        "Status",
        "In active R&D"
      ],
      [
        "Built with",
        "Tauri, Rust, React"
      ]
    ],
    "services": [
      "Desktop app",
      "Product design"
    ],
    "product": "A native desktop app that runs coding agents side by side — sessions, diffs and terminals in one window, built with Tauri and Rust.",
    "challenge": "Running several coding agents means juggling terminals and diffs. Mask had to put sessions, reviews and logs in one fast, native window.",
    "built": [
      "Run several agents side by side",
      "Review every diff before it lands",
      "Terminals and logs in the same window"
    ],
    "proves": [
      "A working build, tested on real data before it reaches client work.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: Tauri, Rust, React."
    ],
    "gallery": [],
    "galleryWide": "cs-mask-gallery",
    "screens": [],
    "galleryCaptions": [],
    "captions": []
  },
  {
    "slug": "edith",
    "name": "Edith",
    "color": "#9b3fe0",
    "kind": "macOS AI",
    "platform": "macOS",
    "status": "rnd",
    "eyebrow": "R&D · Local-first macOS assistant",
    "tagline": "An assistant that never leaves your Mac.",
    "servicesLine": "Desktop app · Product design · Applied AI",
    "cta": "Request a demo",
    "quote": "An assistant that never leaves your Mac",
    "short": "A local-first macOS assistant: summarise the screen, search your history and answer questions with models running on-device through Ollama..",
    "about": [
      [
        "Category",
        "Local-first macOS assistant"
      ],
      [
        "Platform",
        "macOS"
      ],
      [
        "Status",
        "In active R&D"
      ],
      [
        "Built with",
        "Swift, AppKit, SQLite, Ollama"
      ]
    ],
    "services": [
      "Desktop app",
      "Product design",
      "Applied AI"
    ],
    "product": "A local-first macOS assistant: summarise the screen, search your history and answer questions with models running on-device through Ollama.",
    "challenge": "Assistants that send your screen to the cloud are a non-starter for many teams. Edith had to be useful while keeping every model and memory on the Mac.",
    "built": [
      "Models run on-device through Ollama",
      "History stored locally in SQLite",
      "Summon it from anywhere with a shortcut"
    ],
    "proves": [
      "A working build, tested on real data before it reaches client work.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: Swift, AppKit, SQLite, Ollama."
    ],
    "gallery": [],
    "galleryWide": "cs-edith-gallery",
    "screens": [],
    "galleryCaptions": [],
    "captions": []
  },
  {
    "slug": "voice-orchestrator",
    "name": "Voice Orchestrator",
    "color": "#0e7490",
    "kind": "Voice AI",
    "platform": "Web console",
    "status": "rnd",
    "eyebrow": "R&D · Multi-tenant voice AI",
    "tagline": "A voice agent for every business.",
    "servicesLine": "Web platform · Product design · Applied AI",
    "cta": "Request a demo",
    "quote": "A voice agent for every business",
    "short": "Multi-tenant voice AI: each business gets its own agent, routing and tools, orchestrated with LangGraph and delivered over Vapi..",
    "about": [
      [
        "Category",
        "Multi-tenant voice AI"
      ],
      [
        "Platform",
        "Web console"
      ],
      [
        "Status",
        "In active R&D"
      ],
      [
        "Built with",
        "FastAPI, LangGraph, Vapi"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Multi-tenant voice AI: each business gets its own agent, routing and tools, orchestrated with LangGraph and delivered over Vapi.",
    "challenge": "Every business wants a voice agent, but each needs its own prompts, tools and routing. Voice Orchestrator had to serve many tenants from one platform.",
    "built": [
      "Separate agents, prompts and tools per tenant",
      "Conversation flows orchestrated with LangGraph",
      "Real-time calls delivered over Vapi"
    ],
    "proves": [
      "A working build, tested on real data before it reaches client work.",
      "Every state designed — empty, loading, offline and error.",
      "A maintainable stack: FastAPI, LangGraph, Vapi."
    ],
    "gallery": [],
    "galleryWide": "cs-voice-orchestrator-gallery",
    "screens": [],
    "galleryCaptions": [],
    "captions": []
  }
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Folder order in the Finder section. */
export const mobileApps = projects.filter((p) => p.status === "shipped");
export const webDesktop = projects.filter((p) => p.status === "rnd");

/** Carousel order, as laid out in the design. */
export const carouselOrder = ["episode", "resumemint", "wayfare", "saythis", "dealsamor", "mask", "between-us", "c24-cardio", "edith", "cafemanager"];

/** The three projects that follow `slug`, wrapping around — for "More work". */
export function moreWork(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return [1, 2, 3].map((k) => projects[(i + k) % projects.length]);
}
