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
import { setUnauthorizedHandler } from "services/handlers";
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
  const [user, setUser] = useState(() => userStorage.get());

  const signIn = useCallback(async (payload: SignInPayload) => {
    const response = await authServices.signIn(payload);
    accessTokenStorage.set(response.access_token);
    if (response.refresh_token) {
      refreshTokenStorage.set(response.refresh_token);
    }
    userStorage.set(response.user);
    setUser(response.user);
    setToken(response.access_token);
    return response.user;
  }, []);

  const signOut = useCallback(() => {
    accessTokenStorage.destroy();
    refreshTokenStorage.destroy();
    userStorage.destroy();
    queryClient.clear();
    setUser(null);
    setToken(null);
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(undefined);
  }, [signOut]);

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
