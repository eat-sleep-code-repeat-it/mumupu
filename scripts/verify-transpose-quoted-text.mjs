import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { transposeScriptByAdjustment } from "../lib/transpose-core.mjs";

const scriptPath = new URL("../public/songs-ai-jin-100/069-秋樱.jps", import.meta.url);
const script = await readFile(scriptPath, "utf8");
const transposed = transposeScriptByAdjustment(script, 1);
const quotedText = (content) => [...content.matchAll(/"([^"]*)"/g)].map((match) => match[0]);

assert.deepEqual(
  quotedText(transposed),
  quotedText(script),
  "quoted text, including temporary time signatures, should remain unchanged",
);
assert.match(script, /"p:4\/4"/, "the fixture should exercise the reported quoted time signature");
assert.notEqual(transposed, script, "notes outside quoted text should still transpose");

console.log("Verified quoted text remains unchanged during transposition.");
