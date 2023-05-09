/** @jsx h */
import { h } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import {
  getShapeFunction,
  sub,
  add,
  length,
  normalize,
  cross,
  vec2,
} from "https://esm.sh/supershape@1.0.1";

export type Points = { x: number; y: number }[];

export type PathParameters = {
  rounding: number;
  exponent: number;
  closed: boolean;
  points: Points;
  sampleResolution: number;
  shapeStrokeWidth: number;
  shapeStroke: string;
  shapeFill: string;
  curvePlotStroke: string;
  curvePlotWidth: number;
  curvePlotFill: string;
};

const def: PathParameters = {
  exponent: 0.8,
  rounding: Number.MAX_VALUE,
  closed: false,
  shapeStroke: "#000000",
  shapeStrokeWidth: 1,
  shapeFill: "#ffffff",
  curvePlotStroke: "none",
  curvePlotFill: "none",
  curvePlotWidth: 1,
  points: [],
  sampleResolution: 100,
};

function f(n: number) {
  return n.toFixed(2);
}

function mul(a: vec2, b: number): vec2 {
  return { x: a.x * b, y: a.y * b };
}

export function Path(parameters: Partial<PathParameters> = {}) {
  const {
    points = def.points,
    rounding = def.rounding,
    exponent = def.exponent,
    closed = def.closed,
    sampleResolution = def.sampleResolution,
    shapeStrokeWidth = def.shapeStrokeWidth,
    shapeStroke = def.shapeStroke,
    shapeFill = def.shapeFill,
    curvePlotStroke = def.curvePlotStroke,
    curvePlotWidth = def.curvePlotWidth,
    curvePlotFill = def.curvePlotFill,
  } = parameters;

  // minimum 3 points
  if (points.length < 3) {
    return <g />;
  }

  let groups = [];
  function wrap(idx: number) {
    return (idx + points.length) % points.length;
  }
  for (let i = 0; i < points.length - (closed ? 0 : 2); i++) {
    // groups of three points
    groups.push([points[wrap(i)], points[wrap(i + 1)], points[wrap(i + 2)]]);
  }

  let path = "";
  let debugP = "";
  let curveP = "";

  // minimize the error per-group
  for (let i = 0; i < groups.length; i++) {
    // get the group
    const group = groups[i];
    // get the three points
    const a = group[0];
    const b = group[1];
    const c = group[2];

    const v = sub(b, a);
    const w = sub(c, b);

    const vn = normalize(v);
    const wn = normalize(w);

    // Calculate outer radius by rounding parameter (k). This value is clamped to half of the segment length.
    const k = rounding;
    const clamped = Math.min(Math.min(k, length(v) / 2), length(w) / 2);

    const shapeFn = getShapeFunction(a, b, c, clamped, exponent);

    if (exponent === 0 || cross(vn, wn) === 0) {
      // return straight line
      const pa = add(b, mul(vn, -clamped));
      const pb = add(b, mul(wn, clamped));
      let f = "L";
      if (path === "") f = "M";
      path += `${f}${pa.x} ${pa.y}L${pb.x} ${pb.y}`;
      continue;
    }

    // determine winding direction
    const winding = cross(sub(b, a), sub(c, b)) > 0 ? -1 : 1;
    for (let j = 0; j < sampleResolution; j++) {
      let t = j / (sampleResolution - 1);
      if (winding > 0) {
        t = 1 - t;
      }
      const { curve, curvature, radius, getPoint } = shapeFn(t);
      const curvaturePlot = getPoint(radius + curvature * 8);

      try {
        let cmd = "L";
        if (j === 0 || curveP.length === 0) cmd = "M";
        if (!isNaN(curvaturePlot.x) && !isNaN(curvaturePlot.y)) {
          curveP += `${cmd}${f(curvaturePlot.x)} ${f(curvaturePlot.y)}`;
        }
      } catch (e) {
        //
      }

      if (isNaN(curve.x) || isNaN(curve.y)) {
        continue;
      }

      if (path === "") {
        path += `M ${f(curve.x)} ${f(curve.y)}`;
      } else path += `L ${f(curve.x)} ${f(curve.y)}`;
    }
  }
  if (closed) {
    path += `z`;
    curveP += `z`;
  }
  return (
    <g>
      <path
        d={curveP}
        stroke={curvePlotStroke}
        stroke-width={curvePlotWidth}
        fill={curvePlotFill}
      />
      <path
        d={path}
        stroke={shapeStroke}
        stroke-width={shapeStrokeWidth}
        fill={shapeFill}
      />
      <path d={debugP} stroke="var(--gray-300)" stroke-width="0" fill="none" />
    </g>
  );
}
