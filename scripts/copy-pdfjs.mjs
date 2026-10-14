// Copies pdf.js's worker, fonts and decoders to /public/pdfjs so the resource reader serves them statically.
import { cpSync, mkdirSync } from "node:fs";
const from = "node_modules/pdfjs-dist";
const to = "public/pdfjs";
mkdirSync(to, { recursive: true });
cpSync(`${from}/build/pdf.worker.min.mjs`, `${to}/pdf.worker.min.mjs`);
for (const dir of ["cmaps", "standard_fonts", "wasm"]) cpSync(`${from}/${dir}`, `${to}/${dir}`, { recursive: true });
