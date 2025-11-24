import { lazy, type ComponentType } from "react";

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
    ariaLabel: "Visit Home Page",
    Component: HomePage,
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
    ariaLabel: "Visit Contact Page",
    Component: ContactPage,
    href: "/contact",
    name: "Contact",
  },
  {
    ariaLabel: "Navigate To 404 Page",
    Component: NotFoundPage,
    hidden: true,
    href: "*",
    name: "404",
  },
];

export default routes;
