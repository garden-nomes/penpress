import { Polyline } from "./polyline";
import { Document } from "./book";

export interface RenderSettings {
  penWidth: number;
  fill: string;
  stroke: string;
}

function polylineToSvgPath(polyline: Polyline, dpi: number): string {
  if (polyline.length < 2) return "";

  let line = `M ${polyline[0][0] * dpi},${polyline[0][1] * dpi}`;
  for (let i = 1; i < polyline.length; i++) {
    const [x, y] = polyline[i];
    line += ` L ${x * dpi},${y * dpi}`;
  }

  return line;
}

export function renderSvg(
  { width, height, units, polylines }: Document,
  { fill, stroke, penWidth }: RenderSettings
) {
  const dpi = 300;

  return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
    width="${width}${units}" height="${height}${units}"
    viewBox="0 0 ${width * dpi} ${height * dpi}">
  <g fill="${fill}" stroke="${stroke}" lineWidth="${penWidth}">
${polylines.map(p => `    <path d="${polylineToSvgPath(p, dpi)}" />`).join("\n")}
  </g>
</svg>
`;
}
