export type NavigationBarListItemProps = {
  isLast: boolean;
  children: React.ReactNode | React.ReactNode[];
};

export default function NavigationBarListItem({
  isLast,
  children,
}: NavigationBarListItemProps) {
  const borderClass = isLast
    ? ""
    : "border-b-1 border border-l-0 border-r-0 border-t-0 border-gray-400 sm:border-none dark:border-gray-500";

  return (
    <li
      role="menuitem"
      className={`${borderClass} mx-auto flex w-full justify-center py-2 sm:mx-2 sm:inline-block sm:h-fit sm:w-auto sm:py-0`}
    >
      {children}
    </li>
  );
}
