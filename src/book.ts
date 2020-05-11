import { Polyline, translate, flip } from "./polyline";
import { fourPageImposition } from "./imposition";

export type SvgUnits = "em" | "ex" | "px" | "pt" | "pc" | "cm" | "mm" | "in";

export interface BookSettings {
  length: number;
  sheetsInSignature: number;
  sheetWidth: number;
  sheetHeight: number;
  penWidth: number;
  units: SvgUnits;
}

export interface Document {
  polylines: Polyline[];
  width: number;
  height: number;
  units: SvgUnits;
}

export interface PageContext {
  pageNumber: number;
  width: number;
  height: number;
}

export interface RenderPage {
  (context: PageContext): Polyline[];
}

export default class Book {
  static defaults: BookSettings = {
    length: 128,
    units: "in",
    sheetsInSignature: 4,
    sheetWidth: 8.5,
    sheetHeight: 11,
    penWidth: 0.05
  };

  public length: number;
  public sheetsInSignature: number;
  public sheetWidth: number;
  public sheetHeight: number;
  public units: any;
  public renderPageFn: RenderPage;
  public penWidth: number;

  constructor(settings: Partial<BookSettings>, renderPage: RenderPage) {
    const mergedSettings = { ...Book.defaults, ...settings };

    this.length = mergedSettings.length;
    this.sheetsInSignature = mergedSettings.sheetsInSignature;
    this.sheetWidth = mergedSettings.sheetWidth;
    this.sheetHeight = mergedSettings.sheetHeight;
    this.units = mergedSettings.units;
    this.penWidth = mergedSettings.penWidth;
    this.renderPageFn = renderPage;
  }

  get pageWidth(): number {
    return this.sheetWidth / 2;
  }

  get pageHeight(): number {
    return this.sheetHeight / 2;
  }

  get sheetCount(): number {
    return Math.ceil(this.length / 8);
  }

  renderPage(pageNumber: number): Document {
    if (pageNumber > this.length) {
      throw new Error("Page number is outside book length");
    }

    const polylines = this.renderPageFn({
      pageNumber: pageNumber,
      width: this.pageWidth,
      height: this.pageHeight
    });

    return {
      polylines,
      width: this.pageWidth,
      height: this.pageHeight,
      units: this.units
    };
  }

  renderSheet(sheetNumber: number, isFront: boolean): Document {
    const pageNumbers = fourPageImposition(sheetNumber, isFront, this.sheetsInSignature);

    const pages = pageNumbers.map(n => {
      if (n >= this.length) {
        return [] as Polyline[];
      }

      return this.renderPage(n + 1).polylines;
    });

    pages[1] = translate(pages[1], [this.pageWidth, 0]);
    pages[2] = flip(pages[2], [this.pageWidth, this.pageHeight]);
    pages[2] = translate(pages[2], [0, this.pageHeight]);
    pages[3] = flip(pages[3], [this.pageWidth, this.pageHeight]);
    pages[3] = translate(pages[3], [this.pageWidth, this.pageHeight]);

    const polylines = pages.reduce((flat, page) => [...flat, ...page], [] as Polyline[]);

    return {
      polylines,
      width: this.sheetWidth,
      height: this.sheetHeight,
      units: this.units
    };
  }
}
