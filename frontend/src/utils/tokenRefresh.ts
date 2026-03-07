import { refreshToken } from "../pages/LoginPage/loginRequests/loginRequests";
import {
  saveAuthData,
  getMillisecondsUntilExpiry,
  isUserAuthenticated,
  clearToken,
} from "./authUtils";
import { toast } from "react-toastify";

let refreshIntervalId: ReturnType<typeof setTimeout> | null = null;

export const startTokenRefresh = (): void => {
  stopTokenRefresh();

  const scheduleRefresh = () => {
    const msUntilExpiry = getMillisecondsUntilExpiry() ?? 0;

    if (!msUntilExpiry) {
      toast.error("Token has expired");
      return;
    }

    const refreshBeforeMs = 5 * 60 * 1000;
    const refreshInMs = Math.max(msUntilExpiry - refreshBeforeMs, 1000);

    refreshIntervalId = setTimeout(async () => {
      const response = await refreshToken();

      if (response?.success && response.data) {
        const refreshedData = response.data;
        saveAuthData(refreshedData);
        scheduleRefresh();
      } else {
        clearToken();
        stopTokenRefresh();
      }
    }, refreshInMs);
  };

  scheduleRefresh();
};

export const stopTokenRefresh = (): void => {
  if (refreshIntervalId !== null) {
    clearTimeout(refreshIntervalId);
    refreshIntervalId = null;
  }
};

export const initializeTokenRefresh = (): void => {
  if (isUserAuthenticated()) {
    startTokenRefresh();
  } else {
    stopTokenRefresh();
  }
};
