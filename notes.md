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

###
The application is highly integrated between elements with the correct ids existing in `viewer.html`, getting these elements for configuration in `viewer.js` (and even some other places in the code directly checking if elements exist in the ui). Based on the existence of the these elements (various checks during initialization on during processing) and some setting overrides in `app_options.js`, the features are configured to work. It is not directly which elements depend on eachother. E.g. a feature may only be enabled if multiple elements exist if different parts of the ui. This all results a confusing web conditions and makes the code here very integrated with the current viewer layer layout. Conclusion: Instead of trying to rip things apart, which may or may not work, likely resulting in bugs if so (and makes it hard to merge upstream changes). I've decided to just hide the functionality be don't need with `hidden` and only do the minimal changes we need. Thus `viewer.js` will remain unchanged and only some elments in `viewer.html` will be slightly altered.