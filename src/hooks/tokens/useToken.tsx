"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/hooks/api/useApiClient";
import { useAuthContext } from "@/hooks/providers/useAuthContext";
import { User } from "@/types/user";
import { AuthToken } from "@/types/token";
import { notifications } from "@mantine/notifications";

const USER_STORAGE_KEY = "iisUser";

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export function useToken() {
  const api = useApiClient();
  const router = useRouter();
  const { logout } = useAuthContext();
  const [tokenData, setTokenData] = useState<User | null>(() =>
    readStoredUser(),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const syncTokenData = useCallback(() => {
    setTokenData(readStoredUser());
  }, []);

  const refreshToken = useCallback(async (): Promise<User | null> => {
    const user = readStoredUser();
    if (!user?.refreshToken) {
      notifications.show({
        title: "Refresh failed",
        message: "No refresh token found.",
        color: "red",
      });
      return null;
    }

    setRefreshing(true);
    try {
      const { data } = await api.post<AuthToken>("/api/auth/refresh", {
        refreshToken: user.refreshToken,
      });

      if (!data.accessToken) return null;

      const updatedUser: User = {
        ...user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? user.refreshToken,
        expiresIn: data.expiresIn ?? user.expiresIn,
      };

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      setTokenData(updatedUser);

      notifications.show({
        title: "Token refreshed",
        message: "Access token updated successfully.",
        color: "green",
      });

      return updatedUser;
    } catch {
      notifications.show({
        title: "Refresh failed",
        message: "Could not refresh token.",
        color: "red",
      });
      return null;
    } finally {
      setRefreshing(false);
    }
  }, [api]);

  const revokeToken = useCallback(async (): Promise<boolean> => {
    const user = readStoredUser();
    if (!user?.refreshToken) {
      logout();
      setTokenData(null);

      notifications.show({
        title: "Token revoked",
        message: "Token has been removed locally.",
        color: "green",
      });

      router.replace("/auth");

      return true;
    }

    setRevoking(true);
    try {
      await api.post<AuthToken>("/api/auth/revoke", {
        refreshToken: user.refreshToken,
      });

      logout();
      setTokenData(null);

      notifications.show({
        title: "Token revoked",
        message: "Token has been revoked and removed locally.",
        color: "green",
      });

      router.replace("/auth");

      return true;
    } catch {
      notifications.show({
        title: "Revoke failed",
        message: "Could not revoke token.",
        color: "red",
      });
      return false;
    } finally {
      setRevoking(false);
    }
  }, [api, logout, router]);

  return {
    tokenData,
    refreshing,
    revoking,
    syncTokenData,
    refreshToken,
    revokeToken,
  };
}
