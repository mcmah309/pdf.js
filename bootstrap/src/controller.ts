import { PDFViewerApplication } from "../../web/app.js";
import * as pdfjsLib from "../../src/pdf.js";

export class PdfController {
    static _isReady = false;
    static _pdfViewerApplication = PDFViewerApplication;
    static _pdfjsLib = pdfjsLib;
    
    static getCurrentPage(): number {
        return this._pdfViewerApplication.page;
    }
}