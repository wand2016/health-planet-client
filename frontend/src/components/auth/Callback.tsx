import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "@/api";
import { tokenRegistry } from "@/auth";

export const Callback: React.FC = () => {
  const [code, setCode] = useState("");
  const [searchParams] = useSearchParams();

  type Token = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    expires_at: string;
  };

  useEffect(() => {
    (async () => {
      if (code) {
        const { data: accessToken } = await axiosInstance.post<Token>("token", {
          code,
        });

        tokenRegistry.set(accessToken.access_token);
      }
    })();
  }, [code]);

  useEffect(() => {
    setCode(searchParams.get("code") ?? "");
  }, []);

  return (
    <div>
      callback endpoint.
      <>{code}</>
    </div>
  );
};
