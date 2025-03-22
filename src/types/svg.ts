import type { ValueOf } from "./util.ts";

export const SVG_ICON_VARIANTS = {
  BANDCAMP: "BandcampIcon",
  BLUESKY: "BlueskyIcon",
  EXTERNAL_LINK: "ExternalLinkIcon",
  GITHUB: "GithubIcon",
  INSTAGRAM: "InstagramIcon",
  MOON: "MoonIcon",
  SPOTIFY: "SpotifyIcon",
  SUN: "SunIcon",
  YOUTUBE: "YouTubeIcon",
} as const;

export type SvgIconVariants = typeof SVG_ICON_VARIANTS;

export type SvgIconVariant = ValueOf<SvgIconVariants>;
