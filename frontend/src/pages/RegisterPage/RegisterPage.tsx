import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput";
import { Container } from "../../components/Container/Container";
import Button from "../../components/CustomButtons/CustomButtons";
import { StyledForm } from "../../components/FormComponents/FormCompoents";
import { RegisterFormData } from "./types/registerTypes";
import { useMutation } from "@tanstack/react-query";
import registerUser from "./requests/registerRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterPage = (): JSX.Element => {
  const form = useForm<RegisterFormData>();
  const navigate = useNavigate();

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
              rules={{ required: "Password is required" }}
            />
            <FormInput
              name="passwordConfirm"
              label="Confirm Password"
              type="password"
              placeholder="********"
              rules={{ required: "Confirm Password is required" }}
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
          </Container>
        </StyledForm>
      </FormProvider>
    </Container>
  );
};

export default RegisterPage;
