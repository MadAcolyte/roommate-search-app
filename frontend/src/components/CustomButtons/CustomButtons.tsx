import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

interface GenericButtonProps {
  width?: string;
}
const PrimaryButton = styled.button<GenericButtonProps>`
  background-color: ${COLORS.PRIMARY};
  color: ${COLORS.TERTIARY};
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  width: ${(props) => props.width || "100%"};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${COLORS.PRIMARY_LIGHT};
    transform: scale(1.02);
  }
`;

const SecondaryButton = styled.button<GenericButtonProps>`
  background-color: ${COLORS.TERTIARY};
  color: ${COLORS.PRIMARY};
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${COLORS.PRIMARY};
  cursor: pointer;
  width: ${(props) => props.width || "100%"};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${COLORS.TERTIARY_LIGHT};
    transform: scale(1.02);
  }
`;

interface ButtonProps {
  type: "button" | "submit";
  color: "primary" | "secondary";
  children: JSX.Element | string;
  onClick?: () => void;
  width?: string;
  disabled?: boolean;
}

const Button = (props: ButtonProps): JSX.Element => {
  const { color, children, onClick, width, ...restProps } = props;
  switch (color) {
    case "primary":
      return (
        <PrimaryButton {...restProps} onClick={onClick} width={width}>
          {children}
        </PrimaryButton>
      );
    case "secondary":
      return (
        <SecondaryButton {...restProps} onClick={onClick} width={width}>
          {children}
        </SecondaryButton>
      );
    default:
      return (
        <PrimaryButton {...restProps} onClick={onClick} width={width}>
          {children}
        </PrimaryButton>
      );
  }
};

export default Button;
