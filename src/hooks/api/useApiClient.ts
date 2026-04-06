"use client";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useMemo } from "react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

type StoredUser = {
  accessToken?: string;
  refreshToken?: string;
  expires?: string;
};

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export function useApiClient(): AxiosInstance {
  const client = useMemo(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const refreshState: { promise: Promise<string | null> | null } = {
      promise: null,
    };

    const getStoredUser = (): StoredUser | null => {
      const rawUser = localStorage.getItem("iisUser");
      if (!rawUser) return null;

      try {
        return JSON.parse(rawUser) as StoredUser;
      } catch {
        localStorage.removeItem("iisUser");
        return null;
      }
    };

    const saveStoredUser = (user: StoredUser) => {
      localStorage.setItem("iisUser", JSON.stringify(user));
    };

    const refreshAccessToken = async (): Promise<string | null> => {
      const user = getStoredUser();
      if (!user?.refreshToken) return null;

      const { data } = await instance.post<{
        accessToken?: string;
        refreshToken?: string;
        expires?: string;
      }>("/api/auth/refresh", {
        refreshToken: user.refreshToken,
      });

      const nextAccessToken = data.accessToken;
      if (!nextAccessToken) return null;

      saveStoredUser({
        ...user,
        accessToken: nextAccessToken,
        refreshToken: data.refreshToken ?? user.refreshToken,
        expires: data.expires ?? user.expires,
      });

      return nextAccessToken;
    };

    instance.interceptors.request.use(
      (config) => {
        const user = getStoredUser();
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as RetryRequestConfig | undefined;
        const isUnauthorized = error.response?.status === 401;
        const isRefreshRequest =
          originalRequest?.url?.includes("/api/auth/refresh") ?? false;

        if (
          !originalRequest ||
          !isUnauthorized ||
          originalRequest._retry ||
          isRefreshRequest
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          if (!refreshState.promise) {
            refreshState.promise = refreshAccessToken().finally(() => {
              refreshState.promise = null;
            });
          }

          const newAccessToken = await refreshState.promise;
          if (!newAccessToken) {
            localStorage.removeItem("iisUser");
            return Promise.reject(error);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("iisUser");
          return Promise.reject(refreshError);
        }
      },
    );

    return instance;
  }, []);

  return client;
}
