export type Datum = {
  x: number;
  y: number;
};

type WindowFunction = {
  (x: number): number;
};

function y(data: Datum[], x: number): number {
  const found = data.find((datum) => datum.x === x);
  if (!found) {
    console.log(data, x);
    throw new Error("boo");
  }
  return found.y;
}

function sum(xs: number[]): number {
  return xs.reduce((acc, e) => acc + e, 0);
}

export function convolution(
  data: Datum[],
  windowFunction: WindowFunction
): Datum[] {
  const xs = data.map(({ x }) => x);

  const ys = xs.map(
    (x) =>
      sum(xs.map((x2) => windowFunction(x2 - x) * y(data, x2))) /
      sum(xs.map((x2) => windowFunction(x2 - x)))
  );

  const ret: Datum[] = [];

  for (let i = 0; i < xs.length; ++i) {
    ret.push({
      x: xs[i],
      y: ys[i],
    });
  }

  return ret;
}

const gaussian = (sigma: number) => (x: number) =>
  Math.exp((-x * x) / 2 / sigma / sigma);

export const gaussianBlur =
  (sigma: number) =>
  (data: Datum[]): Datum[] => {
    return convolution(data, gaussian(sigma));
  };
