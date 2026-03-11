import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
}

const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.775rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  white-space: nowrap;
  background: ${(props) => {
    switch (props.variant) {
      case "primary":
        return COLORS.PRIMARY;
      case "secondary":
        return COLORS.SECONDARY;
      case "success":
        return "#e8f5e9";
      case "warning":
        return "#fff3e0";
      case "neutral":
        return COLORS.TERTIARY_LIGHT;
      default:
        return COLORS.TERTIARY_LIGHT;
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case "primary":
        return "white";
      case "secondary":
        return "white";
      case "success":
        return "#2e7d32";
      case "warning":
        return "#e65100";
      case "neutral":
        return COLORS.PRIMARY;
      default:
        return COLORS.PRIMARY;
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.variant) {
        case "primary":
          return COLORS.PRIMARY;
        case "secondary":
          return COLORS.SECONDARY;
        case "success":
          return "#c8e6c9";
        case "warning":
          return "#ffcc80";
        case "neutral":
          return COLORS.TERTIARY;
        default:
          return COLORS.TERTIARY;
      }
    }};
`;

export default Badge;

export const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
