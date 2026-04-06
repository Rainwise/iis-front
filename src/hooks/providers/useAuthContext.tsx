"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useApiClient } from "@/hooks/api/useApiClient";
import { notifications } from "@mantine/notifications";

// Type Imports
import { IAuthContext } from "@/types/IAuthContext";
import { User } from "@/types/user";

type JwtPayload = {
  role?: string | string[];
  roles?: string | string[];
  ["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?:
    | string
    | string[];
};

const decodeBase64Url = (value: string): string | null => {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(paddingLength);
    return atob(padded);
  } catch {
    return null;
  }
};

const extractRolesFromAccessToken = (accessToken?: string): string[] => {
  if (!accessToken) return [];

  const parts = accessToken.split(".");
  if (parts.length < 2) return [];

  const payloadRaw = decodeBase64Url(parts[1]);
  if (!payloadRaw) return [];

  try {
    const payload = JSON.parse(payloadRaw) as JwtPayload;
    const roleClaim =
      payload.role ??
      payload.roles ??
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!roleClaim) return [];
    return Array.isArray(roleClaim) ? roleClaim : [roleClaim];
  } catch {
    return [];
  }
};

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingData, isCheckingData] = useState(true);
  const api = useApiClient();

  const roles = useMemo(
    () => extractRolesFromAccessToken(user?.accessToken),
    [user?.accessToken],
  );

  const isAdmin = useMemo(
    () => roles.some((role) => role.toLowerCase() === "admin"),
    [roles],
  );

  const hasRole = (role: string) =>
    roles.some(
      (existingRole) => existingRole.toLowerCase() === role.toLowerCase(),
    );

  useEffect(() => {
    const stored = localStorage.getItem("iisUser");
    if (stored) setUser(JSON.parse(stored));
    isCheckingData(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<User>("/api/auth/login/", {
        username,
        password,
      });
      setUser(data);
      localStorage.setItem("iisUser", JSON.stringify(data));

      notifications.show({
        title: "Login successful",
        message: `Welcome back!`,
        color: "green",
      });
    } catch (error: unknown) {
      notifications.show({
        title: "Login failed",
        message:
          error instanceof Error ? error.message : "An unknown error occurred.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("iisUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAdmin,
        hasRole,
        loading,
        checkingData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
