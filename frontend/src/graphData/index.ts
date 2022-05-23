import { Data, TAG_BFP } from "@/api/types/Innerscan";
import { convolution } from "@/math/convolution";
import { parse } from "date-fns";

type DatumForDraw = {
  date: number;
  bfpRaw: number;
  bfpSmooth: number;
};

export type DataForDraw = DatumForDraw[];

/**
 * @param rawData
 * @param sigma 標準偏差
 */
export const compute = (rawData: Data, sigma: number): DataForDraw => {
  const rawDataBfp = rawData.filter((datum) => datum.tag === TAG_BFP); //

  const dataBfp = rawDataBfp.map((datum) => ({
    x: parse(datum.date, "yyyyMMddHHmm", new Date()).getTime() / 1000,
    y: Number(datum.keydata),
  }));

  const sigmaInSec = sigma * 60 * 60 * 24; // 3day
  const dataBfpSmooth = convolution(dataBfp, (x) =>
    Math.exp((-x * x) / 2 / sigmaInSec / sigmaInSec)
  );

  const dataForDraw: DataForDraw = [];
  for (let i = 0; i < dataBfp.length; ++i) {
    dataForDraw.push({
      date: dataBfp[i].x * 1000,
      bfpRaw: dataBfp[i].y,
      bfpSmooth: dataBfpSmooth[i].y,
    });
  }

  return dataForDraw;
};
