#!/usr/bin/env node

import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import DevServer from "../src/server";
import exportNotebook from "../src/export";

async function main() {
  const filename = path.resolve(process.argv[2]);
  const book = (await import(filename)).default;

  if (process.argv[3] === "--export") {
    const outputDirectory = path.resolve("output");

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    exportNotebook(book, outputDirectory);
    return;
  }

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
