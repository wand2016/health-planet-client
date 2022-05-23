import React from "react";
import { Box, Container } from "@mui/material";
import { ChartContainer } from "@/components/Chart";
import { parse } from "date-fns";
import createPersistedState from "use-persisted-state";
import { Form } from "@/components/Form";

const useSigma = createPersistedState<number>("form-sigma");
const useFrom = createPersistedState<string>("form-from");
const useTo = createPersistedState<string>("form-to");
const useBone = createPersistedState<number>("form-bone");

export function Body() {
  const [sigma, setSigma] = useSigma(3);
  const [from, setFrom] = useFrom("");
  const [to, setTo] = useTo("");
  const [bone, setBone] = useBone(3);

  const fromDate = from ? parse(from, "yyyy-MM-dd", new Date()) : null;
  const toDate = to ? parse(to, "yyyy-MM-dd", new Date()) : null;

  return (
    <Container>
      <Box sx={{ my: 2 }}>
        <ChartContainer sigma={sigma} from={fromDate} to={toDate} bone={bone} />
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
        />
      </Box>
    </Container>
  );
}
