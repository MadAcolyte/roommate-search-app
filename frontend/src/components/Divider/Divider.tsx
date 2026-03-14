import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

interface DividerProps {
  margin?: string;
}

const Divider = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background: ${COLORS.TERTIARY_LIGHT};
  flex-shrink: 0;
  margin: ${(props) => props.margin ?? "0"};
`;

export default Divider;
