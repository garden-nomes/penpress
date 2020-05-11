import express, { Express } from "express";
import path from "path";
import Book, { RenderPage, BookSettings } from "./book";
import { renderSvg, RenderSettings } from "./svg";

const renderSettings: RenderSettings = {
  fill: "none",
  stroke: "black",
  penWidth: 0.05
};

export default class DevServer {
  book: Book;
  app: Express;

  constructor(renderPage: RenderPage, settings: Partial<BookSettings>) {
    this.book = new Book(settings, renderPage);
    this.app = express();
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

      res.render("view", { svg, pageNumber, length });
    });

    this.app.get("/", (_, res) => {
      res.redirect("/1");
    });
  }

  start(port: number) {
    this.app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
  }
}
