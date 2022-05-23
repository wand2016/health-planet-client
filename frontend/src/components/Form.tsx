import React, { FormEvent } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      }}
    >
      <FormControl>
        <FormLabel component="legend">表示するグラフを選択</FormLabel>
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
      </FormControl>
      <FormControl>
        <FormLabel component="legend">日付</FormLabel>
        <FormGroup>
          <TextField
            label="from / 空で3ヶ月前"
            type="date"
            onChange={(e) => {
              from.set(e.target.value);
            }}
            value={from.value}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="to / 空で現在日時"
            type="date"
            onChange={(e) => {
              to.set(e.target.value);
            }}
            value={to.value}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormGroup>
      </FormControl>
      <FormControl>
        <FormLabel component="legend">blur</FormLabel>
        <FormGroup>
          <TextField
            label="Gaussianの標準偏差(日)"
            type="number"
            onChange={(e) => sigma.set(Number(e.target.value))}
            value={sigma.value}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: 1 }}
          />
        </FormGroup>
      </FormControl>
      <FormControl>
        <FormLabel component="legend">体組成入力値</FormLabel>
        <FormGroup>
          <TextField
            label="骨量(kg)"
            type="number"
            onChange={(e) => bone.set(Number(e.target.value))}
            value={bone.value}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: 1, step: 0.1 }}
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};
