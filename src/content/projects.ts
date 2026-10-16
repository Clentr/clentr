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
  /** Set for projects added from the admin panel: uploaded art instead of Figma exports. */
  media?: ProjectMedia;
  /** Public link to the live product (App Store, website…). Shown as an "Open live" button. */
  liveUrl?: string;
  /** Button text for the live link, e.g. "Open on the App Store". */
  liveLabel?: string;
  /** Under NDA: no public link — the page invites people to request a walkthrough instead. */
  nda?: boolean;
  /** App icon shipped with the site (in /public); wins over the Figma icon and an uploaded one. */
  icon?: string;
  /** Column in the Work section. Older entries go by their status: shipped → apps, R&D → web & desktop. */
  group?: Group;
};

export type Group = "app" | "web" | "ai";
export const GROUPS: { k: Group; label: string }[] = [
  { k: "app", label: "Mobile apps" },
  { k: "web", label: "Web & desktop" },
  { k: "ai", label: "AI development" },
];
export const groupOf = (p: Pick<Project, "group" | "status">): Group => p.group ?? (p.status === "shipped" ? "app" : "web");

export type Device = "phone" | "desktop" | "tablet";

/** An uploaded screenshot: its pixel size picks how it is framed. */
/** Crop inside the frame: focus point in % (0–100) and zoom (1 = fit). */
export type Crop = { x: number; y: number; z: number };
export type Shot = { url: string; w: number; h: number; device: Device; crop?: Crop };

export type ProjectMedia = {
  icon: string | null;
  /** Screenshot URLs, in flow order. */
  screens: string[];
  /** Main device of the project (used when `shots` is missing). */
  device: Device;
  /** Per-screenshot size and frame; newer entries always have it. */
  shots?: Shot[];
};

/** Screenshots with their frames, for old and new entries alike. */
export const shotsOf = (m: ProjectMedia): Shot[] => m.shots ?? m.screens.map((url) => ({ url, w: 0, h: 0, device: m.device }));

/** Phone if it has a phone's proportions (about 9:19.5), otherwise a desktop or web screenshot. */
export const guessDevice = (w: number, h: number): Device => {
  const r = h / w;
  return r >= 1.6 && r <= 2.4 && w <= 1700 ? "phone" : "desktop";
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
    "icon": "/screens/icon-dealsamor.png",
    "name": "DealsAmor",
    "color": "#b03bc9",
    "kind": "Local commerce",
    "platform": "iOS · Android · Tablet",
    "status": "shipped",
    "eyebrow": "Case study · Local commerce",
    "tagline": "Good things, close by.",
    "servicesLine": "Mobile app · Product design · Backend & cloud",
    "cta": "Open live site",
    "quote": "Good things, close by",
    "short": "Verified offers from local businesses — a customer app to find and claim them, and a counter app that checks every code at the till.",
    "about": [
      [
        "Category",
        "Local commerce"
      ],
      [
        "Platform",
        "iOS · Android · Counter tablet"
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
        "19"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Backend & cloud",
      "Web platform"
    ],
    "product": "DealsAmor puts verified offers from local businesses in one place. In the customer app, people browse what’s live a few blocks away — as a list or on a map — open a business page, and add an offer to their wallet. At the till they show a QR code that changes every few seconds; staff scan it on the DealsAmor Counter tablet and get a clear answer in about a second.",
    "challenge": "Local offers only work if they’re easy to find and impossible to fake. Every redemption had to be checked live by the server, the cashier had to know exactly what to say for every outcome, and nothing could quietly fail offline — on two apps used by very different people.",
    "built": [
      "Discover nearby offers by walking distance, with filters and a map",
      "A wallet with rotating QR codes, savings and clear expiry",
      "Counter app: staff PIN sign-in, scanning or manual code entry",
      "A verdict for every case — approved, can’t apply, not verified, offline — with the words to say to the customer",
      "Shift summaries and an activity log for the business"
    ],
    "proves": [
      "Two apps, one system: customer phone and shop counter.",
      "Every outcome designed, including the awkward ones at the till.",
      "A maintainable stack: Expo, React Native, Next.js, Supabase."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": ["Discover", "Welcome", "Offers sorted by walking distance", "Map view", "A business page", "The offer", "It’s in your wallet", "Wallet", "Show this code at the register", "Discount applied", "Your savings", "Approved", "Counter · staff sign-in", "Counter · scan the code", "Pick which offer to redeem", "Can’t apply — already redeemed", "Not verified — try again", "This shift", "Staff on this tablet"],
    "captions": [],
    "media": {
      "icon": "/screens/icon-dealsamor.png",
      "screens": ["/screens/da-app-3.webp", "/screens/da-app-1.webp", "/screens/da-app-2.webp", "/screens/da-app-4.webp", "/screens/da-app-5.webp", "/screens/da-app-6.webp", "/screens/da-app-7.webp", "/screens/da-app-8.webp", "/screens/da-app-9.webp", "/screens/da-app-10.webp", "/screens/da-app-11.webp", "/screens/da-counter-3.webp", "/screens/da-counter-1.webp", "/screens/da-counter-2.webp", "/screens/da-counter-6.webp", "/screens/da-counter-4.webp", "/screens/da-counter-5.webp", "/screens/da-counter-7.webp", "/screens/da-counter-8.webp"],
      "device": "phone",
      "shots": [
        {
          "url": "/screens/da-app-3.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-1.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-2.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-4.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-5.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-6.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-7.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-8.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-9.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-10.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-app-11.webp",
          "w": 390,
          "h": 844,
          "device": "phone"
        },
        {
          "url": "/screens/da-counter-3.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-1.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-2.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-6.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-4.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-5.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-7.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        },
        {
          "url": "/screens/da-counter-8.webp",
          "w": 1024,
          "h": 768,
          "device": "tablet"
        }
      ]
    }
  },
  {
    "slug": "cafemanager",
    "icon": "/screens/icon-cafemanager.png",
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
    "icon": "/screens/icon-wayfare.png",
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
    "icon": "/screens/icon-siren.png",
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
    "icon": "/screens/icon-edith.png",
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
    "icon": "/screens/icon-voice-orchestrator.png",
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
  },
  {
    "slug": "erp-assistant",
    "name": "Inventory ERP Assistant",
    "color": "#2d46ff",
    "kind": "AI ERP analytics",
    "platform": "Web",
    "status": "rnd",
    "eyebrow": "Case study · Supply chain · AI",
    "tagline": "Ask your ERP anything, in plain English.",
    "servicesLine": "Web platform · Applied AI · Backend & cloud",
    "cta": "",
    "quote": "Ask your ERP anything, in plain English",
    "short": "An AI assistant that answers stock, sales and supplier questions with live SQL, tables and charts.",
    "about": [
      [
        "Category",
        "Supply chain · AI"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "In R&D"
      ],
      [
        "Highlights",
        "Natural-language SQL, live charts, CSV export"
      ]
    ],
    "services": [
      "Web platform",
      "Applied AI",
      "Backend & cloud",
      "Product design"
    ],
    "product": "Operations teams ask questions like “Which products are below their reorder level?” and get an answer in seconds — written up in plain English, backed by a chart or table, and exportable as CSV. Live KPIs for stock value, revenue, backorders and open POs sit across the top.",
    "challenge": "ERP data is rich but locked behind reports only analysts can build. The assistant had to turn everyday questions into correct SQL on live data, explain the result clearly, and stay honest about what it can and can’t verify.",
    "built": [
      "Plain-English questions turned into SQL on the live ERP database",
      "Answers with summaries, charts and tables — line or bar, CSV export",
      "Suggested questions across stock, reorder, purchasing, sales and fulfilment"
    ],
    "proves": [
      "A useful AI system on real business data, not a demo chatbot.",
      "Every answer shows its numbers, so people can check before acting.",
      "Fast to adopt: no reports to build, just ask."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Ask anything — live KPIs and suggested questions",
      "Monthly sales trend, answered with a chart",
      "Stock value by warehouse",
      "Products below their reorder level"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/erp-icon.png",
      "screens": [
        "/screens/erp-home.webp",
        "/screens/erp-trend.webp",
        "/screens/erp-warehouse.webp",
        "/screens/erp-reorder.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/erp-home.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/erp-trend.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/erp-warehouse.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/erp-reorder.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  },

  {
    "slug": "rebase",
    "name": "Rebase",
    "color": "#ff5b24",
    "kind": "Posture coaching",
    "platform": "iPhone",
    "status": "rnd",
    "group": "app",
    "eyebrow": "Case study · Health · AI",
    "tagline": "Your head, back over your shoulders.",
    "servicesLine": "Mobile app · Product design · Applied AI",
    "cta": "",
    "quote": "Your head, back over your shoulders",
    "short": "A six-minute daily posture coach for desk workers, with a guide who does every move alongside you.",
    "about": [
      [
        "Category",
        "Health & fitness · AI"
      ],
      [
        "Platform",
        "iPhone"
      ],
      [
        "Status",
        "In R&D"
      ],
      [
        "Highlights",
        "Posture scan, 4-week plan, guided player, re-scans"
      ],
      [
        "Screens designed",
        "69"
      ]
    ],
    "services": [
      "Mobile app",
      "Product design",
      "Applied AI",
      "Backend & cloud"
    ],
    "product": "Rebase is a six-minute daily coach for people who sit six or more hours a day. A short quiz and a guided photo scan set up a personal 4-week plan for the neck, upper back and chest. A 3D coach — him or her, your choice — shows every move, then does it with you, with spoken cues and captions.",
    "challenge": "Stretching apps give people a picture and a timer, and most are dropped within a week. Rebase had to feel like a real coach: safe for a sore neck, short enough for a workday, and private — posture photos stay on the phone.",
    "built": [
      "Guided front and side posture scan, with results in plain words",
      "A 4-week plan with weekly check-ins and re-scans on day 14 and 28",
      "Learn and flow player modes, with a “This hurts” option on every move",
      "Paywall, streaks, badges, discreet reminders and a home-screen widget"
    ],
    "proves": [
      "Every state designed — camera off, poor lighting, offline, purchase failed.",
      "Light and dark themes with two coaches, across 69 screens.",
      "A full launch kit: app icon, launch screen and landing page."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Launch",
      "Pick your coach",
      "Guided posture scan",
      "What the scan found",
      "Your 4-week plan",
      "Paywall with a free week",
      "Today",
      "Plan",
      "Player · learn mode",
      "Day done",
      "Progress",
      "Exercise library",
      "Home-screen widget",
      "Today · light",
      "Player · light"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/rebase-icon.png",
      "screens": [
        "/screens/rebase-app-1.webp",
        "/screens/rebase-app-2.webp",
        "/screens/rebase-app-3.webp",
        "/screens/rebase-app-4.webp",
        "/screens/rebase-app-5.webp",
        "/screens/rebase-app-6.webp",
        "/screens/rebase-app-7.webp",
        "/screens/rebase-app-8.webp",
        "/screens/rebase-app-9.webp",
        "/screens/rebase-app-10.webp",
        "/screens/rebase-app-11.webp",
        "/screens/rebase-app-12.webp",
        "/screens/rebase-app-13.webp",
        "/screens/rebase-app-14.webp",
        "/screens/rebase-app-15.webp"
      ],
      "device": "phone",
      "shots": [
        {
          "url": "/screens/rebase-app-1.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-2.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-3.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-4.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-5.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-6.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-7.webp",
          "w": 786,
          "h": 2006,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-8.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-9.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-10.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-11.webp",
          "w": 786,
          "h": 2360,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-12.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-13.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-14.webp",
          "w": 786,
          "h": 2006,
          "device": "phone"
        },
        {
          "url": "/screens/rebase-app-15.webp",
          "w": 786,
          "h": 1704,
          "device": "phone"
        }
      ]
    },
    "nda": true
  },
  {
    "slug": "rebase-web",
    "name": "Rebase website",
    "color": "#ff5b24",
    "kind": "Landing page",
    "platform": "Web",
    "status": "rnd",
    "group": "web",
    "eyebrow": "Case study · Health · Marketing site",
    "tagline": "A coach, not a picture and a timer.",
    "servicesLine": "Web platform · Product design · Launch & growth",
    "cta": "",
    "quote": "A coach, not a picture and a timer",
    "short": "The launch site for Rebase: one scroll from the problem to a free trial.",
    "about": [
      [
        "Category",
        "Health & fitness"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "In R&D"
      ],
      [
        "Highlights",
        "Live player hero, coaches, plan, pricing, FAQ"
      ],
      [
        "Screens designed",
        "9"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Launch & growth"
    ],
    "product": "The marketing site for the Rebase app. It opens on the coach mid-session, then walks through the four-step setup, the two coaches, what’s inside the app, the 4-week plan, safety and privacy, reviews, pricing and FAQ — one story that ends at the free week.",
    "challenge": "Posture apps all promise the same thing. The site had to show the coach actually working, answer the safety and privacy questions before anyone asks, and make the pricing feel fair.",
    "built": [
      "A hero built from the real player, with reminder and progress cards",
      "How it works in four steps, both coaches and a tour of the app",
      "Safety, privacy, reviews, pricing with a free week, and an FAQ"
    ],
    "proves": [
      "App and website designed together, in one visual language.",
      "Clear pricing: monthly, annual with a free week, or lifetime.",
      "Every claim on the page is backed by a real app screen."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Hero",
      "How it works",
      "Pick your coach",
      "Inside the app",
      "A plan that grows with you",
      "Private by default",
      "Made for real desk days",
      "Pricing",
      "Your six minutes are ready"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/rebase-icon.png",
      "screens": [
        "/screens/rebase-web-1.webp",
        "/screens/rebase-web-2.webp",
        "/screens/rebase-web-3.webp",
        "/screens/rebase-web-4.webp",
        "/screens/rebase-web-5.webp",
        "/screens/rebase-web-6.webp",
        "/screens/rebase-web-7.webp",
        "/screens/rebase-web-8.webp",
        "/screens/rebase-web-9.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/rebase-web-1.webp",
          "w": 1920,
          "h": 1297,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-2.webp",
          "w": 1920,
          "h": 1147,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-3.webp",
          "w": 1920,
          "h": 1275,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-4.webp",
          "w": 1920,
          "h": 1504,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-5.webp",
          "w": 1920,
          "h": 1211,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-6.webp",
          "w": 1920,
          "h": 1448,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-7.webp",
          "w": 1920,
          "h": 1206,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-8.webp",
          "w": 1920,
          "h": 1728,
          "device": "desktop"
        },
        {
          "url": "/screens/rebase-web-9.webp",
          "w": 1920,
          "h": 907,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  },
  {
    "slug": "vr-robotics",
    "name": "VR Robotics Academy",
    "color": "#ff6a00",
    "kind": "EdTech platform",
    "platform": "Web",
    "status": "shipped",
    "group": "web",
    "eyebrow": "Case study · Education",
    "tagline": "Robotics, coding and AI for young learners.",
    "servicesLine": "Web platform · Product design · Backend & cloud",
    "cta": "",
    "quote": "Robotics, coding and AI for young learners",
    "short": "The website and learning platform for a robotics, coding and AI academy for school students.",
    "about": [
      [
        "Category",
        "Education"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "Course catalogue, founder workshops, demo booking, admin platform"
      ],
      [
        "Screens designed",
        "7"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Backend & cloud"
    ],
    "product": "VR Robotics Academy teaches robotics, coding, AI and VR to school students, online and on campus. The site lays out an 18-module curriculum, the course catalogue and a weekly free workshop with the founder, and turns visits into demo bookings. Behind it, an admin platform runs courses, classes, demos, certificates, schools, batches and leads.",
    "challenge": "Parents need to trust a programme before they book a demo. The site had to explain a long curriculum simply, show what students actually build, and make booking a demo the obvious next step.",
    "built": [
      "Marketing site with course search, curriculum and course catalogue",
      "A weekly founder workshop with live seat count and registration",
      "Student sign-in and an admin platform for courses, classes, demos, certificates and leads"
    ],
    "proves": [
      "Live with real students, parents and teachers.",
      "A clear path from first visit to a booked demo.",
      "One team for the website and the platform behind it."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Home",
      "Weekly workshop with the founder",
      "An 18-module journey",
      "Course catalogue",
      "Project-based learning",
      "Why VR Robotics",
      "Getting started"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/vr-icon.png",
      "screens": [
        "/screens/vr-1.webp",
        "/screens/vr-2.webp",
        "/screens/vr-3.webp",
        "/screens/vr-4.webp",
        "/screens/vr-5.webp",
        "/screens/vr-6.webp",
        "/screens/vr-7.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/vr-1.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-2.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-3.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-4.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-5.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-6.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/vr-7.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  },
  {
    "slug": "gir-valley-dairy",
    "name": "Gir Valley Dairy",
    "color": "#0f8423",
    "kind": "Dairy commerce admin",
    "platform": "Web",
    "status": "shipped",
    "group": "web",
    "eyebrow": "Case study · Food & agriculture",
    "tagline": "Farm-fresh dairy, run from one screen.",
    "servicesLine": "Web platform · Product design · Backend & cloud",
    "cta": "",
    "quote": "Farm-fresh dairy, run from one screen",
    "short": "The admin behind a farm-to-doorstep dairy: orders, stock, delivery areas and pickup points.",
    "about": [
      [
        "Category",
        "Food & agriculture"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "Orders, stock, delivery map, pickup points"
      ],
      [
        "Screens designed",
        "5"
      ]
    ],
    "services": [
      "Web platform",
      "Product design",
      "Backend & cloud"
    ],
    "product": "Gir Valley Dairy sells milk, curd, paneer, ghee and drinks straight from the farm. The farm team runs everything from this admin: today’s orders and deadlines, products with sizes and prices, stock and variants, delivery areas with pincodes and charges, pickup points for inter-city orders, and the store settings the customer app reads.",
    "challenge": "A dairy works to same-day deadlines with stock that spoils. The farm team needed to see what’s late, what’s running out and where every order is going — at a glance, without spreadsheets.",
    "built": [
      "A dashboard with orders, revenue, active deliveries and low-stock alerts",
      "Products, categories, sizes and stock, with a movement log",
      "Delivery areas on a map with pincodes, charges and delivery windows",
      "Pickup points at bus stations for inter-city orders, and a delivery board"
    ],
    "proves": [
      "Built around a real business’s daily routine.",
      "Every list can be filtered and searched; orders export to CSV.",
      "One admin drives the customer app’s catalogue and branding."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Dashboard — today on the farm",
      "Products, sizes and prices",
      "Stock and variants",
      "Delivery areas and charges",
      "Categories"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/dairy-icon.png",
      "screens": [
        "/screens/dairy-1.webp",
        "/screens/dairy-2.webp",
        "/screens/dairy-3.webp",
        "/screens/dairy-4.webp",
        "/screens/dairy-5.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/dairy-1.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/dairy-2.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/dairy-3.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/dairy-4.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/dairy-5.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  },
  {
    "slug": "attentionx",
    "name": "AttentionX Labs",
    "color": "#3a3a38",
    "kind": "Studio website",
    "platform": "Web",
    "status": "shipped",
    "group": "web",
    "eyebrow": "Case study · Engineering studio",
    "tagline": "Command attention.",
    "servicesLine": "Web platform · Product design",
    "cta": "",
    "quote": "Command attention",
    "short": "A dot-matrix, monochrome website for an AI-first engineering studio.",
    "about": [
      [
        "Category",
        "Engineering studio"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "Shipped"
      ],
      [
        "Highlights",
        "Dot-matrix type, light and dark, brief form"
      ],
      [
        "Screens designed",
        "4"
      ]
    ],
    "services": [
      "Web platform",
      "Product design"
    ],
    "product": "AttentionX Labs designs and ships applied AI, data platforms and infrastructure. Their site reads like an instrument panel — dot-matrix display type, a hand-drawn mark and a quiet monochrome palette — and walks through what they’re hired to build, how they work, and a short project brief.",
    "challenge": "Engineering studios tend to look alike. This one needed a voice and a visual system of its own that says “senior engineers” without a single stock photo.",
    "built": [
      "Dot-matrix display type and a monochrome system, in light and dark",
      "A capabilities grid, a three-step approach and a tech-stack marquee",
      "A short project brief that goes straight to the team"
    ],
    "proves": [
      "A brand system, not a template.",
      "Every section says one thing, in plain words.",
      "Design and copy written together."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Hero",
      "What we are hired to build",
      "How we work",
      "Tell us what has to exist"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/attx-icon.png",
      "screens": [
        "/screens/attx-1.webp",
        "/screens/attx-2.webp",
        "/screens/attx-3.webp",
        "/screens/attx-4.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/attx-1.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/attx-2.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/attx-3.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/attx-4.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  },
  {
    "slug": "finbot",
    "icon": "/screens/icon-finbot.png",
    "name": "FinBot Security Audit",
    "color": "#4f46e5",
    "kind": "LLM security",
    "platform": "Web",
    "status": "rnd",
    "group": "web",
    "eyebrow": "Case study · Fintech · AI security",
    "tagline": "Can a bank’s chatbot be tricked into leaking customer data?",
    "servicesLine": "Applied AI · Web platform · Backend & cloud",
    "cta": "",
    "quote": "Can a bank’s chatbot be tricked into leaking customer data",
    "short": "A red-team audit of a banking support chatbot — the attacks, the fixes and the monitoring that proves them.",
    "about": [
      [
        "Category",
        "Fintech · AI security"
      ],
      [
        "Platform",
        "Web"
      ],
      [
        "Status",
        "In R&D"
      ],
      [
        "Highlights",
        "Red-team tests, guardrails, Langfuse tracing"
      ],
      [
        "Screens designed",
        "6"
      ]
    ],
    "services": [
      "Applied AI",
      "Web platform",
      "Backend & cloud"
    ],
    "product": "FinBot is a support assistant for a fictional bank. The same attacks — prompt injection, data leakage, excessive agency, hijacking and hallucination — were sent to the original bot and to a hardened version. Every message, guardrail decision and score is traced and shown in a read-only monitoring view.",
    "challenge": "Chatbots with access to account data fail quietly. The audit had to find the real leaks, fix them with input and output guardrails, and show the before and after so that someone who isn’t an engineer can see what changed.",
    "built": [
      "A red-team suite of 20 tests across six attack categories",
      "Input and output guardrails — the pass rate went from 40% to 100%",
      "Side-by-side chat that sends one message to both versions",
      "Langfuse tracing for sessions, traces, scores and latency"
    ],
    "proves": [
      "AI with guardrails you can measure, not promise.",
      "Every answer is traced, so failures can be found and fixed.",
      "Results a security reviewer and a product owner can both read."
    ],
    "gallery": [],
    "galleryWide": null,
    "screens": [],
    "galleryCaptions": [
      "Audit results — before and after",
      "Try the chatbot on both versions",
      "Monitoring overview",
      "Every message, traced",
      "A blocked attack, step by step",
      "Guardrail scores"
    ],
    "captions": [],
    "media": {
      "icon": "/screens/icon-finbot.png",
      "screens": [
        "/screens/finbot-1.webp",
        "/screens/finbot-2.webp",
        "/screens/finbot-3.webp",
        "/screens/finbot-4.webp",
        "/screens/finbot-5.webp",
        "/screens/finbot-6.webp"
      ],
      "device": "desktop",
      "shots": [
        {
          "url": "/screens/finbot-1.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/finbot-2.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/finbot-3.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/finbot-4.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/finbot-5.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        },
        {
          "url": "/screens/finbot-6.webp",
          "w": 1920,
          "h": 1200,
          "device": "desktop"
        }
      ]
    },
    "nda": true
  }
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Folder order in the Finder section. */
export const mobileApps = projects.filter((p) => p.status === "shipped");
export const webDesktop = projects.filter((p) => p.status === "rnd");

/** Carousel order, as laid out in the design. */
export const carouselOrder = ["episode", "inventory-erp", "resumemint", "wayfare", "saythis", "dealsamor", "mask", "between-us", "c24-cardio", "edith", "cafemanager"];
