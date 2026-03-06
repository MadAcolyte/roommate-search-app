import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  html {
    font-size: 16px;
  }

  button {
    cursor: pointer;
    font-size: 1rem;
    font-family: montserrat, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  }

  body {
    margin: 0;
    font-family: montserrat, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }
`;
