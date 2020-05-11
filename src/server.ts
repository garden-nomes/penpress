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
  port: number = 8080;

  constructor(renderPage: RenderPage, settings: Partial<BookSettings>) {
    this.book = new Book(settings, renderPage);

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
      const page = this.book.renderPage(pageNumber);
      const svg = renderSvg(page, renderSettings);
      const length = this.book.length;
      const wsUrl = this.wsUrl;

      res.render("view", { svg, pageNumber, length, wsUrl });
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

  start() {
    this.server.listen(this.port, () => {
      console.log(`Listening at http://${this.hostname}`);
    });
  }

  update(renderPage: RenderPage) {
    this.book.renderPageFn = renderPage;
    this.broadcast("reload");
  }
}
