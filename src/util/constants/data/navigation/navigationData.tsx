import { JSX } from "react";

import ContactPage from "@/pages/ContactPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import WebProjects from "@/pages/WebProjectsPage";

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
      // {
      //   component: <MusicDetailsPage />,
      //   href: ":releaseId",
      // },
    ],
    // component: <MusicPageOutlet />,
    href: "/code",
    name: "Code",
  },
  {
    ariaLabel: "Visit Contact Page",
    component: <ContactPage />,
    href: "/contact",
    name: "Contact",
  },
  // {
  //   href: "/shows",
  //   name: "Shows",
  //   childLinks: [],
  // },
  // {
  //   ariaLabel: "Visit Press Page",
  //   component: <PressPage />,
  //   href: "/press",
  //   name: "Press",
  // },
  // {
  //   ariaLabel: "Visit Booking Page",
  //   component: <BookingPage />,
  //   href: "/booking",
  //   name: "Booking",
  // },
  // {
  //   ariaLabel: "Listen to Tyler's music on Bandcamp",
  //   href: "https://cuckooandthebirds.bandcamp.com",
  //   isExternal: true,
  //   name: "Bandcamp",
  // },
  {
    ariaLabel: "Navigate To 404 Page",
    component: <NotFoundPage />,
    hidden: true,
    href: "*",
    name: "404",
  },
];

export default routes;
