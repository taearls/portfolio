import type { FlexContainerProps } from "@/types/FlexContainer.ts";
import type { RouteDataItem } from "@/util/constants/data/navigation/navigationData.tsx";
import type { NavLinkRenderProps } from "react-router";

import { useMachine } from "@xstate/react";
import { useCallback } from "react";
import { NavLink, useLocation } from "react-router";

import DarkModeToggle from "@/components/DarkModeToggle/DarkModeToggle.tsx";
import { InlineAnchorContent } from "@/components/InlineAnchor/InlineAnchor.tsx";
import FlexContainer from "@/components/layout/containers/FlexContainer/FlexContainer.tsx";
import RenderIf from "@/components/layout/RenderIf.tsx";
import NavigationBarListItem from "@/components/navigation/NavigationBar/NavigationBarListItem.tsx";
import NavigationToggle from "@/components/navigation/NavigationToggle/NavigationToggle.tsx";
import {
  NAVIGATION_EVENT,
  NAVIGATION_STATE,
  navigationMachine,
} from "@/state/navigationMachine.ts";
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

export default function NavigationBar({ links }: NavigationBarProps) {
  const [isNavigationOpen, sendNavigationUpdate] =
    useMachine(navigationMachine);
  const location = useLocation();
  const selectedLink = links.find((link) => link.href === location.pathname);

  const handleToggle = useCallback(() => {
    sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
  }, [sendNavigationUpdate]);

  const getNavLinkClass = useCallback(
    (props: NavLinkRenderProps) =>
      mergeClasses(props.isActive && "active underline decoration-4"),
    [],
  );

  return (
    <nav id="navigation-bar" className={mergeClasses(styles["navigation-bar"])}>
      <ul
        role="menu"
        className={mergeClasses(styles["navigation-list-container"])}
      >
        <RenderIf condition={isNavigationOpen.value === NAVIGATION_STATE.OPEN}>
          <FlexContainer
            flexFlow={FlexFlowCSSValue.COLUMN}
            responsive={navigationContainerResponsiveProp}
          >
            {links
              .filter((link) => !link.hidden)
              .map((link, index) => {
                return (
                  <NavigationBarListItem
                    key={link.name}
                    isLast={
                      index === links.filter((link) => !link.hidden).length - 1
                    }
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
              })}
          </FlexContainer>
        </RenderIf>
      </ul>

      <div className={mergeClasses(styles["navigation-toggle-container"])}>
        <RenderIf condition={isNavigationOpen.value === NAVIGATION_STATE.OPEN}>
          <DarkModeToggle />
        </RenderIf>
        <NavigationToggle
          active={isNavigationOpen.value === NAVIGATION_STATE.OPEN}
          onClick={handleToggle}
        />
      </div>
    </nav>
  );
}
