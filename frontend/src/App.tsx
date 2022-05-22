import React, { useEffect, useState } from "react";
import AppBar from "@/layouts/AppBar";
import useSWR, { Fetcher } from "swr";
import axiosInstance from "@/api";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { InnerscanResponse, TAG_BFP, TAG_WEIGHT } from "@/api/types/Innerscan";
import { convolution } from "@/math/convolution";
import { parse } from "date-fns";
import { TextField } from "@mui/material";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

const fetcher: Fetcher<InnerscanResponse> = async (url: string) => {
  const response = await axiosInstance.get(url);

  return response.data;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
};

const Auth: React.FC = () => {
  // redirect to login page
  location.href = "http://localhost:3001/auth";

  return <div>redirecting...</div>;
};

const Callback: React.FC = () => {
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

        localStorage.setItem("token", accessToken.access_token);
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

// TODO: split
function Layout() {
  location.href = "http://localhost:3001/auth";

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
    <BrowserRouter>
      <Routes>
        <Route path="/auth"></Route>
      </Routes>

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
    </BrowserRouter>
  );
}

export default App;
