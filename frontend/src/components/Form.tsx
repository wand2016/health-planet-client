import React from "react";
import { FormControl, TextField } from "@mui/material";

type Model<T> = {
  value: T;
  set(v: T): void;
};

type FormType = {
  sigma: Model<number>;
  from: Model<string>;
  to: Model<string>;
};

export const Form: React.FC<FormType> = ({ sigma, from, to }) => {
  return (
    <FormControl>
      <TextField
        label="日付(from)"
        type="date"
        onChange={(e) => {
          from.set(e.target.value);
        }}
        value={from.value}
      />
      <TextField
        label="日付(to)"
        type="date"
        onChange={(e) => {
          to.set(e.target.value);
        }}
        value={to.value}
        InputLabelProps={{
          shrink: false,
        }}
      />
      <TextField
        label="標準偏差(日)"
        type="number"
        onChange={(e) => sigma.set(Number(e.target.value))}
        value={sigma.value}
      />
    </FormControl>
  );
};
