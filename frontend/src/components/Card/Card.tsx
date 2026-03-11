import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export const AnimatedCard = styled.div<{
  $swipeDirection: "left" | "right" | null;
  $isAnimating: boolean;
}>`
  padding: 2rem;
  width: 50%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: ${(props) =>
    props.$isAnimating
      ? "transform 0.4s ease-out, opacity 0.4s ease-out"
      : "none"};
  transform: ${(props) => {
    if (props.$swipeDirection === "left")
      return "translateX(-115%) rotate(-5deg)";
    if (props.$swipeDirection === "right")
      return "translateX(115%) rotate(5deg)";
    return "translateX(0) rotate(0)";
  }};
  opacity: ${(props) => (props.$swipeDirection ? 0 : 1)};
`;

export const ImageSection = styled.div`
  width: 100%;
  height: 40%;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  background: ${COLORS.TERTIARY_LIGHT};
`;

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const ImageNav = styled.button<{ $side: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$side === "left" ? "left: 0.75rem;" : "right: 0.75rem;")}
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: ${COLORS.PRIMARY};
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding: 0;
  transition: background 0.15s;

  &:hover {
    background: white;
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
`;

export const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
