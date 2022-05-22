import * as React from "react";
import { PropsWithChildren } from "react";
import createPersistedState from "use-persisted-state";

export const AuthContext = React.createContext<TokenRegistry | null>(null);

const KEY = "token";
const useTokenState = createPersistedState<string | null>(KEY);

export type TokenRegistry = {
  get(): string | null;
  set(token: string): void;
};

export const AuthContextProvider: React.FC<PropsWithChildren<any>> = ({
  children,
}) => {
  const [token, setToken] = useTokenState(null);

  const tokenRegistry: TokenRegistry = {
    get() {
      return token ?? null;
    },
    set(token: string) {
      setToken(token);
    },
  };

  return (
    <AuthContext.Provider value={tokenRegistry}>
      {children}
    </AuthContext.Provider>
  );
};
