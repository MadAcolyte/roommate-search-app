import { GenericResponseWithPayload, GET, POST } from "../../../utils/api";
import {
  AuthData,
  getRefreshToken,
  saveAuthData,
} from "../../../utils/authUtils";
import { LoginFormData, UserProfile } from "../types/loginTypes";

export type LoginResult = GenericResponseWithPayload<UserProfile>;

export const loginUser = (data: LoginFormData): Promise<LoginResult> =>
  POST<GenericResponseWithPayload<AuthData>>("auth/login", data).then(
    async (response) => {
      if (response.success && response.data) {
        saveAuthData(response.data);
      }
      const profileResponse =
        await GET<GenericResponseWithPayload<UserProfile>>("user/get_user");
      return profileResponse as LoginResult;
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
