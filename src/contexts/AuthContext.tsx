import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "react-query";
import { SignInPayload, User } from "interfaces/auth";
import { authServices } from "services/auth";
import { userFromAccessToken, userFromMe } from "utils/jwt";
import {
  accessTokenStorage,
  refreshTokenStorage,
} from "hooks/storage/accessToken";
import { userStorage } from "hooks/storage/user";

interface ContextProps {
  user: User | null;
  isAuthenticated: boolean;
  signIn(payload: SignInPayload): Promise<User>;
  signOut(): void;
}

const Context = createContext({} as ContextProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => accessTokenStorage.get());
  const [user, setUser] = useState(() => {
    const storedUser = userStorage.get();
    if (storedUser) {
      return storedUser;
    }

    const storedToken = accessTokenStorage.get();
    if (storedToken) {
      return userFromAccessToken(storedToken);
    }

    return null;
  });

  const syncAuthenticatedUser = useCallback(async () => {
    const profile = await authServices.getMe();
    const authenticatedUser = userFromMe(profile);
    userStorage.set(authenticatedUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const signIn = useCallback(
    async (payload: SignInPayload) => {
      const response = await authServices.signIn(payload);

      accessTokenStorage.set(response.access_token);
      if (response.refresh_token) {
        refreshTokenStorage.set(response.refresh_token);
      }
      setToken(response.access_token);

      const authenticatedUser = await syncAuthenticatedUser();
      return authenticatedUser;
    },
    [syncAuthenticatedUser]
  );

  const signOut = useCallback(() => {
    accessTokenStorage.destroy();
    refreshTokenStorage.destroy();
    userStorage.destroy();
    queryClient.clear();
    setUser(null);
    setToken(null);
  }, [queryClient]);

  useEffect(() => {
    if (!token) {
      return;
    }

    syncAuthenticatedUser().catch(() => undefined);
  }, [token, syncAuthenticatedUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!token, signIn, signOut }),
    [user, token, signIn, signOut]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(Context);
}
