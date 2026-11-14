import assert from "node:assert/strict";
import sharp from "sharp";

import {
  buildJpsFromOcr,
  MAX_PNG_BYTES,
  parsePngToJps,
  preprocessPngForOcr,
  PngToJpsError,
} from "../lib/png-to-jps.ts";

const script = buildJpsFromOcr(
  "demo.png",
  "4=4\n|1 2/3 | 4 - 0|\nnoise without a bar\n|5# 6 7|",
);

assert.match(script, /^B: demo$/m);
assert.match(script, /^Q: \|1 2\/3 \| 4 - 0\|$/m);
assert.match(script, /^Q: \|5# 6 7\|$/m);
assert.doesNotMatch(script, /4=4|noise/);

assert.throws(
  () => buildJpsFromOcr("empty.png", "1 2 3"),
  /OCR did not find any note rows/,
);
const safeNameScript = buildJpsFromOcr("..\\..\\bad.png", "|1 2|");
assert.match(safeNameScript, /^B: bad$/m);

const tinyPng = await sharp({
  create: { width: 10, height: 12, channels: 3, background: "#ffffff" },
}).png().toBuffer();
const enhancedPng = await preprocessPngForOcr(tinyPng);
const enhancedMetadata = await sharp(enhancedPng).metadata();
assert.equal(enhancedMetadata.width, 20);
assert.equal(enhancedMetadata.height, 24);

await assert.rejects(
  parsePngToJps(Buffer.from("not a PNG"), "invalid.png"),
  (error) => error instanceof PngToJpsError && error.status === 400,
);
await assert.rejects(
  parsePngToJps(Buffer.alloc(MAX_PNG_BYTES + 1), "large.png"),
  (error) => error instanceof PngToJpsError && error.status === 413,
);

console.log("PNG-to-JPS draft checks passed.");
