import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput";
import { Container } from "../../components/Container/Container";
import Button from "../../components/CustomButtons/CustomButtons";
import { StyledForm } from "../../components/FormComponents/FormCompoents";
import { RegisterFormData } from "./types/registerTypes";
import { useMutation } from "@tanstack/react-query";
import registerUser from "./requests/registerRequests";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { COLORS } from "../../constants/colors";

const RegisterPage = (): JSX.Element => {
  const form = useForm<RegisterFormData>({
    mode: "onChange",
  });
  const navigate = useNavigate();
  const passwordValue = form.watch("password") || "";

  const mutation = useMutation({
    mutationFn: registerUser,
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("User registered successfully");
          navigate("/login");
        } else {
          toast.error(response.message);
        }
      },
      onError: () => {
        toast.error("Failed to register user");
      },
    });
  };

  return (
    <Container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100dvh"
    >
      <FormProvider {...form}>
        <StyledForm onSubmit={form.handleSubmit(onSubmit)}>
          <Container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="20rem"
            height="100%"
            gap="1rem"
          >
            <h1>Register</h1>
            <FormInput
              name="username"
              label="Username"
              type="text"
              placeholder="john_doe"
              rules={{ required: "Username is required" }}
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              rules={{ required: "Email is required" }}
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
                  message:
                    "Password must include 1 lowercase, 1 uppercase and 1 symbol",
                },
              }}
            />
            <FormInput
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              placeholder="********"
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              }}
            />
            <FormInput
              name="firstName"
              label="First Name"
              type="text"
              placeholder="John"
              rules={{ required: "First Name is required" }}
            />
            <FormInput
              name="lastName"
              label="Last Name"
              type="text"
              placeholder="Doe"
              rules={{ required: "Last Name is required" }}
            />
            <FormInput
              name="city"
              label="City"
              type="text"
              placeholder="New York"
              rules={{ required: "City is required" }}
            />
            <Button type="submit" color="primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Registering..." : "Register"}
            </Button>
            <div style={{ color: COLORS.PRIMARY, fontSize: "0.95rem" }}>
              Already have an account? <Link to="/login">Login here</Link>
            </div>
          </Container>
        </StyledForm>
      </FormProvider>
    </Container>
  );
};

export default RegisterPage;
