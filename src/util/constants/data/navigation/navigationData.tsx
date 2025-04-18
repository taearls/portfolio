import type { JSX } from "react";

import ContactPage from "@/pages/ContactPage.tsx";
import HomePage from "@/pages/HomePage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import WebProjects from "@/pages/WebProjectsPage.tsx";

export type RouteDataChildItem = {
  href: string;
  component: JSX.Element;
  index?: boolean;
};

export type RouteDataItem = {
  href: string;
  name: string;
  ariaLabel: string;
  isExternal?: boolean;
  component?: JSX.Element;
  hidden?: boolean;
  childLinks?: Array<RouteDataChildItem>;
};

const routes: Array<RouteDataItem> = [
  {
    ariaLabel: "Visit Home Page",
    component: <HomePage />,
    href: "/",
    name: "Home",
  },
  {
    ariaLabel: "Visit Web Projects Page",
    childLinks: [
      {
        component: <WebProjects />,
        href: "",
        index: true,
      },
    ],
    href: "/code",
    name: "Code",
  },
  {
    ariaLabel: "Visit Contact Page",
    component: <ContactPage />,
    href: "/contact",
    name: "Contact",
  },
  {
    ariaLabel: "Navigate To 404 Page",
    component: <NotFoundPage />,
    hidden: true,
    href: "*",
    name: "404",
  },
];

export default routes;
