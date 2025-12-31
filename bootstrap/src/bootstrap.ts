import { PdfController } from "./controller";
import { PDFViewerApplication } from "../../web/app.js";

function hidePdfjsEditorModeButtons(): void {
  [
    "#editorModeButtons",
    "#editorModeSeparator",
    "#pageRotateCw",
    "#pageRotateCcw",
    "#download",
  ].forEach(item => {
    const element = document.querySelector(item) as HTMLElement;
    if (element) {
      element.style.display = "none";
      const nextDiv = element.nextElementSibling as HTMLElement;
      if (nextDiv && nextDiv.classList.contains("horizontalToolbarSeparator")) {
        nextDiv.style.display = "none";
      }
    }
  });
}




export function preScript(): void {
    hidePdfjsEditorModeButtons();
}

export function postScript(): void {
    const eventBus = PDFViewerApplication.eventBus;
    if (eventBus) {
        eventBus._on("documentloaded", async () => {
            // todo bind methods
            PdfController._isReady = true;
        });
    }
}
