import { exportNotebook } from "../src";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import renderTestPage from "./render-page";

function test() {
  const outputDirectory = path.resolve(__dirname, "output");

  if (fs.existsSync(outputDirectory)) {
    rimraf.sync(outputDirectory);
  }

  fs.mkdirSync(outputDirectory);

  // blank notebook
  exportNotebook(renderTestPage, outputDirectory, {
    sheetWidth: 8.5,
    sheetHeight: 11,
    units: "in"
  });
}

test();
