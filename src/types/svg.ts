import type { ValueOf } from "./util.ts";

export const SVG_ICON_VARIANTS = {
  BANDCAMP: "BandcampIcon",
  BLUESKY: "BlueskyIcon",
  EXTERNAL_LINK: "ExternalLinkIcon",
  GITHUB: "GithubIcon",
  INSTAGRAM: "InstagramIcon",
  LINKEDIN: "LinkedInIcon",
  MOON: "MoonIcon",
  SPOTIFY: "SpotifyIcon",
  SUN: "SunIcon",
  YOUTUBE: "YouTubeIcon",
} as const satisfies Record<string, string>;

export type SvgIconVariants = typeof SVG_ICON_VARIANTS;

export type SvgIconVariant = ValueOf<SvgIconVariants>;
