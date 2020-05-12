import { Polyline, Vec2 } from "./polyline";

function getStartAndEnd(path: Polyline): [Vec2, Vec2] {
  return [path[0], path[path.length - 1]];
}

function distSq([x1, y1]: Vec2, [x2, y2]: Vec2): number {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function mergePolylines(paths: Polyline[], threshold = 0.05): Polyline[] {
  return paths.reduce((result, path) => {
    if (!result.length) {
      result.push(path);
      return result;
    }

    const tail = result[result.length - 1];
    const [_, end] = getStartAndEnd(tail);
    const [start] = getStartAndEnd(path);

    if (distSq(start, end) < threshold * threshold) {
      tail.push(...path);
    } else {
      result.push(path);
    }

    return result;
  }, [] as Polyline[]);
}

function sortPolylines(paths: Polyline[]): Polyline[] {
  for (let i = 0; i < paths.length - 2; i++) {
    // get the last point along the current path
    const [_, penAt] = getStartAndEnd(paths[i]);

    // find the closest subsequent path by start- or end-point
    let best: { index: number; dist: number; isFromStart: boolean } | null = null;
    for (let j = i + 1; j < paths.length; j++) {
      const [start, end] = getStartAndEnd(paths[j]);
      const [startDist, endDist] = [distSq(penAt, start), distSq(penAt, end)];

      const isFromStart = startDist < endDist;
      const dist = isFromStart ? startDist : endDist;

      if (best === null || best.dist > dist) {
        best = { index: j, dist, isFromStart };
      }
    }

    if (best === null) {
      throw new Error("`best` is null, shouldn't be possible");
    }

    // if `best` is closest by end-point, reverse it so that the start point is closest
    if (!best.isFromStart) {
      paths[best.index].reverse();
    }

    // swap out the next index with the closest by distance
    const tmp = paths[i + 1];
    paths[i + 1] = paths[best.index];
    paths[best.index] = tmp;
  }

  return paths;
}

export default function optimizePolylines(paths: Polyline[]): Polyline[] {
  if (!paths.length) return paths;

  // sorts paths for least pen-up travel time, reversing if needed
  paths = sortPolylines(paths);

  // merge lines that start/end in same place
  paths = mergePolylines(paths);

  return paths;
}
