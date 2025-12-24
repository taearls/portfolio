import type { OpenSourceProjectProps } from "@/components/OpenSourceProject/OpenSourceProject.tsx";
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
      "Built with HTML Canvas for rendering, CSS for UI styling, and JavaScript with jQuery for game logic and DOM manipulation.",
    ],
    emoji: "😉",
    height: 630,
    href: "https://space-clones.netlify.com",
    name: "Space Clones",
    tagline: "Beat my high score (if you dare)!",
    tags: ["CSS", "HTML", "JavaScript", "jQuery"],
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
    name: "email-service-rs",
    descriptions: [
      "A flexible emailing service built with Rust, integrating with the Postmark API for reliable email delivery.",
      "Designed for high performance and type safety in production environments.",
    ],
    githubUrl: "https://github.com/taearls/email-service-rs",
    tags: ["Rust", "Postmark", "API"],
    lastModified: "2025-10-10",
  },
  {
    name: "website-security-header-proxy",
    descriptions: [
      "A Cloudflare Worker proxy that adds security headers to any website.",
      "Built with Rust and deployed on Cloudflare's edge network for low-latency security enhancements.",
    ],
    githubUrl: "https://github.com/taearls/website-security-header-proxy",
    tags: ["Rust", "Cloudflare", "Security"],
    lastModified: "2025-04-26",
  },
  {
    name: "audiate",
    descriptions: [
      "A Rust crate that applies music theory to generate chords and scales from given notes.",
      "Combines my passion for music with systems programming, providing a foundation for building music applications.",
    ],
    githubUrl: "https://github.com/taearls/audiate",
    tags: ["Rust", "Music Theory", "Library"],
    lastModified: "2022-11-24",
  },
];

/**
 * Extract all unique tags from open source projects
 */
export const ALL_OPEN_SOURCE_TAGS: Array<string> = Array.from(
  new Set(OPEN_SOURCE_PROJECTS.flatMap((project) => project.tags)),
).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export type OpenSourceContributionProps = {
  projectName: string;
  projectUrl: string;
  description: string;
  prCount: number;
  highlights: Array<string>;
  tags: Array<string>;
  /** ISO date string of last merged PR (YYYY-MM-DD) */
  lastModified?: string;
};

export const OPEN_SOURCE_CONTRIBUTIONS: Array<OpenSourceContributionProps> = [
  {
    projectName: "oxc",
    projectUrl: "https://github.com/oxc-project/oxc",
    description:
      "A high-performance JavaScript/TypeScript toolchain written in Rust, featuring a linter, parser, formatter, and more.",
    prCount: 16,
    highlights: [
      "Implemented multiple vitest linter rules (prefer-to-be, valid-title, no-standalone-expect, prefer-lowercase-title)",
      "Added import/extensions rule with comprehensive edge case handling",
      "Contributed jsx-a11y/no-noninteractive-tabindex accessibility rule",
      "Refactored AST node representations for cleaner architecture",
    ],
    tags: ["Rust", "Linter", "AST", "Accessibility"],
    lastModified: "2025-12-19",
  },
  {
    projectName: "rolldown",
    projectUrl: "https://github.com/rolldown/rolldown",
    description:
      "A fast Rust-based JavaScript bundler designed as a drop-in replacement for Rollup, built to power the next generation of Vite.",
    prCount: 1,
    highlights: ["Contributed to Rollup compatibility layer"],
    tags: ["Rust", "Bundler", "Vite"],
    lastModified: "2025-12-15",
  },
  {
    projectName: "leptos",
    projectUrl: "https://github.com/leptos-rs/leptos",
    description:
      "A full-stack Rust web framework for building fast, reactive web applications with fine-grained reactivity and SSR support.",
    prCount: 1,
    highlights: ["Fixed SSR/CSR rendering consistency"],
    tags: ["Rust", "Web Framework", "SSR"],
    lastModified: "2025-11-22",
  },
  {
    projectName: "nushell",
    projectUrl: "https://github.com/nushell/nushell",
    description:
      "A modern shell that treats data as structured tables, combining the power of traditional shells with modern programming concepts.",
    prCount: 1,
    highlights: ["Enhanced developer experience and error messaging"],
    tags: ["Rust", "Shell", "CLI"],
    lastModified: "2025-11-18",
  },
  {
    projectName: "openlibrary",
    projectUrl: "https://github.com/internetarchive/openlibrary",
    description:
      "The Internet Archive's digital lending library, providing free access to millions of books. A large-scale Python/JavaScript application serving millions of users.",
    prCount: 1,
    highlights: ["Improved frontend interactivity and user experience"],
    tags: ["Python", "JavaScript", "Frontend"],
    lastModified: "2025-11-04",
  },
];

/**
 * Extract all unique tags from open source contributions
 */
export const ALL_CONTRIBUTION_TAGS: Array<string> = Array.from(
  new Set(
    OPEN_SOURCE_CONTRIBUTIONS.flatMap((contribution) => contribution.tags),
  ),
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
