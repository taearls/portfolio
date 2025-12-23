import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";

// Re-export EMAIL_REGEX from shared-types for convenience
export { EMAIL_REGEX } from "@portfolio/shared-types";

export const WEB_PROJECTS: Array<Omit<WebProjectProps, "isLast">> = [
  {
    alt: "Screenshot of the Cuckoo and the Birds band website homepage",
    analytics: {
      campaign: "portfolio",
      medium: "web",
      source: "portfolio",
    },
    cloudinaryId: {
      dark: "screenshots/cuckoo-screenshot-dark",
      default: "screenshots/cuckoo-screenshot-light",
    },
    cursorStyle: "pointer",
    descriptions: [
      "The official website for my band, Cuckoo and the Birds. Features our latest releases, upcoming shows, press materials, and links to streaming platforms.",
      "Designed and developed from scratch with a mobile-first approach. Includes dark mode support, optimized image loading via Cloudinary, and smooth page transitions.",
      "Built with React 18, TypeScript, TailwindCSS, and Vite for fast performance and an excellent developer experience.",
    ],
    emoji: "🎵",
    height: 630,
    href: "https://www.cuckooandthebirds.com",
    name: "Cuckoo and the Birds Website",
    tagline: "Visit our website!",
    tags: ["React", "TailwindCSS", "TypeScript"],
    width: 1200,
  },
  {
    alt: "Screenshot of the Road Ranger website navigation header",
    analytics: undefined,
    cloudinaryId: { default: "screenshots/v2/roadranger-desktop" },
    cursorStyle: "pointer",
    descriptions: [
      "A responsive navigation system I developed as a freelance contractor for Trekk, a digital marketing agency.",
      "Implemented pixel-perfect designs for both mobile and desktop breakpoints. Features smooth dropdown animations, accessible keyboard navigation, and cross-browser compatibility.",
      "Built with vanilla JavaScript, SCSS for modular styling, and PHP for server-side integration with the existing WordPress architecture.",
    ],
    emoji: "⛽",
    height: 630,
    href: "https://www.roadrangerusa.com",
    name: "Road Ranger",
    tagline: "Check it out!",
    tags: ["JavaScript", "PHP", "SCSS"],
    width: 1200,
  },
  {
    alt: "Screenshot of the Space Clones game title screen",
    analytics: undefined,
    cloudinaryId: { default: "screenshots/v2/space-clones-game" },
    cursorStyle: "url(images/space-clones-cursor.png), pointer",
    descriptions: [
      "A retro-inspired space shooter game paying homage to the 1978 arcade classic Space Invaders. Battle waves of clone enemies and defeat the mothership boss to advance through increasingly challenging levels.",
      "Features a scoring system with bonus lives, two-player turn-based mode, and progressive difficulty scaling. Includes custom pixel art sprites and sound effects.",
      "Built with HTML5 Canvas for rendering, CSS for UI styling, and JavaScript with jQuery for game logic and DOM manipulation.",
    ],
    emoji: "😉",
    height: 630,
    href: "https://space-clones.netlify.com",
    name: "Space Clones",
    tagline: "Beat my high score (if you dare)!",
    tags: ["CSS", "HTML5", "JavaScript", "jQuery"],
    width: 1200,
  },
];

/**
 * Extract all unique tags from web projects
 */
export const ALL_PROJECT_TAGS: Array<string> = Array.from(
  new Set(WEB_PROJECTS.flatMap((project) => project.tags)),
).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export const PORTFOLIO_EMAIL = "tyler.a.earls@gmail.com";

export const BASE_URLS = {
  development: "http://localhost:8787",
  production: "",
  staging: "",
} as const;

export const API_URIS = {
  FLAGS:
    import.meta.env.VITE_FEATURE_FLAGS_API_URL ??
    "http://localhost:8787/api/flags",
  CONTACT:
    import.meta.env.VITE_CONTACT_FORM_API_URL ??
    "http://localhost:8788/api/contact",
} as const;

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
