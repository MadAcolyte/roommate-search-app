const TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "tokenExpiresAtUtc";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_TOKEN_EXPIRY_KEY = "refreshTokenExpiresAtUtc";

export interface AuthData {
  token: string;
  tokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
}

export const saveAuthData = (authData: AuthData): void => {
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, authData.tokenExpiresAtUtc);
  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  localStorage.setItem(
    REFRESH_TOKEN_EXPIRY_KEY,
    authData.refreshTokenExpiresAtUtc,
  );
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getTokenExpiryDate = (): Date | null => {
  const expiryDateStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
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
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
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
