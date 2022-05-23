import {
  Data as InnerscanData,
  TAG_BFP,
  TAG_WEIGHT,
} from "@/api/types/Innerscan";
import { Datum, gaussianBlur } from "@/math/convolution";
import { parse } from "date-fns";

type DatumForDraw = {
  date: number;
  bfpRaw: number;
  bfpSmooth: number;
  weightRaw: number;
  weightSmooth: number;
};

export type DataForDraw = DatumForDraw[];

/**
 * @param rawData
 * @param sigma 標準偏差(日)
 */
export const compute = (rawData: InnerscanData, sigma: number): DataForDraw => {
  const rawDataBfp = rawData.filter((datum) => datum.tag === TAG_BFP);
  const rawDataWeight = rawData.filter((datum) => datum.tag === TAG_WEIGHT);

  const dataBfp = toDatumArray(rawDataBfp);
  const dataWeight = toDatumArray(rawDataWeight);

  const sigmaInSec = dayToSecond(sigma);
  const blur = gaussianBlur(sigmaInSec);

  const dataBfpSmooth = blur(dataBfp);
  const dataWeightSmooth = blur(dataWeight);

  const dataForDraw: DataForDraw = [];
  for (let i = 0; i < dataBfp.length; ++i) {
    dataForDraw.push({
      date: dataBfp[i].x * 1000,
      bfpRaw: dataBfp[i].y,
      bfpSmooth: dataBfpSmooth[i].y,
      weightRaw: dataWeight[i].y,
      weightSmooth: dataWeightSmooth[i].y,
    });
  }

  return dataForDraw;
};

function toDatumArray(rawData: InnerscanData): Datum[] {
  return rawData.map((rawDatum) => ({
    x: parse(rawDatum.date, "yyyyMMddHHmm", new Date()).getTime() / 1000,
    y: Number(rawDatum.keydata),
  }));
}

function dayToSecond(days: number): number {
  return days * 60 * 60 * 24;
}
