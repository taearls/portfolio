import type { FlexContainerProps } from "@/types/FlexContainer.ts";
import type { RouteDataItem } from "@/util/constants/data/navigation/navigationData.tsx";
import type { NavLinkRenderProps } from "react-router";

import { useMachine } from "@xstate/react";
import { useCallback } from "react";
import { NavLink, useLocation } from "react-router";

import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle.tsx";
import { InlineAnchorContent } from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import NavigationBarListItem from "@/components/navigation/NavigationBar/NavigationBarListItem.tsx";
import NavigationToggle from "@/components/navigation/NavigationToggle/NavigationToggle.tsx";
import {
  NAVIGATION_EVENT,
  NAVIGATION_STATE,
  navigationMachine,
} from "@/state/machines/navigationMachine.ts";
import { FlexFlowCSSValue, MediaQueryPrefixValue } from "@/types/layout.ts";
import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./NavigationBar.module.css";

export type NavigationBarProps = {
  links: Array<RouteDataItem>;
};

const navigationContainerResponsiveProp: FlexContainerProps["responsive"] = {
  flexFlow: {
    prefix: MediaQueryPrefixValue.SM,
    value: FlexFlowCSSValue.ROW,
  },
  gapX: { prefix: MediaQueryPrefixValue.SM, value: 4 },
};

/**
 * Tailwind JIT safelist - these classes are generated dynamically by FlexContainer
 * and need to be explicitly listed for Tailwind to detect them:
 * flex flex-col flex-row w-full gap-x-1 gap-x-2 gap-x-3 gap-x-4 gap-x-5 gap-x-6 gap-x-7 gap-x-8
 * gap-y-1 gap-y-2 gap-y-3 gap-y-4 gap-y-5 gap-y-6 gap-y-7 gap-y-8
 * sm:flex-col sm:flex-row sm:gap-x-1 sm:gap-x-2 sm:gap-x-3 sm:gap-x-4 sm:gap-x-5 sm:gap-x-6 sm:gap-x-7 sm:gap-x-8
 * md:flex-col md:flex-row lg:flex-col lg:flex-row xl:flex-col xl:flex-row 2xl:flex-col 2xl:flex-row
 */
export default function NavigationBar({ links }: NavigationBarProps) {
  const [isNavigationOpen, sendNavigationUpdate] =
    useMachine(navigationMachine);
  const location = useLocation();
  const selectedLink = links.find((link) => link.href === location.pathname);

  const handleToggle = () => {
    sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
  };

  // NOTE: useCallback kept for NavLink className prop stability
  const getNavLinkClass = useCallback(
    (props: NavLinkRenderProps) =>
      mergeClasses(props.isActive && "active underline decoration-4"),
    [],
  );

  const navigationLinks = links
    .filter((link) => !link.hidden)
    .map((link, index) => {
      return (
        <NavigationBarListItem
          key={link.name}
          isLast={index === links.filter((link) => !link.hidden).length - 1}
        >
          <NavLink
            to={link.href}
            aria-label={link.ariaLabel}
            className={getNavLinkClass}
          >
            <InlineAnchorContent
              isExternal={Boolean(link.isExternal)}
              bold
              underline={selectedLink?.href === link.href}
            >
              {link.name}
            </InlineAnchorContent>
          </NavLink>
        </NavigationBarListItem>
      );
    });

  return (
    <nav id="navigation-bar" className={mergeClasses(styles["navigation-bar"])}>
      <ul
        role="menu"
        className={mergeClasses(
          styles["navigation-list-container"],
          isNavigationOpen.value === NAVIGATION_STATE.CLOSED && "hidden",
        )}
      >
        <FlexContainer
          flexFlow={FlexFlowCSSValue.COLUMN}
          responsive={navigationContainerResponsiveProp}
        >
          {navigationLinks}
        </FlexContainer>
      </ul>

      <div className={mergeClasses(styles["navigation-toggle-container"])}>
        {/* <RenderIf condition={isNavigationOpen.value === NAVIGATION_STATE.OPEN}> */}
        <DarkModeToggle
          visible={isNavigationOpen.value === NAVIGATION_STATE.OPEN}
        />
        {/* </RenderIf> */}
        <NavigationToggle
          active={isNavigationOpen.value === NAVIGATION_STATE.OPEN}
          onClick={handleToggle}
        />
      </div>
    </nav>
  );
}
