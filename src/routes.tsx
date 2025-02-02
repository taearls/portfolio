import { Route, Routes } from "react-router";

import routes from "./util/constants/data/navigation/navigationData.tsx";

export default (
  <Routes>
    {routes.map((route) => (
      <Route key={route.name} path={route.href} element={route.component}>
        {route.childLinks?.map((childLink) => (
          <Route
            key={childLink.href}
            path={`${childLink.href}`}
            element={childLink.component}
          />
        ))}
      </Route>
    ))}
  </Routes>
);
