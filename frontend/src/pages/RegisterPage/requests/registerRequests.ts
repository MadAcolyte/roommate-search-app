import { GenericResponse, POST } from "../../../utils/api";
import { RegisterFormData } from "../types/registerTypes";

const registerUser = (data: RegisterFormData) =>
  POST<GenericResponse>("auth/register", {
    password_confirm: data.passwordConfirm,
    ...data,
  });

export default registerUser;
