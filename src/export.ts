import fs from "fs";
import path from "path";
import Book from "./book";
import { renderSvg } from "./svg";
import optimizePolylines from "./optimize-polylines";

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

export default function exportNotebook(book: Book, outputDirectory: string) {
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

  const renderSettings = {
    fill: "none",
    stroke: "black",
    penWidth: book.penWidth
  };

  for (let i = 0; i < book.sheetCount; i++) {
    const [front, back] = [book.renderSheet(i, true), book.renderSheet(i, false)];

    front.polylines = optimizePolylines(front.polylines);
    back.polylines = optimizePolylines(back.polylines);

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
