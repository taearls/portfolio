import { useMachine } from "@xstate/react";
import { NavLink } from "react-router";

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
import { RouteDataItem } from "@/util/constants/data/navigation/navigationData.tsx";
import { mergeClasses } from "@/util/styling/styling.utils.ts";
import styles from "./NavigationBar.module.css";

export type NavigationBarProps = {
  links: Array<RouteDataItem>;
};

export default function NavigationBar({ links }: NavigationBarProps) {
  const [current, send] = useMachine(navigationMachine);

  const handleToggle = () => {
    send({ type: NAVIGATION_EVENT.TOGGLE });
  };

  return (
    <nav id="navigation-bar" className={mergeClasses(styles["navigation-bar"])}>
      <ul
        role="menu"
        className={mergeClasses(styles["navigation-list-container"])}
      >
        <RenderIf condition={current.value === NAVIGATION_STATE.OPEN}>
          <FlexContainer
            flexFlow={FlexFlowCSSValue.COLUMN}
            responsive={{
              flexFlow: {
                prefix: MediaQueryPrefixValue.SM,
                value: FlexFlowCSSValue.ROW,
              },
              gapX: { prefix: MediaQueryPrefixValue.SM, value: 4 },
            }}
          >
            {links
              .filter((link) => !link.hidden)
              .map((link, index) => {
                return (
                  <NavigationBarListItem
                    key={index}
                    isLast={
                      index === links.filter((link) => !link.hidden).length - 1
                    }
                  >
                    <NavLink
                      to={link.href}
                      aria-label={link.ariaLabel}
                      className={({ isActive }) =>
                        mergeClasses(isActive && "active")
                      }
                    >
                      <InlineAnchorContent
                        isExternal={Boolean(link.isExternal)}
                        bold
                        underline={false}
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
        <RenderIf condition={current.value === NAVIGATION_STATE.OPEN}>
          <DarkModeToggle />
        </RenderIf>
        <NavigationToggle
          active={current.value === NAVIGATION_STATE.OPEN}
          onClick={handleToggle}
        />
      </div>
    </nav>
  );
}
