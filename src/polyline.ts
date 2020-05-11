export type Vec2 = [number, number];
export type Polyline = Vec2[];

export function translate(polylines: Polyline[], [x, y]: Vec2): Polyline[] {
  return polylines.map(p => p.map(([px, py]) => [px + x, py + y]));
}

export function flip(polylines: Polyline[], [width, height]: Vec2): Polyline[] {
  return polylines.map(p => p.map(([x, y]) => [width - x, height - y]));
}
