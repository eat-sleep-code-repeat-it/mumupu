import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const { checkScriptRules } = await import("../lib/accidental-rules.ts");
const { transposeScriptByAdjustment } = await import("../lib/transpose-core.mjs");

const invalidExample = 'Q:| 1//1#//1//1#//1/1//1#//1//1#//1/1//1#//2#//4//| 1 2 3 2 |';
const violations = checkScriptRules(invalidExample);
assert.deepEqual(
  violations.filter(({ kind }) => kind === "accidental").map(({ text }) => text),
  ["1", "1", "1", "1", "1", "1"],
  "bare repetitions after a sharp should be highlighted until natural signs are added",
);

const correctedExample = 'Q:| 1//1#//1=//1#//1=/1=//1#//1=//1#//1=/1=//1#//2#//4//| 1 2 3 2 |';
assert.equal(
  checkScriptRules(correctedExample).length,
  0,
  "explicit naturals and barline resets should satisfy the accidental rule",
);

assert.deepEqual(
  checkScriptRules('Q:|1# 1= 1|1 1# "1 1"|\nB: 1# 1'),
  [],
  "natural signs, barlines, quoted text, and non-melody lines should not be flagged",
);

assert.deepEqual(
  checkScriptRules("Q:|2$ 2|2|").filter(({ kind }) => kind === "accidental").map(({ text }) => text),
  ["2"],
  "flat carry should be checked and reset at the barline",
);

const transposeSource = await readFile(
  new URL("../public/100首练习/0008-秋樱-山下伶.jps", import.meta.url),
  "utf8",
);
const transposedSource = transposeScriptByAdjustment(transposeSource, -4);
const sourceIssues = checkScriptRules(transposeSource);
const transposedIssues = checkScriptRules(transposedSource);
assert.equal(
  transposedIssues.filter(({ kind }) => kind === "accidental").length,
  0,
  "transposed notes should spell repeated alterations explicitly without accidental warnings",
);
assert.deepEqual(
  transposedIssues.filter(({ kind }) => kind !== "accidental").map(({ kind, text }) => [kind, text]),
  sourceIssues.filter(({ kind }) => kind !== "accidental").map(({ kind, text }) => [kind, text]),
  "transposition should preserve bracket and quote issues",
);

const balancedStructure = String.raw`Q:| (1 [2 {3} ] 4) "note ( [ { and \"quoted\"" |
Q:(1
Q:1)`;
assert.equal(
  checkScriptRules(balancedStructure).length,
  0,
  "paired brackets may span lines, and quoted or escaped delimiters should be ignored",
);

const unpairedStructure = 'Q:|1)|\nB: "unfinished\nC: {lyric';
assert.deepEqual(
  checkScriptRules(unpairedStructure).map(({ kind, text }) => [kind, text]),
  [["bracket", ")"], ["quote", "\""], ["bracket", "{"]],
  "unpaired closing brackets, quotes, and opening brackets should all be reported",
);

assert.equal(
  checkScriptRules('Q:|["B" 3, - - (4#, |:] 7,) 7,&dy1#&dy1#&dy |').length,
  0,
  "square brackets may pair across a barline even when crossing a parenthesis pair",
);

assert.equal(
  checkScriptRules("Q:|[1|\nQ:2]|").length,
  0,
  "square brackets may pair across script lines",
);

assert.equal(
  checkScriptRules("Q:|([)]|").length,
  0,
  "bracket pairs are matched by type rather than requiring nesting across types",
);

console.log("Verified script rule checks.");
