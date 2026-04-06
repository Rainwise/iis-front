import { User } from "@/types/user";

export interface IAuthContext {
  user: User | null;
  roles: string[];
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
  checkingData: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
