import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { ModalContainer } from "reoverlay";
import { GlobalStyles } from "./styles/GlobalStyles";
import { store } from "./store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <GlobalStyles />
          <App />
          <ModalContainer />
          <ToastContainer position="top-right" theme="light" />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
