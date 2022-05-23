import React, { ComponentProps } from "react";
import useSWR from "swr";
import { InnerscanResponse } from "@/api/types/Innerscan";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { fetcher } from "@/api";
import { useTokenRegistry } from "@/auth";
import { compute } from "@/graphData";
import { DataForDraw } from "@/graphData";
import { format } from "date-fns";
import { Skeleton } from "@mui/material";
import { Visibility, visibilityKeys } from "@/components/Form";

type ChartProps = {
  dataForDraw: DataForDraw;
  visibility: Visibility;
};

const Chart: React.FC<ChartProps> = ({ dataForDraw, visibility }) => {
  const showPercentage = visibility.bodyFatPercentage;
  const showMass = visibility.weight || visibility.bodyFat || visibility.muscle;

  const lineProps: (ComponentProps<typeof Line> & {
    visibilityKeys: (keyof Visibility)[];
  })[] = [
    {
      visibilityKeys: ["weight", "raw"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "weightRaw",
      stroke: "rgba(255,0,0,0.25)",
    },
    {
      visibilityKeys: ["weight", "smooth"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "weightSmooth",
      stroke: "rgba(255,0,0,1)",
    },
    {
      visibilityKeys: ["bodyFatPercentage", "raw"],
      yAxisId: "percentage",
      type: "monotone",
      dataKey: "bfpRaw",
      stroke: "rgba(0,128,0,0.25)",
    },
    {
      visibilityKeys: ["bodyFatPercentage", "smooth"],
      yAxisId: "percentage",
      type: "monotone",
      dataKey: "bfpSmooth",
      stroke: "rgba(0,128,0,1)",
    },
    {
      visibilityKeys: ["bodyFat", "raw"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "bfRaw",
      stroke: "rgba(0,0,128,0.25)",
    },
    {
      visibilityKeys: ["bodyFat", "smooth"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "bfSmooth",
      stroke: "rgba(0,0,128,1)",
    },
    {
      visibilityKeys: ["muscle", "raw"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "muscleRaw",
      stroke: "rgba(128,64,0,0.25)",
    },
    {
      visibilityKeys: ["muscle", "smooth"],
      yAxisId: "mass",
      type: "monotone",
      dataKey: "muscleSmooth",
      stroke: "rgba(128,64,0,1)",
    },
  ];

  let filteredLineProps = lineProps;
  for (const key of visibilityKeys) {
    filteredLineProps = filteredLineProps.filter(({ visibilityKeys }) =>
      visibility[key] ? true : !visibilityKeys.includes(key)
    );
  }

  return (
    <LineChart width={500} height={500} data={dataForDraw}>
      <XAxis
        dataKey="date"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        type="number"
      />
      {showMass ? (
        <YAxis
          yAxisId="mass"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(tick) => `${Math.round(tick * 100) / 100}`}
          tickCount={10}
          tickLine={true}
          axisLine={true}
        />
      ) : null}
      {showPercentage ? (
        <YAxis
          yAxisId="percentage"
          orientation="right"
          domain={["dataMin", "dataMax"]}
          tickCount={10}
          tickLine={true}
          tickFormatter={(tick) => `${Math.round(tick * 100) / 100}`}
          axisLine={true}
        />
      ) : null}
      {filteredLineProps.map(({ visibilityKeys, ref, ...lineProp }) => (
        <Line key={String(lineProp.dataKey)} {...lineProp} />
      ))}
    </LineChart>
  );
};

type ChartContainerProps = {
  visibility: Visibility;
  sigma: number;
  from: Date | null;
  to: Date | null;
  bone: number;
};

export const ChartContainer: React.FC<ChartContainerProps> = ({
  visibility,
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

  return <Chart dataForDraw={dataForDraw} visibility={visibility} />;
};
