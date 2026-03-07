import { GenericResponseWithPayload, POST } from "../../../utils/api";
import {
  AuthData,
  getRefreshToken,
  saveAuthData,
} from "../../../utils/authUtils";
import { LoginFormData } from "../types/loginTypes";

export const loginUser = (data: LoginFormData) =>
  POST<GenericResponseWithPayload<AuthData>>("auth/login", data).then(
    (response) => {
      if (response.success && response.data) {
        saveAuthData(response.data);
      }
      return response;
    },
  );

export const refreshToken = () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return {
      success: false,
      data: null,
      message: "No refresh token found",
    };
  }
  return POST<GenericResponseWithPayload<AuthData>>(
    "auth/refresh_access_token",
    {
      refreshToken,
    },
  ).then((response) => {
    if (response.success && response.data) {
      saveAuthData(response.data);
    }
    return response;
  });
};
