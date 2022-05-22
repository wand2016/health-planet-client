import * as React from "react";
import { useTokenRegistry } from "@/auth";
import { useNavigate } from "react-router-dom";
import { PropsWithChildren } from "react";

export const RequiresAuth: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const tokenRegistry = useTokenRegistry();
  const navigate = useNavigate();

  if (!tokenRegistry.get()) {
    navigate("/auth", { replace: true });
  }

  return <>{children}</>;
};
