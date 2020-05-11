#!/usr/bin/env node

import path from "path";
import chokidar from "chokidar";
import DevServer from "../src/server";

async function main() {
  const filename = path.resolve(process.argv[2]);
  const book = (await import(filename)).default;

  const devServer = new DevServer(book);
  devServer.start();

  chokidar.watch(filename).on("change", async () => {
    console.log("Change dectected, reloading");

    delete require.cache[require.resolve(filename)];
    const book = (await import(filename)).default;
    devServer.update(book);
  });
}

main();
