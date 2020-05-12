import express, { Express } from "express";
import path from "path";
import http from "http";
import Book, { RenderPage, BookSettings } from "./book";
import { renderSvg, RenderSettings } from "./svg";
import WebSocket from "ws";

const renderSettings: RenderSettings = {
  fill: "none",
  stroke: "black",
  penWidth: 0.05
};

export default class DevServer {
  book: Book;
  app: Express;
  server: http.Server;
  wss: WebSocket.Server;
  port: number;

  constructor(book: Book, port: number = 8080) {
    this.book = book;
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server, path: "/ws-reload" });

    this.configureExpress();
  }

  private configureExpress() {
    this.app.set("view engine", "pug");
    this.app.set("views", path.resolve(__dirname));

    this.app.get("/:pageNumber(\\d+)", (req, res) => {
      const pageNumber = Number.parseInt(req.params.pageNumber);

      if (pageNumber < 1) {
        return res.redirect("/1");
      }

      if (pageNumber > this.book.length) {
        return res.redirect(`/${this.book.length}`);
      }

      const pages = [Math.floor(pageNumber / 2) * 2, Math.floor(pageNumber / 2) * 2 + 1]
        .filter(p => p > 0 && p <= this.book.length)
        .map(num => ({ num, svg: renderSvg(this.book.renderPage(num), renderSettings) }));

      const prevPage = Math.floor(pageNumber / 2) * 2 - 1;
      const nextPage = Math.floor(pageNumber / 2) * 2 + 2;

      const length = this.book.length;
      const wsUrl = this.wsUrl;

      res.render("view", { pages, length, wsUrl, prevPage, nextPage });
    });

    this.app.get("/", (_, res) => {
      res.redirect("/1");
    });
  }

  private get hostname(): string {
    return `localhost:${this.port}`;
  }

  private get wsUrl(): string {
    return `ws://${this.hostname}/ws-reload`;
  }

  private broadcast(data: any) {
    this.wss.clients.forEach(ws => {
      ws.send(data);
    });
  }

  update(book: Book) {
    this.book = book;
    this.broadcast("reload");
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Listening at http://${this.hostname}`);
    });
  }
}
