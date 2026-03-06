import { styled } from "styled-components";

interface ContainerProps {
  width?: string;
  height?: string;
  flexDirection?: "column" | "row";
  gap?: string;
  margin?: string;
  padding?: string;
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  maxWidth?: string;
  flexWrap?: "wrap" | "nowrap";
  backgroundColor?: string;
  minHeight?: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : "row"};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "")};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : "center"};
  gap: ${(props) => (props.gap ? props.gap : "")};
  width: ${(props) => (props.width ? props.width : "")};
  height: ${(props) => (props.height ? props.height : "")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
  flex-wrap: ${(props) => (props.flexWrap ? props.flexWrap : "nowrap")};
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "transparent"};
  min-height: ${(props) => (props.minHeight ? props.minHeight : "")};
`;
