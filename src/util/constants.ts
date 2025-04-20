import type { WebProjectProps } from "@/components/WebProject/WebProject.tsx";

export const WEB_PROJECTS: Array<Omit<WebProjectProps, "isLast">> = [
  {
    alt: "Image of Cuckoo and the Birds Website",
    analytics: {
      campaign: "portfolio",
      medium: "web",
      source: "portfolio",
    },
    cloudinaryId: "screenshots/cuckoo-screenshot-dark",
    cursorStyle: "pointer",
    descriptions: [
      "A website I made for my band, Cuckoo and the Birds, where you can find all our info, social media links, and press.",
      "If you're interested to listen, please consider streaming our music on your preferred platform.",
      "Built mobile-first with React, TypeScript, TailwindCSS, and a (mostly) healthy dose of rock 'n' roll 🤘",
    ],
    emoji: "🎵",
    href: "https://www.cuckooandthebirds.com",
    name: "Cuckoo and the Birds Website",
    tagline: "Visit our website!",
  },
  {
    alt: "Image of Road Ranger Banner",
    analytics: undefined,
    cloudinaryId: "screenshots/v2/roadranger-desktop",
    cursorStyle: "pointer",
    descriptions: [
      "A navigation header that I built while freelancing for Trekk.",
      "Both the mobile and desktop versions are based on designs their web designers prepared for the client and had me implement. Built with SCSS, JavaScript, and PHP.",
    ],
    emoji: "⛽",
    href: "https://www.roadrangerusa.com",
    name: "Road Ranger",
    tagline: "Check it out!",
  },
  {
    alt: "Image of Space Clones Title Screen",
    analytics: undefined,
    cloudinaryId: "screenshots/v2/space-clones-game",
    cursorStyle: "url(images/space-clones-cursor.png), pointer",
    descriptions: [
      "An original space shooting video game inspired by Space Invaders, the 1978 arcade classic. Defeat the clone army and then their mothership to advance to the next level.",
      "If you get a high enough score, you can earn extra lives. Play solo, or take turns with a friend. The galaxy is yours to save from the invading clone army! Created using HTML5, CSS3, JavaScript, and jQuery.",
    ],
    emoji: "😉",
    href: "https://space-clones.netlify.com",
    name: "Space Clones",
    tagline: "Beat my high score (if you dare)!",
  },
];

export const PORTFOLIO_EMAIL = "tyler.a.earls@gmail.com";

export const EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
  "gi",
);
