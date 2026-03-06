import { ComponentType, lazy } from "react";

const LoginPage = lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage/RegisterPage"));

export interface Routes {
  path: string;
  page: ComponentType;
  isPrivate: boolean;
}

export const routes: Routes[] = [
  {
    path: "/login",
    page: LoginPage,
    isPrivate: false,
  },
  {
    path: "/register",
    page: RegisterPage,
    isPrivate: false,
  },
];

export const isPublicRoute = (path: string): boolean => {
  const sortedRoutes = [...routes].sort((a, b) => {
    if (a.path === path && b.path !== path) return -1;
    if (b.path === path && a.path !== path) return 1;
    return b.path.length - a.path.length;
  });

  const route = sortedRoutes.find((r) => {
    if (r.path === path) return true;

    if (r.path.includes(":")) {
      const basePath = r.path.split(":")[0];
      return path.startsWith(basePath || "");
    }

    return path.startsWith(r.path + "/");
  });
  return route ? !route.isPrivate : false;
};

export const isPrivateRoute = (path: string): boolean => {
  const sortedRoutes = [...routes].sort((a, b) => {
    if (a.path === path && b.path !== path) return -1;
    if (b.path === path && a.path !== path) return 1;
    return b.path.length - a.path.length;
  });

  const route = sortedRoutes.find((r) => {
    if (r.path === path) return true;

    if (r.path.includes(":")) {
      const basePath = r.path.split(":")[0];
      return path.startsWith(basePath || "");
    }

    return path.startsWith(r.path + "/");
  });
  return route ? route.isPrivate : false;
};
