import type { RouteDataItem } from "@/constants/navigationData.tsx";
import type { FlexContainerProps } from "@/types/FlexContainer.ts";
import type { NavLinkRenderProps } from "react-router";

import { useMachine } from "@xstate/react";
import FocusTrap from "focus-trap-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
// Breakpoint for mobile navigation (matches CSS container query)
const MOBILE_NAV_BREAKPOINT = 700;

export default function NavigationBar({ links }: NavigationBarProps) {
  const [isNavigationOpen, sendNavigationUpdate] =
    useMachine(navigationMachine);
  const location = useLocation();
  const selectedLink = links.find((link) => link.href === location.pathname);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Track if we're on a narrow viewport where focus trap should be active
  const [isNarrowViewport, setIsNarrowViewport] = useState(
    typeof window !== "undefined" && window.innerWidth < MOBILE_NAV_BREAKPOINT,
  );

  // Update viewport state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsNarrowViewport(window.innerWidth < MOBILE_NAV_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Focus trap should only be active on narrow viewports when nav is open
  const isFocusTrapActive =
    isNarrowViewport && isNavigationOpen.value === NAVIGATION_STATE.OPEN;

  // Move focus to first navigation link when mobile nav opens (accessibility)
  // This makes it immediately clear to keyboard/screen reader users that nav is open
  // Only applies on narrow viewports - desktop nav is always visible
  useEffect(() => {
    if (
      isNarrowViewport &&
      isNavigationOpen.value === NAVIGATION_STATE.OPEN &&
      firstLinkRef.current
    ) {
      // Small delay to ensure DOM is ready and focus trap is active
      requestAnimationFrame(() => {
        firstLinkRef.current?.focus();
      });
    }
  }, [isNarrowViewport, isNavigationOpen.value]);

  // Close navigation when pressing Escape key (keyboard accessibility)
  // On narrow viewports, this closes the dropdown and returns focus to toggle
  // On wide viewports, CSS container query keeps links visible regardless of state
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        isNavigationOpen.value === NAVIGATION_STATE.OPEN
      ) {
        sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
        // Return focus to toggle button for keyboard accessibility
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isNavigationOpen.value, sendNavigationUpdate]);

  // Close navigation when clicking outside (mobile UX improvement)
  // On narrow viewports, this closes the dropdown when user clicks elsewhere
  // On wide viewports, CSS container query keeps links visible regardless of state
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isNavigationOpen.value === NAVIGATION_STATE.OPEN
      ) {
        sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isNavigationOpen.value, sendNavigationUpdate]);

  const handleToggle = () => {
    sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
  };

  // Close navigation on link click (mobile UX improvement)
  // On narrow viewports, this closes the dropdown after navigation
  // On wide viewports, CSS container query keeps links visible regardless of state
  const handleLinkClick = () => {
    if (isNavigationOpen.value === NAVIGATION_STATE.OPEN) {
      sendNavigationUpdate({ type: NAVIGATION_EVENT.TOGGLE });
    }
  };

  // NOTE: useCallback kept for NavLink className prop stability
  const getNavLinkClass = useCallback(
    (props: NavLinkRenderProps) =>
      mergeClasses(props.isActive && "active underline decoration-4"),
    [],
  );

  const visibleLinks = links.filter((link) => !link.hidden);
  const navigationLinks = visibleLinks.map((link, index) => {
    const isFirstLink = index === 0;
    return (
      <NavigationBarListItem
        key={link.name}
        isLast={index === visibleLinks.length - 1}
      >
        <NavLink
          ref={isFirstLink ? firstLinkRef : undefined}
          to={link.href}
          aria-label={link.ariaLabel}
          className={getNavLinkClass}
          onClick={handleLinkClick}
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

  // Determine if backdrop should be visible (open nav on narrow viewport)
  const isBackdropVisible =
    isNarrowViewport && isNavigationOpen.value === NAVIGATION_STATE.OPEN;

  return (
    <FocusTrap
      active={isFocusTrapActive}
      focusTrapOptions={{
        // Allow clicking outside to close (handled by handleClickOutside)
        clickOutsideDeactivates: true,
        // Allow Escape key to close (handled by handleEscape)
        escapeDeactivates: false,
        // Return focus to toggle button when trap deactivates
        onDeactivate: () => toggleRef.current?.focus(),
        // Prevent focus-trap from throwing if no focusable elements found
        fallbackFocus: () => toggleRef.current ?? document.body,
      }}
    >
      <div>
        {/*
          Semi-transparent backdrop behind mobile nav dropdown.
          - Visible only on narrow viewports when nav is open
          - Clicking backdrop closes navigation (via handleClickOutside)
          - Hidden on wide viewports via CSS container query
        */}
        <div
          className={mergeClasses(
            styles["navigation-backdrop"],
            !isBackdropVisible && styles["backdrop-hidden"],
          )}
          aria-hidden="true"
        />
        <nav
          ref={navRef}
          id="navigation-bar"
          className={mergeClasses(
            styles["navigation-bar"],
            isNavigationOpen.value === NAVIGATION_STATE.CLOSED &&
              styles["nav-closed"],
          )}
        >
          {/*
          CSS Container Query Behavior (see NavigationBar.module.css):
          - Narrow containers (<700px): .closed hides the list, links shown in dropdown overlay
          - Wide containers (>=700px): .closed has no effect, links always visible horizontally
        */}
          <ul
            className={mergeClasses(
              styles["navigation-list-container"],
              isNavigationOpen.value === NAVIGATION_STATE.CLOSED &&
                styles.closed,
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
            <DarkModeToggle visible={true} />
            {/*
            CSS Container Query Behavior (see NavigationBar.module.css):
            - Narrow containers (<700px): hamburger visible for toggle
            - Wide containers (>=700px): hamburger hidden, links always visible
          */}
            <div className={mergeClasses(styles["hamburger-wrapper"])}>
              <NavigationToggle
                ref={toggleRef}
                active={isNavigationOpen.value === NAVIGATION_STATE.OPEN}
                onClick={handleToggle}
              />
            </div>
          </div>
        </nav>
      </div>
    </FocusTrap>
  );
}
