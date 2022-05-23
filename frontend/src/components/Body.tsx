import React from "react";
import { Box, Container } from "@mui/material";
import { ChartContainer } from "@/components/Chart";
import { parse } from "date-fns";
import createPersistedState from "use-persisted-state";
import { Form, Visibility } from "@/components/Form";

const useVisibility = createPersistedState<Visibility>("form-visibility");
const useSigma = createPersistedState<number>("form-sigma");
const useFrom = createPersistedState<string>("form-from");
const useTo = createPersistedState<string>("form-to");
const useBone = createPersistedState<number>("form-bone");

export function Body() {
  const [visibility, setVisibility] = useVisibility({
    weight: true,
    bodyFatPercentage: true,
    bodyFat: true,
    muscle: true,
    raw: true,
    smooth: true,
  });
  const [sigma, setSigma] = useSigma(3);
  const [from, setFrom] = useFrom("");
  const [to, setTo] = useTo("");
  const [bone, setBone] = useBone(3);

  const fromDate = from ? parse(from, "yyyy-MM-dd", new Date()) : null;
  const toDate = to ? parse(to, "yyyy-MM-dd", new Date()) : null;

  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <ChartContainer
          sigma={sigma}
          from={fromDate}
          to={toDate}
          bone={bone}
          visibility={visibility}
        />
        <Form
          sigma={{
            value: sigma,
            set: setSigma,
          }}
          from={{
            value: from,
            set: setFrom,
          }}
          to={{
            value: to,
            set: setTo,
          }}
          bone={{
            value: bone,
            set: setBone,
          }}
          visibility={{
            value: visibility,
            set: setVisibility,
          }}
        />
      </Box>
    </Container>
  );
}
