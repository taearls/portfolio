import NavigationLink, { NavigationLinkProps } from "../NavigationLink";

export type NavigationBarProps = {
  links: Array<NavigationLinkProps>;
};

export default function NavigationBar({ links }: NavigationBarProps) {
  return (
    <div className="mb-4 h-fit w-full">
      <nav className="dark:bg-soft-black font-default fixed top-0 mb-4 flex h-48 w-full flex-col items-center justify-evenly border border-b border-l-0 border-r-0 border-t-0 bg-white font-mono text-black sm:h-16 sm:flex-row sm:justify-center dark:text-white">
        <ul className="flex h-auto w-40 flex-col items-center justify-center sm:h-16 sm:w-full sm:flex-row">
          {links.map((link, index) => (
            <NavigationLink
              key={index}
              ariaLabel={link.ariaLabel}
              isExternal={link.isExternal}
              href={link.href}
              text={link.text}
            />
          ))}
        </ul>
      </nav>
      <div className={"top-0 h-48 w-screen bg-none sm:h-16"}></div>
    </div>
  );
}
