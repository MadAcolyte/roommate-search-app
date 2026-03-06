import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import { styled } from "styled-components";

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
        <AppRoutes />
      </Suspense>
    </>
  );
};

export default App;
