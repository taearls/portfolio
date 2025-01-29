import { JustifyContentCSSValue } from "@/types/layout";
import BandcampIcon from "../icons/BandcampIcon";
import InstagramIcon from "../icons/InstagramIcon";
import SpotifyIcon from "../icons/SpotifyIcon";
import YoutubeIcon from "../icons/YouTubeIcon";
import FlexContainer from "../layout/containers/FlexContainer/FlexContainer";
import SocialMediaIcon, { SocialMediaIconProps } from "./SocialMediaIcon";

const SOCIAL_MEDIA_ICONS: Array<SocialMediaIconProps> = [
  {
    href: "https://cuckooandthebirds.bandcamp.com",
    icon: <BandcampIcon />,
    name: "Bandcamp",
  },
  {
    href: "https://open.spotify.com/artist/3JcmKe00eIMMsC0MRkKknD?si=KAG0Wnb2Sr6TYP5Rp3MWeA",
    icon: <SpotifyIcon />,
    name: "Spotify",
  },
  {
    href: "https://www.instagram.com/cuckooandthebirds",
    icon: <InstagramIcon />,
    name: "Instagram",
  },
  {
    href: "https://www.youtube.com/@cuckooandthebirdsmusic",
    icon: <YoutubeIcon />,
    name: "YouTube",
  },
];

export default function SocialMediaIcons() {
  return (
    <FlexContainer justifyContent={JustifyContentCSSValue.CENTER} gapX={2}>
      {SOCIAL_MEDIA_ICONS.map(({ name, href, icon, ariaLabel }, index) => (
        <SocialMediaIcon
          key={`${icon}-${index}`}
          name={name}
          href={href}
          icon={icon}
          ariaLabel={ariaLabel}
        />
      ))}
    </FlexContainer>
  );
}
