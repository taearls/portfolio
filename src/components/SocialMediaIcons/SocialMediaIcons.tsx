import type { SocialMediaIconProps } from "@/components/SocialMediaIcons/SocialMediaIcon.tsx";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import SocialMediaIcon from "@/components/SocialMediaIcons/SocialMediaIcon.tsx";
import { JustifyContentCSSValue } from "@/types/layout.ts";
import { ValueOf } from "@/types/util.ts";
import BandcampIcon from "../icons/BandcampIcon.tsx";
import BlueskyIcon from "../icons/BlueskyIcon.tsx";
import GithubIcon from "../icons/GithubIcon.tsx";
import InstagramIcon from "../icons/InstagramIcon.tsx";
import MoonIcon from "../icons/MoonIcon.tsx";
import SpotifyIcon from "../icons/SpotifyIcon.tsx";
import SunIcon from "../icons/SunIcon.tsx";
import YouTubeIcon from "../icons/YouTubeIcon.tsx";

export const SocialMediaIconVariants = {
  BANDCAMP: "BandcampIcon",
  BLUESKY: "BlueskyIcon",
  GITHUB: "GithubIcon",
  INSTAGRAM: "InstagramIcon",
  MOON: "MoonIcon",
  SPOTIFY: "SpotifyIcon",
  SUN: "SunIcon",
  YOUTUBE: "YouTubeIcon",
} as const;

type SocialMediaIconVariant = ValueOf<typeof SocialMediaIconVariants>;

const SOCIAL_MEDIA_ICONS: Array<SocialMediaIconProps> = [
  {
    href: "https://cuckooandthebirds.bandcamp.com",
    icon: <BandcampIcon />,
    name: "Bandcamp",
  },
  {
    href: "https://bsky.app/profile/tylerearls.com",
    icon: <BlueskyIcon />,
    name: "Bluesky",
  },
  {
    href: "https://www.instagram.com/tyler__earls",
    icon: <InstagramIcon />,
    name: "Instagram",
  },
  {
    href: "https://www.youtube.com/@cuckooandthebirdsmusic",
    icon: <YouTubeIcon />,
    name: "YouTube",
  },
  {
    href: "",
    icon: <SunIcon />,
    name: "Sun",
    accent: false,
  },
  {
    href: "",
    icon: <MoonIcon />,
    name: "Moon",
    accent: false,
  },
  {
    href: "https://www.github.com/taearls",
    icon: <GithubIcon />,
    name: "Github",
  },
  {
    href: "",
    icon: <SpotifyIcon />,
    name: "Spotify",
  },
];

export default function SocialMediaIcons() {
  return (
    <FlexContainer justifyContent={JustifyContentCSSValue.CENTER} gapX={2}>
      {SOCIAL_MEDIA_ICONS.map(({ name, href, icon, ariaLabel, accent }) => (
        <SocialMediaIcon
          key={name}
          name={name}
          href={href}
          icon={icon}
          ariaLabel={ariaLabel}
          accent={accent}
        />
      ))}
    </FlexContainer>
  );
}
