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
    const deactivateHighlighting = (event: Event) => {
      if (lastEditorMode == AnnotationEditorType.NONE) {
        console.trace("Highlight mode not active; ignoring");
        return;
      }

      if (highlightButton.getAttribute("aria-expanded") === "true") {
        console.trace("Deactivating highlight mode");
        highlightButton.click();
      } else {
        console.trace("Highlight button already closed");
      }

      // eventBus.dispatch("switchannotationeditormode", {
      //   source: "bootstrap",
      //   mode: AnnotationEditorType.NONE,
      // });
    };

    document.addEventListener("pointerdown", event => {
      // Ignore double clicks since they open marks
      if (event.detail > 1) {
        console.trace("Ignoring double click event");
        return;
      }

      const target = event.target as HTMLElement;
      if (
        target.closest("#dialogContainer") ||
        target.closest('[role="toolbar"]') ||
        target.closest('[role="mark"]')
      ) {
        console.trace("Click inside dialog, toolbar, or mark; ignoring");
        return;
      }

      deactivateHighlighting(event);
      // We also must fire pointer up so a user could not hold and draw
      const myPointerUp = new PointerEvent("pointerup", {
        bubbles: true,
        cancelable: true,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
      });
      target.dispatchEvent(myPointerUp);
    });

    document.addEventListener("keydown", event => {
      // Ignore if typing in a text input or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        console.trace("Ignoring keydown event in editable element");
        return;
      }

      deactivateHighlighting(event);
    });
  } else {
    console.error("Could not find highlight button");
  }
}
