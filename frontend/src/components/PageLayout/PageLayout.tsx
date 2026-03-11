import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export const PageWrapper = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  overflow: hidden;
`;

export const CenteredState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  text-align: center;
  color: ${COLORS.PRIMARY};
`;

export const StateButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 280px;
  margin-top: 0.5rem;
`;
