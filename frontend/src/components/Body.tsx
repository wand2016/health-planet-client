import React, { ComponentProps, useCallback, useState } from "react";
import { TextField } from "@mui/material";
import { ChartContainer } from "@/components/Chart";
import { format, parse } from "date-fns";
import createPersistedState from "use-persisted-state";

const useFrom = createPersistedState<string>("form-from");
const useTo = createPersistedState<string>("form-to");

export function Body() {
  const [sigma, setSigma] = useState(3);

  const [from, setFrom] = useFrom("");
  const [to, setTo] = useTo("");

  const fromDate = from ? parse(from, "yyyy-MM-dd", new Date()) : null;
  const toDate = to ? parse(to, "yyyy-MM-dd", new Date()) : null;

  return (
    <>
      <ChartContainer sigma={sigma} from={fromDate} to={toDate} />
      <TextField
        label="日付(from)"
        type="date"
        onChange={(e) => {
          setFrom(e.target.value);
        }}
        value={from}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="日付(to)"
        type="date"
        onChange={(e) => {
          setTo(e.target.value);
        }}
        value={to}
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
