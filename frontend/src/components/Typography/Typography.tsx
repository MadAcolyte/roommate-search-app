import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

export const SectionLabel = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #bbb;
`;

export const PriceText = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 2.25rem;
  font-weight: 800;
  color: ${COLORS.PRIMARY};
  line-height: 1;
`;

export const AddressText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #777;
`;

export const DescriptionText = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #555;
`;
