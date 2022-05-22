import React, { useState } from "react";
import AppBar from "@/layouts/AppBar";
import useSWR, { Fetcher } from "swr";
import axiosInstance from "@/api";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { InnerscanResponse, TAG_BFP, TAG_WEIGHT } from "@/api/types/Innerscan";
import { convolution } from "@/math/convolution";
import { parse } from "date-fns";
import { TextField } from "@mui/material";

const fetcher: Fetcher<InnerscanResponse> = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

function App() {
  const [sigma, setSigma] = useState(3);
  const { data: responseBody, error } = useSWR<InnerscanResponse>(
    "/status/innerscan.json",
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
    date: Date;
    bfpRaw: number;
    bfpSmooth: number;
  };
  const dataForDraw: DatumForDraw[] = [];
  for (let i = 0; i < dataBfp.length; ++i) {
    dataForDraw.push({
      date: new Date(dataBfp[i].x * 1000),
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
        <XAxis dataKey="date" />
        <YAxis />
        <Line type="monotone" dataKey="bfpRaw" stroke="#00ff00" />
        <Line type="monotone" dataKey="bfpSmooth" stroke="#ff0000" />
      </LineChart>
    </div>
  );
}

export default App;