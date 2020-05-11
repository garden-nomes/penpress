import { runDevServer } from "../src";
import renderTestPage from "./render-page";

function test() {
  // blank notebook
  runDevServer(renderTestPage, { sheetWidth: 8.5, sheetHeight: 11, units: "in" });
}

test();
