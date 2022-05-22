import React, { useState } from "react";
import useSWR, { Fetcher } from "swr";
import { InnerscanResponse, TAG_BFP } from "@/api/types/Innerscan";
import { parse } from "date-fns";
import { convolution } from "@/math/convolution";
import AppBar from "@/layouts/AppBar";
import { TextField } from "@mui/material";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import axiosInstance from "@/api";
import { useTokenRegistry } from "@/auth";

const fetcher: Fetcher<InnerscanResponse> = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

// TODO: split
export function Layout() {
  const [sigma, setSigma] = useState(3);

  const tokenRegistry = useTokenRegistry();
  const token = tokenRegistry.get();

  const { data: responseBody, error } = useSWR<InnerscanResponse>(
    // TODO: axios interceptor
    `/status/innerscan.json?access_token=${token}`,
    fetcher
  );

  if (error) {
    return <div>error</div>;
  }

  if (!responseBody) {
    return <div>...loading...</div>;
  }

  const rawData = responseBody.data;

  const rawDataBfp = rawData.filter((datum) => datum.tag === TAG_BFP);

  const dataBfp = rawDataBfp.map((datum) => ({
    x: parse(datum.date, "yyyyMMddHHmm", new Date()).getTime() / 1000,
    y: Number(datum.keydata),
  }));

  const sigmaInSec = sigma * 60 * 60 * 24; // 3day
  const dataBfpSmooth = convolution(dataBfp, (x) =>
    Math.exp((-x * x) / 2 / sigmaInSec / sigmaInSec)
  );

  type DatumForDraw = {
    date: number;
    bfpRaw: number;
    bfpSmooth: number;
  };
  const dataForDraw: DatumForDraw[] = [];
  for (let i = 0; i < dataBfp.length; ++i) {
    dataForDraw.push({
      date: dataBfp[i].x * 1000,
      bfpRaw: dataBfp[i].y,
      bfpSmooth: dataBfpSmooth[i].y,
    });
  }

  return (
    <div>
      <AppBar />
      <TextField
        label="Sigma"
        type="number"
        onChange={(e) => setSigma(Number(e.target.value))}
        value={sigma}
      />
      <LineChart width={500} height={500} data={dataForDraw}>
        <XAxis
          dataKey="date"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
          type="number"
        />
        <YAxis />
        <Line type="monotone" dataKey="bfpRaw" stroke="#00ff00" />
        <Line type="monotone" dataKey="bfpSmooth" stroke="#ff0000" />
      </LineChart>
    </div>
  );
}
