import axios from "axios";
import { Fetcher } from "swr";
import { InnerscanResponse } from "@/api/types/Innerscan";

export const axiosInstance = axios.create({
  // baseURL: "https://www.healthplanet.jp/",
  baseURL: "http://localhost:3001/",
});

export const fetcher: Fetcher<InnerscanResponse> = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};
