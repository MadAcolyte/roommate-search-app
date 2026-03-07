const ACCESS_TOKEN_KEY = "accessToken";
const ACCESS_TOKEN_EXPIRY_KEY = "accessTokenExpiresAtUtc";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_TOKEN_EXPIRY_KEY = "refreshTokenExpiresAtUtc";

export interface AuthData {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
}

export const saveAuthData = (authData: AuthData): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
  localStorage.setItem(
    ACCESS_TOKEN_EXPIRY_KEY,
    authData.accessTokenExpiresAtUtc,
  );
  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  localStorage.setItem(
    REFRESH_TOKEN_EXPIRY_KEY,
    authData.refreshTokenExpiresAtUtc,
  );
};

export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getTokenExpiryDate = (): Date | null => {
  const expiryDateStr = localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
  if (!expiryDateStr) return null;

  return new Date(expiryDateStr);
};

export const isUserAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  const expiryDate = getTokenExpiryDate();
  if (!expiryDate) {
    return true;
  }

  const now = new Date();
  const bufferTime = 60 * 1000;
  return expiryDate.getTime() > now.getTime() + bufferTime;
};

export const clearToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRY_KEY);
};

export const getMillisecondsUntilExpiry = (): number | null => {
  const expiryDate = getTokenExpiryDate();
  if (!expiryDate) return null;

  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();

  return diff > 0 ? diff : null;
};
