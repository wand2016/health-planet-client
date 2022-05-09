import React from "react";
import AppBar from "@/layouts/AppBar";
import useSWR, { Fetcher } from "swr";
import axiosInstance from "@/api";

const fetcher: Fetcher = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

function App() {
  const { data, error } = useSWR("/status/innerscan.json", fetcher);

  if (error) {
    <div>error</div>;
  }

  if (!data) {
    <div>...loading...</div>;
  }

  return (
    <div>
      <AppBar />
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export default App;
