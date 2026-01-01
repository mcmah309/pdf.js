import { PdfController } from "./controller";
import { PDFViewerApplication } from "../../web/app.js";
import { AnnotationEditorType } from "../../src/shared/util.js";

function hidePdfjsEditorModeButtons(): void {
  [
    "#editorModeButtons",
    "#editorModeSeparator",
    "#pageRotateCw",
    "#pageRotateCcw",
    "#download",
    // ".toolbar",
    "#documentPropertiesDialog",
    "#altTextDialog",
    "#printServiceDialog",
  ].forEach(item => {
    const element = document.querySelector(item) as HTMLElement;
    if (element) {
      element.style.display = "none";
      const nextDiv = element.nextElementSibling as HTMLElement;
      if (nextDiv && nextDiv.classList.contains("horizontalToolbarSeparator")) {
        nextDiv.style.display = "none";
      }
    } else {
      console.error(`Could not find element with selector '${item}' to hide.`);
    }
  });
}

export function preScript(): void {
  hidePdfjsEditorModeButtons();
}

export function postScript(): void {
  const eventBus = PDFViewerApplication.eventBus;
  eventBus._on("documentloaded", async () => {
    PdfController._isReady = true;
    console.trace("PdfController READY");
  });
  let lastEditorMode: number = AnnotationEditorType.NONE;
  let isCurrentlyEditing: boolean = false;
  eventBus._on("annotationeditormodechanged", (event: any) => {
    let mode = event?.mode;
    if (mode == undefined) {
      console.error("No mode in annotationeditormodechanged event");
      return;
    }
    lastEditorMode = mode;
  });
  eventBus._on("annotationeditorstateschanged", (event: any) => {
    let isEditing = event?.details?.isEditing;
    if (isEditing == undefined) {
      console.error("No isEditing in annotationeditorstateschanged event");
      return;
    }
    isCurrentlyEditing = isEditing;
  });
  const highlightButton = document.getElementById("editorHighlightButton");
  if (highlightButton) {
    document.addEventListener("click", event => {
      if (lastEditorMode == AnnotationEditorType.NONE) {
        return;
      }

      // Ignore double clicks since they open marks
      if (event.detail > 1) {
        return;
      }

      const target = event.target as HTMLElement;
      if (
        target.closest("#dialogContainer") ||
        target.closest('[role="toolbar"]') ||
        target.closest('[role="mark"]')
      ) {
        return;
      }

      if (highlightButton.getAttribute("aria-expanded") === "true") {
        highlightButton.click();
      }

      // eventBus.dispatch("switchannotationeditormode", {
      //   source: "bootstrap",
      //   mode: AnnotationEditorType.NONE,
      // });
    });
  } else {
    console.error("Could not find highlight button");
  }
}
