"use client";
// if I don't add the "use client" directive, this component won't work.
import { GithubIcon, LinkedInIcon } from ".";
import BlueskyIcon from "./BlueskyIcon";

export type SocialMediaIconLink = {
  href: string;
  ariaLabel: string;
  icon: React.ReactNode | React.ReactNode[];
};

// svg icons sourced from https://www.svgrepo.com/
const SOCIAL_MEDIA_ICONS: Array<SocialMediaIconLink> = [
  {
    ariaLabel: "Go to Tyler's Github",
    href: "https://www.github.com/taearls",
    icon: <GithubIcon />,
  },
  // {
  //   ariaLabel: "Go to Tyler's Bandcamp",
  //   href: "https://cuckooandthebirds.bandcamp.com",
  //   icon: <BandcampIcon />,
  // },
  {
    ariaLabel: "Go to Tyler's Bluesky",
    href: "https://bsky.app/profile/tylerearls.com",
    icon: <BlueskyIcon />,
  },
  {
    ariaLabel: "Go to Tyler's LinkedIn",
    href: "https://www.linkedin.com/in/tylerearls",
    icon: <LinkedInIcon />,
  },
];

export default function SocialMediaIcons() {
  return (
    <div className="flex justify-center gap-x-1">
      {SOCIAL_MEDIA_ICONS.map((icon, index) => (
        <a
          key={index}
          href={icon.href}
          aria-label={icon.ariaLabel}
          className="focus:shadow-outline-light dark:focus:shadow-outline-dark rounded-sm focus:outline-none"
          target="_blank"
        >
          <span className="rounded-sm text-purple-700 hover:text-cyan-400 dark:text-purple-400 dark:hover:text-cyan-300">
            {icon.icon}
          </span>
        </a>
      ))}
    </div>
  );
}
