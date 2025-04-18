import type { SocialMediaIconProps } from "@/components/SocialMediaIcons/SocialMediaIcon.tsx";

import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import SocialMediaIcon from "@/components/SocialMediaIcons/SocialMediaIcon.tsx";
import { JustifyContentCSSValue } from "@/types/layout.ts";
import BlueskyIcon from "../icons/BlueskyIcon.tsx";
import GithubIcon from "../icons/GithubIcon.tsx";
import LinkedInIcon from "../icons/LinkedInIcon.tsx";

const SOCIAL_MEDIA_ICONS: Array<SocialMediaIconProps> = [
  {
    href: "https://www.github.com/taearls",
    icon: <GithubIcon />,
    name: "Github",
  },
  {
    href: "https://bsky.app/profile/tylerearls.com",
    icon: <BlueskyIcon />,
    name: "Bluesky",
  },
  {
    href: "https://www.linkedin.com/in/tylerearls",
    icon: <LinkedInIcon />,
    name: "LinkedIn",
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
