import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export const ActionBar = styled.div`
  border-top: 1px solid ${COLORS.TERTIARY_LIGHT};
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  flex-shrink: 0;
  background: white;
`;

export const ActionCounter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
`;

export const CounterMain = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${COLORS.PRIMARY};
`;

export const CounterSub = styled.span`
  font-size: 0.7rem;
  color: #aaa;
`;

export const CircleButton = styled.button<{ $variant: "reject" | "accept" }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid
    ${(props) =>
      props.$variant === "accept" ? COLORS.PRIMARY : COLORS.SECONDARY};
  background: ${(props) =>
    props.$variant === "accept" ? COLORS.PRIMARY : "white"};
  color: ${(props) =>
    props.$variant === "accept" ? "white" : COLORS.SECONDARY};
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  padding: 0;

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
