import { rest } from "msw";
import example from "./example.json";
import { InnerscanResponse } from "@/api/types/Innerscan";

function assertInnerscanResponse(
  arg: typeof example
): arg is InnerscanResponse {
  //TODO: impl
  return true;
}

export const handlers = [
  rest.get(
    /https:\/\/www.healthplanet.jp\/status\/innerscan.json/,
    async (req, res, ctx) => {
      await sleep(1000);

      assertInnerscanResponse(example);

      return res(ctx.status(200), ctx.json(example));
    }
  ),
];

function sleep(millisec: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisec);
  });
}
