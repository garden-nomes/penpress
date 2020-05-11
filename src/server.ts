import express from "express";
import path from "path";
import Book, { RenderPage, BookSettings } from "./book";
import { renderSvg, RenderSettings } from "./svg";

const PORT = 6969;

const renderSettings: RenderSettings = {
  fill: "none",
  stroke: "black",
  penWidth: 0.05
};

export default function runDevServer(
  renderPage: RenderPage,
  settings: Partial<BookSettings>
) {
  const book = new Book(settings, renderPage);

  const app = express();

  app.set("view engine", "pug");
  app.set("views", path.resolve(__dirname));

  app.get("/:pageNumber(\\d+)", (req, res) => {
    const pageNumber = Number.parseInt(req.params.pageNumber);
    const page = book.renderPage(pageNumber);
    const svg = renderSvg(page, renderSettings);
    const length = book.length;

    res.render("view", { svg, pageNumber, length });
  });

  app.get("/", (req, res) => {
    res.redirect("/1");
  });

  app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
  });
}
