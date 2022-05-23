import React from "react";
import useSWR from "swr";
import { InnerscanResponse } from "@/api/types/Innerscan";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { fetcher } from "@/api";
import { useTokenRegistry } from "@/auth";
import { compute } from "@/graphData";
import { DataForDraw } from "@/graphData";
import { format } from "date-fns";
import { Skeleton } from "@mui/material";

type ChartProps = {
  dataForDraw: DataForDraw;
};

const Chart: React.FC<ChartProps> = ({ dataForDraw }) => {
  return (
    <LineChart width={500} height={500} data={dataForDraw}>
      <XAxis
        dataKey="date"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        type="number"
      />
      <YAxis
        yAxisId="weight"
        domain={["dataMin", "dataMax"]}
        tickCount={10}
        tickLine={true}
        axisLine={true}
      />
      <YAxis
        yAxisId="percentage"
        orientation="right"
        domain={["dataMin", "dataMax"]}
        tickCount={10}
        tickLine={true}
        axisLine={true}
      />
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="weightRaw"
        stroke="#FFDDDD"
      />
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="weightSmooth"
        stroke="#FF0000"
      />
      <Line yAxisId="weight" type="monotone" dataKey="bfRaw" stroke="#FFDDDD" />
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="bfSmooth"
        stroke="#FF0000"
      />
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="muscleRaw"
        stroke="#FFDDDD"
      />
      <Line
        yAxisId="weight"
        type="monotone"
        dataKey="muscleSmooth"
        stroke="#FF0000"
      />

      <Line
        yAxisId="percentage"
        type="monotone"
        dataKey="bfpRaw"
        stroke="#DDDDFF"
      />
      <Line
        yAxisId="percentage"
        type="monotone"
        dataKey="bfpSmooth"
        stroke="#0000FF"
      />
    </LineChart>
  );
};

type ChartContainerProps = {
  sigma: number;
  from: Date | null;
  to: Date | null;
  bone: number;
};

export const ChartContainer: React.FC<ChartContainerProps> = ({
  sigma,
  from,
  to,
  bone,
}) => {
  const tokenRegistry = useTokenRegistry();
  const token = tokenRegistry.get();

  const { data: responseBody, error } = useSWR<InnerscanResponse>(
    // TODO: axios interceptor?
    () => {
      let key = `/status/innerscan.json?access_token=${token}&date=1`;
      if (from) {
        key = `${key}&from=${format(from, "yyyyMMddhhmmss")}`;
      }
      if (to) {
        key = `${key}&to=${format(to, "yyyyMMddhhmmss")}`;
      }
      return key;
    },
    fetcher
  );

  if (error) {
    return <div>error</div>;
  }

  if (!responseBody) {
    return <Skeleton variant="rectangular" width={500} height={500} />;
  }

  const dataForDraw = compute(responseBody.data, sigma, bone);

  return <Chart dataForDraw={dataForDraw} />;
};
