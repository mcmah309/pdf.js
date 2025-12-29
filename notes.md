# Notes

Notes related to understanding the repo structure and inner workings of this project

## Structure

- `src/` contains the inner code for viewing the pdf and plumbing. This is what the semver is based on
- `web/` contains the code built on top of `src/` that has an actual working pdf viewer with features outside just rendering like annotations

## Developing

Gulp is a task runner/toolkit and running 
```bash
npx gulp server
```
will launch the server (`/gulpfile.mjs` task "server") to use the viewer. Make sure to use `npx` not `bunx` as I obsereved that the localization does not work. e.g. for `data-l10n-id="pdfjs-bookmark-button-label"` the server does not look up and add the correct localization ("Current Page" in `l10n/`) for this id so all buttons etc have no labels.

## `web/`

`viewer.html` contains the entry point for the viewer application. Each feature is associated with an id. e.g. `id="viewsManagerHeader"`. These ids are used by the `viewer.js` script to configure features.