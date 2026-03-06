import { GenericResponse, POST } from "../../../utils/api";
import { LoginFormData } from "../types/loginTypes";

const loginUser = (data: LoginFormData) =>
  POST<GenericResponse>("auth/login", data);

export default loginUser;
