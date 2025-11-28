import { Suspense } from "react";
import { Route, Routes } from "react-router";

import routes from "./constants/navigationData.tsx";
import Loading from "./pages/loading.tsx";

export default (
  <Suspense fallback={<Loading />}>
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.name}
          path={route.href}
          element={route.Component ? <route.Component /> : undefined}
        >
          {route.childLinks?.map((childLink) => (
            <Route
              key={childLink.href}
              path={`${childLink.href}`}
              element={<childLink.Component />}
            />
          ))}
        </Route>
      ))}
    </Routes>
  </Suspense>
);
