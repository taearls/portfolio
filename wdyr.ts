import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";

if (import.meta.env.MODE === "development") {
  whyDidYouRender(React, {
    exclude: [/^BrowserRouter/, /^Link/, /^Route/],
    include: [/.*/],
    trackAllPureComponents: true,
    trackHooks: true,
  });
}
