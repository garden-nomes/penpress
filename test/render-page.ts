import { Polyline, RenderPage } from "../src";

function circle(x: number, y: number, radius: number): Polyline {
  const line: Polyline = [];

  for (let t = 0; t < Math.PI * 2; t += 0.1) {
    const tx = Math.cos(t) * radius + x;
    const ty = Math.sin(t) * radius + y;
    line.push([tx, ty]);
  }

  line.push(line[0]);
  return line;
}

const renderTestPage: RenderPage = ({ width, height, pageNumber }) => {
  const lines: Polyline[] = [];

  const margin = 0.25;

  lines.push([
    [margin, margin],
    [width - margin, margin],
    [width - margin, height - margin],
    [margin, height - margin],
    [margin, margin]
  ]);

  const radius = 0.1;
  for (let i = 0; i < pageNumber; i++) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const x = width / 2 - (radius * 16) / 2 + col * radius * 2;
    const y =
      height / 2 - (radius * 2 * Math.ceil(pageNumber / 8)) / 2 + row * radius * 2;
    lines.push(circle(x, y, radius));
  }

  return lines;
};

export default renderTestPage;
