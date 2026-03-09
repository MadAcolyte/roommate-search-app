import { Reoverlay } from "reoverlay";
import { keyframes, styled } from "styled-components";
import { Container } from "../../components/Container/Container";

const MODAL_SIZE = {
  sm: 20,
  md: 30,
  lg: 40,
  xl: 50,
};

const getModalSize = (
  size: "sm" | "md" | "lg" | "xl",
  isWidth: boolean,
): string => {
  return MODAL_SIZE[size] + (isWidth ? 10 : 0) + "rem";
};

const slideDownFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BlurredOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100svh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1400;
`;

const GenericModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 100svh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1500;
  padding: 1rem;

  animation: ${slideDownFadeIn} 0.3s ease forwards;
`;

interface GenericModalProps {
  children: JSX.Element;
  size: "sm" | "md" | "lg" | "xl";
}

const GenericModal = (props: GenericModalProps): JSX.Element => {
  const { children, size } = props;

  return (
    <BlurredOverlay>
      <GenericModalWrapper>
        <Container
          width={getModalSize(size, true)}
          height={getModalSize(size, false)}
          padding="1rem"
          borderRadius="1rem"
          backgroundColor="white"
          flexDirection="column"
          justifyContent="flex-start"
        >
          <Container width="100%" justifyContent="flex-end">
            <button onClick={() => Reoverlay.hideModal()}>Close</button>
          </Container>
          {children}
        </Container>
      </GenericModalWrapper>
    </BlurredOverlay>
  );
};

export default GenericModal;
