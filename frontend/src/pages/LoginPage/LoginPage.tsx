import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput";
import { Container } from "../../components/Container/Container";
import Button from "../../components/CustomButtons/CustomButtons";
import { StyledForm } from "../../components/FormComponents/FormCompoents";
import { LoginFormData } from "./types/loginTypes";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "./loginRequests/loginRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginPage = (): JSX.Element => {
  const form = useForm<LoginFormData>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          toast.success("Logged in successfully");
          navigate("/home");
        } else {
          toast.error(response.message);
        }
      },
      onError: () => {
        toast.error("Failed to login");
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
            <h1>Login</h1>
            <FormInput
              name="username"
              label="Username"
              type="text"
              placeholder="john_doe"
              rules={{ required: "Username is required" }}
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="********"
              rules={{ required: "Password is required" }}
            />
            <Button type="submit" color="primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Container>
        </StyledForm>
      </FormProvider>
    </Container>
  );
};

export default LoginPage;
