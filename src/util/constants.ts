import type { OpenSourceProjectProps } from "@/components/OpenSourceProject/OpenSourceProject.tsx";
import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";

// Re-export EMAIL_REGEX from shared-types for convenience
export { EMAIL_REGEX } from "@portfolio/shared-types";

export const WEB_PROJECTS: Array<Omit<WebProjectProps, "isLast">> = [
  {
    alt: "Image of Cuckoo and the Birds Website",
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
      "A website I made for my band, Cuckoo and the Birds, where you can find all our info, social media links, and press.",
      "If you're interested to listen, please consider streaming our music on your preferred platform.",
      "Built mobile-first with React, TypeScript, TailwindCSS, and a (mostly) healthy dose of rock 'n' roll 🤘",
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
    alt: "Image of Road Ranger Banner",
    analytics: undefined,
    cloudinaryId: { default: "screenshots/v2/roadranger-desktop" },
    cursorStyle: "pointer",
    descriptions: [
      "A navigation header that I built while freelancing for Trekk.",
      "Both the mobile and desktop versions are based on designs their web designers prepared for the client and had me implement. Built with SCSS, JavaScript, and PHP.",
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
    alt: "Image of Space Clones Title Screen",
    analytics: undefined,
    cloudinaryId: { default: "screenshots/v2/space-clones-game" },
    cursorStyle: "url(images/space-clones-cursor.png), pointer",
    descriptions: [
      "An original space shooting video game inspired by Space Invaders, the 1978 arcade classic. Defeat the clone army and then their mothership to advance to the next level.",
      "If you get a high enough score, you can earn extra lives. Play solo, or take turns with a friend. The galaxy is yours to save from the invading clone army! Created using HTML5, CSS3, JavaScript, and jQuery.",
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

export const OPEN_SOURCE_PROJECTS: Array<
  Omit<OpenSourceProjectProps, "isLast">
> = [
  {
    name: "audiate",
    descriptions: [
      "A Rust crate that applies music theory to generate chords and scales from given notes.",
      "Combines my passion for music with systems programming, providing a foundation for building music applications.",
    ],
    githubUrl: "https://github.com/taearls/audiate",
    language: "Rust",
    tags: ["Rust", "Music Theory", "Library"],
  },
  {
    name: "oxc-devtools",
    descriptions: [
      "A focused set of utility crates that assist with debugging the oxc JavaScript/TypeScript toolchain.",
      "Contributes to the broader Rust ecosystem for web development tooling.",
    ],
    githubUrl: "https://github.com/taearls/oxc-devtools",
    language: "Rust",
    tags: ["Rust", "Developer Tools", "Open Source"],
  },
  {
    name: "email-service-rs",
    descriptions: [
      "A flexible emailing service built with Rust, integrating with the Postmark API for reliable email delivery.",
      "Designed for high performance and type safety in production environments.",
    ],
    githubUrl: "https://github.com/taearls/email-service-rs",
    language: "Rust",
    tags: ["Rust", "Postmark", "API"],
  },
  {
    name: "website-security-header-proxy",
    descriptions: [
      "A Cloudflare Worker proxy that adds security headers to any website.",
      "Built with Rust and deployed on Cloudflare's edge network for low-latency security enhancements.",
    ],
    githubUrl: "https://github.com/taearls/website-security-header-proxy",
    language: "Rust",
    tags: ["Rust", "Cloudflare", "Security"],
  },
];

/**
 * Extract all unique tags from open source projects
 */
export const ALL_OPEN_SOURCE_TAGS: Array<string> = Array.from(
  new Set(OPEN_SOURCE_PROJECTS.flatMap((project) => project.tags)),
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
