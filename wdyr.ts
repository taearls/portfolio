import whyDidYouRender from "@welldone-software/why-did-you-render";
import React from "react";

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    exclude: [/^BrowserRouter/, /^Link/, /^Route/],
    include: [/.*/],
    trackAllPureComponents: true,
    trackHooks: true,
  });
}
