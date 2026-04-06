import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    height: 100%;
  }

  button {
    cursor: pointer;
    font-size: 1rem;
    font-family: montserrat, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }

  body {
    margin: 0;
    height: 100%;
    font-family: montserrat, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    height: 100%;
    min-height: 100dvh;
  }
`;
