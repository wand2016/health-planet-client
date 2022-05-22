import { useContext } from "react";
import { AuthContext, TokenRegistry } from "@/auth/AuthContext";

export const useTokenRegistry = (): TokenRegistry => {
  return useContext(AuthContext)!;
};
