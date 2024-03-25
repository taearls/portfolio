import { NavigationBar, NavigationBarProps } from "@/components/navigation";

const NAVIGATION_LINKS: NavigationBarProps["links"] = [
  {
    ariaLabel: "Visit Home Page",
    text: "Home",
    href: "/",
    isExternal: false,
  },
  {
    ariaLabel: "Visit Web Projects Page",
    text: "Web",
    href: "/web-projects",
    isExternal: false,
  },
  {
    ariaLabel: "Visit Contact Page",
    text: "Contact",
    href: "/contact",
    isExternal: false,
  },
  {
    ariaLabel: "Listen to Tyler's music on Bandcamp",
    text: "Music",
    href: "https://cuckooandthebirds.bandcamp.com",
    isExternal: true,
  },
];

export default function Header() {
  return (
    <header className="m-0 w-full">
      <NavigationBar links={NAVIGATION_LINKS} />
    </header>
  );
}
