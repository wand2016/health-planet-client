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
  bfRaw: number;
  bfSmooth: number;
  muscleRaw: number;
  muscleSmooth: number;
};

export type DataForDraw = DatumForDraw[];

export const compute = (
  rawData: InnerscanData,
  /** 標準偏差(日) */
  sigma: number,
  bone: number
): DataForDraw => {
  const rawDataBfp = rawData.filter((datum) => datum.tag === TAG_BFP);
  const rawDataWeight = rawData.filter((datum) => datum.tag === TAG_WEIGHT);

  const dataBfp = toDatumArray(rawDataBfp);
  const dataWeight = toDatumArray(rawDataWeight);
  const dataBf: Datum[] = dataBfp.map(({ x, y }, i) => {
    return {
      x,
      /** 体重 * 体脂肪率(%) */
      y: (dataWeight[i].y * y) / 100,
    };
  });
  const dataMuscle: Datum[] = dataWeight.map(({ x, y }, i) => {
    return {
      x,
      /** 体重 - 体脂肪量 - 骨量 */
      y: y - dataBf[i].y - bone,
    };
  });

  const sigmaInSec = dayToSecond(sigma);
  const blur = gaussianBlur(sigmaInSec);

  const dataBfpSmooth = blur(dataBfp);
  const dataWeightSmooth = blur(dataWeight);
  const dataBfSmooth = blur(dataBf);
  const dataMuscleSmooth = blur(dataMuscle);

  const dataForDraw: DataForDraw = [];
  for (let i = 0; i < dataBfp.length; ++i) {
    dataForDraw.push({
      date: dataBfp[i].x * 1000,
      bfpRaw: dataBfp[i].y,
      bfpSmooth: dataBfpSmooth[i].y,
      weightRaw: dataWeight[i].y,
      weightSmooth: dataWeightSmooth[i].y,
      bfRaw: dataBf[i].y,
      bfSmooth: dataBfSmooth[i].y,
      muscleRaw: dataMuscle[i].y,
      muscleSmooth: dataMuscleSmooth[i].y,
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
