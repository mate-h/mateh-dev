/** @jsx h */
import { h } from "https://deno.land/x/htm@0.0.10/mod.tsx";
import { Path } from "./path.tsx";

const size = 200;
const points = [
  { x: 0, y: 0 },
  { x: size, y: 0 },
  { x: size, y: size },
  { x: 0, y: size },
];

export default () => {
  
  // onmount hook for deno is the same as useEffect



  return <div class="absolute inset-0 -z-1 flex items-center justify-center">
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      class="aspect-ratio-square overflow-visible"
    >
      <Path closed points={points} shapeFill="#007aff" shapeStrokeWidth={1} />
    </svg>
  </div>
}
