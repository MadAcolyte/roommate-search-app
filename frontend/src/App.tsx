import { Suspense, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { styled } from "styled-components";
import { initializeTokenRefresh, stopTokenRefresh } from "./utils/tokenRefresh";
import { isPrivateRoute, isPublicRoute } from "./routes/routesConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { isUserAuthenticated } from "./utils/authUtils";

const PageFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 20rem;

  &:after {
    content: "";
    display: block;
    width: 48px;
    height: 48px;
    border: 6px solid #1976d2;
    border-top: 6px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const RouteGuard = ({ children }: { children: JSX.Element }): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  useEffect(() => {
    const isAuthenticated = isUserAuthenticated();

    if (isAuthenticated) {
      initializeTokenRefresh();
    } else {
      stopTokenRefresh();
    }

    if (pathname === "/" && isAuthenticated) {
      navigate("/home", { replace: true });
    } else if (pathname === "/" && !isAuthenticated) {
      navigate("/login", { replace: true, state: { from: location } });
    }

    if (!isAuthenticated && isPrivateRoute(pathname)) {
      navigate("/login", { replace: true, state: { from: location } });
    } else if (
      isAuthenticated &&
      isPublicRoute(pathname) &&
      (pathname === "/login" || pathname === "/register")
    ) {
      navigate("/home", { replace: true });
    }
  }, [pathname, navigate]);

  useEffect(() => {
    return () => {
      stopTokenRefresh();
    };
  }, []);

  return <>{children}</>;
};

const App = (): JSX.Element => {
  return (
    <>
      <Suspense
        fallback={
          <PageFallback>
            <Loader />
          </PageFallback>
        }
      >
        <RouteGuard>
          <AppRoutes />
        </RouteGuard>
      </Suspense>
    </>
  );
};

export default App;
