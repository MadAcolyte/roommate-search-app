import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;

  @media (max-width: 380px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const InfoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.75rem 0.6rem;
  background: ${COLORS.TERTIARY_LIGHT};
  border-radius: 0.75rem;
`;

export const InfoLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #aaa;
`;

export const InfoValue = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY};
`;
