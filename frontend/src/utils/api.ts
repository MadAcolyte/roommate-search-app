import axios, { AxiosResponse, AxiosError } from "axios";
import { getToken } from "../utils/authUtils";

const API_BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      const authHeader = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      (config.headers as any) = {
        ...(config.headers ?? {}),
        Authorization: authHeader,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface GenericResponseWithPayload<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  error?: string;
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

type RequestData = Record<string, any> | null | undefined;

type UpstreamErrorBody =
  | string
  | {
      message?: string;
      detail?: string;
      title?: string;
      errors?: Record<string, string[]>;
      [key: string]: unknown;
    };

const getUpstreamUserMessage = (
  data: UpstreamErrorBody | undefined,
): string | null => {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (typeof data === "object" && data) {
    if (typeof data.detail === "string" && data.detail.trim())
      return data.detail;
    if (typeof data.message === "string" && data.message.trim())
      return data.message;
    if (typeof data.title === "string" && data.title.trim()) return data.title;
    if (data.errors && typeof data.errors === "object") {
      const firstKey = Object.keys(data.errors)[0];
      const firstArr = firstKey ? data.errors[firstKey] : undefined;
      const firstMsg = Array.isArray(firstArr) ? firstArr[0] : undefined;
      if (typeof firstMsg === "string" && firstMsg.trim()) return firstMsg;
    }
  }
  return null;
};

const isObjectRecord = (v: unknown): v is Record<string, any> =>
  typeof v === "object" && v !== null;

const isGenericResponseLike = (
  v: unknown,
): v is { success: boolean; message: string; data?: unknown } => {
  return (
    isObjectRecord(v) &&
    typeof v.success === "boolean" &&
    typeof v.message === "string"
  );
};

export const GET = async <T = any>(
  uri: string,
  data?: RequestData,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(uri, {
      params: data,
    });
    if (isGenericResponseLike(response.data)) return response.data;
    return {
      success: true,
      data: response.data,
      message: "Request processed successfully",
    } as any as T;
  } catch (error) {
    return handleError<T>(error);
  }
};

export const POST = async <T = any>(
  uri: string,
  data?: RequestData,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(uri, data);
    if (isGenericResponseLike(response.data)) return response.data;
    return {
      success: true,
      data: response.data,
      message: "Request processed successfully",
    } as any as T;
  } catch (error) {
    return handleError<T>(error);
  }
};

export const PUT = async <T = any>(
  uri: string,
  data?: RequestData,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(uri, data);
    if (isGenericResponseLike(response.data)) return response.data;
    return {
      success: true,
      data: response.data,
      message: "Request processed successfully",
    } as any as T;
  } catch (error) {
    return handleError<T>(error);
  }
};

export const DELETE = async <T = any>(
  uri: string,
  data?: RequestData,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(uri, {
      params: data,
    });
    if (isGenericResponseLike(response.data)) return response.data;
    return {
      success: true,
      data: response.data,
      message: "Request processed successfully",
    } as any as T;
  } catch (error) {
    return handleError<T>(error);
  }
};

const handleError = <T = any>(error: unknown): T => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<T>;

    if (axiosError.response) {
      const respData = axiosError.response.data;
      if (isGenericResponseLike(respData)) return respData as any as T;

      const technicalError = axiosError.message || "Request failed";
      const userMessage = getUpstreamUserMessage(
        respData as any as UpstreamErrorBody,
      );

      return {
        success: false,
        data: null,
        message: userMessage ?? technicalError,
        error: technicalError,
      } as any as T;
    } else if (axiosError.request) {
      return {
        success: false,
        data: null,
        message: "No response from server. Please check your connection.",
        error: "No response from server. Please check your connection.",
      } as any as T;
    }
  }

  return {
    success: false,
    data: null,
    message:
      error instanceof Error ? error.message : "An unexpected error occurred",
    error:
      error instanceof Error ? error.message : "An unexpected error occurred",
  } as any as T;
};

export { apiClient };
