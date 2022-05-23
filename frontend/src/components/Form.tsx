import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";

export const visibilityKeys = [
  "weight",
  "bodyFatPercentage",
  "bodyFat",
  "muscle",
  "raw",
  "smooth",
] as const;

type Model<T> = {
  value: T;
  set(v: T): void;
  set(fn: (v: T) => T): void;
};

type VisibilityKey = typeof visibilityKeys[number];
export type Visibility = Record<VisibilityKey, boolean>;

type FormType = {
  visibility: Model<Visibility>;
  sigma: Model<number>;
  from: Model<string>;
  to: Model<string>;
  bone: Model<number>;
};

export const Form: React.FC<FormType> = ({
  visibility,
  sigma,
  from,
  to,
  bone,
}) => {
  return (
    <FormControl>
      <FormGroup>
        {visibilityKeys.map((visibilityKey) => (
          <FormControlLabel
            key={visibilityKey}
            control={
              <Checkbox
                checked={visibility.value[visibilityKey]}
                onChange={(e) => {
                  visibility.set((prev) => {
                    return {
                      ...prev,
                      [visibilityKey]: e.target.checked,
                    };
                  });
                }}
              />
            }
            label={visibilityKey}
          />
        ))}
      </FormGroup>
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
      <TextField
        label="骨量(kg)"
        type="number"
        onChange={(e) => bone.set(Number(e.target.value))}
        value={bone.value}
      />
    </FormControl>
  );
};
