import type { ComponentType } from "react";

import { lazy } from "react";

// Lazy load page components for code splitting
const HomePage = lazy(() => import("@/pages/HomePage.tsx"));
const ContactPage = lazy(() => import("@/pages/ContactPage.tsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.tsx"));
const WebProjectsPage = lazy(() => import("@/pages/WebProjectsPage.tsx"));

export type RouteDataChildItem = {
  href: string;
  Component: ComponentType;
  index?: boolean;
};

export type RouteDataItem = {
  href: string;
  name: string;
  ariaLabel: string;
  isExternal?: boolean;
  Component?: ComponentType;
  hidden?: boolean;
  childLinks?: Array<RouteDataChildItem>;
};

const routes: Array<RouteDataItem> = [
  {
    Component: HomePage,
    ariaLabel: "Visit Home Page",
    href: "/",
    name: "Home",
  },
  {
    ariaLabel: "Visit Web Projects Page",
    childLinks: [
      {
        Component: WebProjectsPage,
        href: "",
        index: true,
      },
    ],
    href: "/code",
    name: "Code",
  },
  {
    Component: ContactPage,
    ariaLabel: "Visit Contact Page",
    href: "/contact",
    name: "Contact",
  },
  {
    Component: NotFoundPage,
    ariaLabel: "Navigate To 404 Page",
    hidden: true,
    href: "*",
    name: "404",
  },
];

export default routes;
