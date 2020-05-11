import { DevServer } from "../src";
import renderTestPage from "./render-page";

function test() {
  // blank notebook
  const devServer = new DevServer(renderTestPage, {
    sheetWidth: 8.5,
    sheetHeight: 11,
    units: "in"
  });

  devServer.start(8080);
}

test();
