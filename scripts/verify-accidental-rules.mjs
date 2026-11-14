import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const { checkAccidentalRules } = await import("../lib/accidental-rules.ts");
const { transposeScriptByAdjustment } = await import("../lib/transpose-core.mjs");

const invalidExample = 'Q:| 1//1#//1//1#//1/1//1#//1//1#//1/1//1#//2#//4//| 1 2 3 2 |';
const violations = checkAccidentalRules(invalidExample);
assert.deepEqual(
  violations.map(({ note }) => note),
  ["1", "1", "1", "1", "1", "1"],
  "bare repetitions after a sharp should be highlighted until natural signs are added",
);

const correctedExample = 'Q:| 1//1#//1=//1#//1=/1=//1#//1=//1#//1=/1=//1#//2#//4//| 1 2 3 2 |';
assert.equal(
  checkAccidentalRules(correctedExample).length,
  0,
  "explicit naturals and barline resets should satisfy the accidental rule",
);

assert.deepEqual(
  checkAccidentalRules('Q:|1# 1= 1|1 1# "1 1"|\nB: 1# 1'),
  [],
  "natural signs, barlines, quoted text, and non-melody lines should not be flagged",
);

assert.deepEqual(
  checkAccidentalRules("Q:|2$ 2|2|").map(({ note }) => note),
  ["2"],
  "flat carry should be checked and reset at the barline",
);

const transposeSource = await readFile(
  new URL("../public/100首练习/0008-秋樱-山下伶.jps", import.meta.url),
  "utf8",
);
const transposedSource = transposeScriptByAdjustment(transposeSource, -4);
assert.equal(
  checkAccidentalRules(transposedSource).length,
  0,
  "transposed notes should spell repeated alterations explicitly and pass the rule check",
);

console.log("Verified accidental-rule checks.");
