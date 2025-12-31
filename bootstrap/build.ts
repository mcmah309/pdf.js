#!/usr/bin/env bun

// Build script using Bun's native bundler
await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'browser',
  format: 'esm',
  minify: false,
  sourcemap: 'none',
  external: ['../../web/*', 'web-*', 'pdfjs*'],
});

console.log('Build complete! Generated dist/index.js');
