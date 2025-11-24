import { Suspense } from "react";
import { Route, Routes } from "react-router";

import Loading from "./pages/loading.tsx";
import routes from "./util/constants/data/navigation/navigationData.tsx";

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
