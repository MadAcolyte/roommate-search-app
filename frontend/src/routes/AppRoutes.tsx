import { Route, Routes } from "react-router-dom";
import { routes } from "./routesConfig";

const AppRoutes = () => (
  <Routes>
    {routes.map((route) => {
      const PageComponent = route.page;

      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.isPrivate ? <PageComponent /> : <PageComponent />}
        />
      );
    })}
  </Routes>
);

export default AppRoutes;
