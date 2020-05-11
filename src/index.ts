import fs from "fs";
import path from "path";
import Book, { RenderPage, BookSettings } from "./book";
import { renderSvg } from "./svg";

export { RenderPage, PageContext } from "./book";
export { Polyline } from "./polyline";

function zeroPad(num: number, width: number): string {
  const numberDigits = ("" + num).length;
  const zeros = width - numberDigits;
  return zeros > 0 ? "0".repeat(zeros) + num : "" + num;
}

function generateFilename(printOrder: number, sheetNumber: number, isFront: boolean) {
  return `${zeroPad(printOrder, 3)}_sheet-${sheetNumber}_${
    isFront ? "front" : "back"
  }.svg`;
}

export function exportNotebook(
  renderPage: RenderPage,
  outputDirectory: string,
  settings?: Partial<BookSettings>
) {
  if (!fs.existsSync(outputDirectory)) {
    throw new Error(`${outputDirectory} does not exist`);
  }

  if (!fs.statSync(outputDirectory).isDirectory) {
    throw new Error(`${outputDirectory} is not a directory`);
  }

  // clean out output directory
  fs.readdirSync(outputDirectory).forEach(filename => {
    if (/\.svg$/.test(filename)) {
      fs.unlinkSync(path.join(outputDirectory, filename));
    }
  });

  const defaults: BookSettings = {
    length: 128,
    units: "in",
    sheetsInSignature: 4,
    sheetWidth: 8.5,
    sheetHeight: 11,
    penWidth: 0.05
  };

  const mergedSettings = { ...defaults, ...settings };
  const book = new Book(mergedSettings, renderPage);

  const renderSettings = {
    fill: "none",
    stroke: "black",
    penWidth: mergedSettings.penWidth
  };

  // render front of
  for (let i = 0; i < book.sheetCount; i++) {
    const [front, back] = [book.renderSheet(i, true), book.renderSheet(i, false)];

    // write front of sheet
    fs.writeFileSync(
      path.join(outputDirectory, generateFilename(i, i, true)),
      renderSvg(front, renderSettings),
      "utf-8"
    );

    // write back of sheet
    fs.writeFileSync(
      path.join(outputDirectory, generateFilename(book.sheetCount + i, i, false)),
      renderSvg(back, renderSettings),
      "utf-8"
    );
  }
}
