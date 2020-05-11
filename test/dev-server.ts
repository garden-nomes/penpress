import { DevServer } from "../src";
import renderPage, { renderPageAlt } from "./render-page";

function test() {
  // blank notebook
  const devServer = new DevServer(renderPage, {
    sheetWidth: 8.5,
    sheetHeight: 11,
    units: "in"
  });

  devServer.start();

  let toggle = false;
  setInterval(() => {
    devServer.update(toggle ? renderPage : renderPageAlt);
    toggle = !toggle;
  }, 2000);
}

test();
