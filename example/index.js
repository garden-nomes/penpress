const { Book } = require("plotterpress");

function circle(x, y, radius) {
  const line = [];

  for (let i = 0; i < Math.PI * 2; i += 0.01) {
    const px = Math.cos(i) * radius + x;
    const py = Math.sin(i) * radius + y;
    line.push([px, py]);
  }

  line.push(line[0]);
  return line;
}

const length = 64;

module.exports = new Book(
  ({ width, height, pageNumber }) => {
    const lines = [];

    for (let i = 0; i < pageNumber; i++) {
      const t = (i * Math.PI * 2) / length;
      const x = Math.cos(t) * 1 + width / 2;
      const y = Math.sin(t) * 1 + height / 2;
      lines.push(circle(x, y, 0.1));
    }

    return lines;
  },
  { length }
);
