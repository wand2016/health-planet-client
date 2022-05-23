import React, { useState } from "react";
import { TextField } from "@mui/material";
import { ChartContainer } from "@/components/Chart";
import { parse } from "date-fns";

export function Body() {
  const [sigma, setSigma] = useState(3);

  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  return (
    <>
      <ChartContainer sigma={sigma} from={from} to={to} />
      <TextField
        label="日付(from)"
        type="date"
        defaultValue="2022-04-01"
        onChange={(e) => {
          if (e.target.value) {
            setFrom(parse(e.target.value, "yyyy-MM-dd", new Date()));
          } else {
            setFrom(null);
          }
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="日付(to)"
        type="date"
        defaultValue="2022-05-23"
        onChange={(e) => {
          if (e.target.value) {
            setTo(parse(e.target.value, "yyyy-MM-dd", new Date()));
          } else {
            setTo(null);
          }
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="標準偏差(日)"
        type="number"
        onChange={(e) => setSigma(Number(e.target.value))}
        value={sigma}
      />
    </>
  );
}
