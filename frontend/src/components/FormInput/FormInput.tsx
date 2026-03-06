import { useFormContext, RegisterOptions } from "react-hook-form";
import { styled } from "styled-components";
import { COLORS } from "../../constants/colors";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  labelColor?: string;
  width?: string;
}

interface StyledInputContainerProps {
  width?: string;
}

const StyledInputContainer = styled.div<StyledInputContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${(props) => props.width || "100%"};
`;

const StyledInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const inputStyles = `
  border-radius: 0.5rem;
  border: 2px solid #808080;
  background: #fff;
  display: flex;
  padding: 0.5rem 0.5rem;
  width: 100%;
  font-size: 1rem;
  color: ${COLORS.PRIMARY};
  outline: none;
  box-shadow: none;
  box-sizing: border-box;
  line-height: 1.5;
  font-family: inherit;

  &::placeholder {
    color: #808080;
  }

  &:hover {
    border-color: ${COLORS.PRIMARY};
  }

  &:focus {
    border-color: ${COLORS.PRIMARY};
  }
`;

const StyledInput = styled.input`
  ${inputStyles}
  min-height: 1rem;
`;

const StyledTextarea = styled.textarea`
  ${inputStyles}
  min-height: 7.5rem;
  max-height: 14rem;
  resize: vertical;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledLabel = styled.label<{ labelColor?: string }>`
  color: ${(props) => props.labelColor || COLORS.PRIMARY};
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const FormInput = (props: FormInputProps) => {
  const {
    name,
    label,
    type = "text",
    placeholder,
    rules,
    labelColor,
    width,
  } = props;

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];

  const isTextarea = type === "textarea";

  return (
    <StyledInputContainer width={width}>
      {label && (
        <StyledLabel htmlFor={name} labelColor={labelColor}>
          {label}
        </StyledLabel>
      )}
      {isTextarea ? (
        <StyledTextarea
          id={name}
          placeholder={placeholder}
          {...register(name, rules)}
        />
      ) : (
        <StyledInputWrapper>
          <StyledInput
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, rules)}
          />
        </StyledInputWrapper>
      )}
      {fieldError && (
        <div style={{ color: COLORS.ERROR }}>
          {fieldError.message as string}
        </div>
      )}
    </StyledInputContainer>
  );
};

export default FormInput;
