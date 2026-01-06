import type { ComponentType } from "react";

import { lazy } from "react";

// Eagerly load all pages for instant navigation
import CodePage from "@/pages/CodePage.tsx";
import ContactPage from "@/pages/ContactPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import ResumePage from "@/pages/ResumePage.tsx";

// Dev-only: AdminFlagsPage is lazy-loaded only in development
// In production, import.meta.env.DEV is false, so this entire branch is tree-shaken
const AdminFlagsPage: ComponentType | null = import.meta.env.DEV
  ? lazy(() => import("@/pages/AdminFlagsPage/index.ts"))
  : null;

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
    Component: CodePage,
    ariaLabel: "Visit Code Page",
    href: "/code",
    name: "Code",
  },
  {
    Component: ResumePage,
    ariaLabel: "Visit Resume Page",
    href: "/resume",
    name: "Resume",
  },
  {
    Component: ContactPage,
    ariaLabel: "Visit Contact Page",
    href: "/contact",
    name: "Contact",
  },
  // Admin page only available in development - completely excluded from production builds
  ...(import.meta.env.DEV && AdminFlagsPage
    ? [
        {
          Component: AdminFlagsPage,
          ariaLabel: "Visit Admin Feature Flags Page",
          hidden: true,
          href: "/admin/flags",
          name: "Feature Flags",
        },
      ]
    : []),
  {
    Component: NotFoundPage,
    ariaLabel: "Navigate To 404 Page",
    hidden: true,
    href: "*",
    name: "404",
  },
];

export default routes;
