import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "My context window filled up with the deadline reminder, so there was no room left for the deadline itself.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "";
if (outDir === "") {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 200) {
  throw new Error(`entry must be 1-200 characters, got ${codePoints}`);
}
if (LINE.trim() === "") {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE !== LINE.trimEnd()) {
  throw new Error("entry must not end with a trailing newline");
}
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength > 200) {
  throw new Error(`entry must fit 200 bytes, got ${byteLength}`);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

const roundTrip = readFileSync(target, "utf8");
if (roundTrip !== LINE) {
  throw new Error("read-back differs from the entry line");
}
