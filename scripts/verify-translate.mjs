import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const sourceName = process.argv.includes("--songs") ? "songs" : "jps-files";
const publicJpsDir = path.join(workspaceRoot, "public", sourceName);
const fixtureDirectoryNames = ["jps-files", "songs"];
const oracleCacheDirs = fixtureDirectoryNames.map((directory) => path.join(workspaceRoot, "oracle-cache", directory));

const { parseJps, parseJpsEvents, translate } = await import("../lib/translate.ts");

function extractSvgTitle(svg) {
  const match = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return match?.[1]?.trim() ?? null;
}

function hasNotationGlyphs(svg) {
  return svg.includes('href="#shuzi_b_') || svg.includes('xlink:href="#shuzi_b_');
}

function notationGlyphSequence(svg) {
  return [...svg.matchAll(/<use\b[^>]*xlink:href="#([^"]+)"/g)].map((match) => match[1]);
}

function normalizeSvgForParity(svg) {
  return svg
    .replace(/\r\n?/g, "\n")
    .replace(/<([a-z]+)([^>]*)\/>/g, (_match, tag, attributes) => `<${tag}${attributes.trimEnd()}></${tag}>`)
    .replace(/\s+>/g, ">");
}

function firstDifferingByte(actual, expected) {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  const sharedLength = Math.min(actualBytes.length, expectedBytes.length);

  for (let index = 0; index < sharedLength; index += 1) {
    if (actualBytes[index] !== expectedBytes[index]) {
      return index;
    }
  }

  return actualBytes.length === expectedBytes.length ? -1 : sharedLength;
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
    return null;
  }
}

async function readPublicFixture(fileName, directories) {
  for (const directory of directories) {
    const input = await readOptional(path.join(workspaceRoot, "public", directory, fileName));
    if (input !== null) {
      return input;
    }
  }

  throw new Error(`no public fixture found for ${fileName} in ${directories.join(", ")}`);
}

async function readCachedSvg(fileName, input) {
  for (const directory of oracleCacheDirs) {
    const oracleSvg = await readOptional(path.join(directory, `${fileName}.svg`));
    if (oracleSvg !== null) {
      return oracleSvg;
    }
  }

  for (const fixture of allFixtures) {
    const aliasName = fixture.fileName;
    const aliasInput = await readFile(fixture.filePath, "utf8");
    if (aliasInput !== input) {
      continue;
    }
    for (const directory of oracleCacheDirs) {
      const oracleSvg = await readOptional(path.join(directory, `${aliasName}.svg`));
      if (oracleSvg !== null) {
        return oracleSvg;
      }
    }
  }

  for (const directory of oracleCacheDirs) {
    const oracleSvg = await readOptional(path.join(directory, `${path.parse(fileName).name}.svg`));
    if (oracleSvg !== null) {
      return oracleSvg;
    }
  }

  throw new Error(`no cached SVG found for ${fileName}`);
}

const failures = [];
let parityMatches = 0;
let missingCaches = 0;
const jpsFiles = (await readdir(publicJpsDir))
  .filter((entry) => entry.endsWith(".jps"))
  .sort();
const allFixtures = (await Promise.all(fixtureDirectoryNames.map(async (directory) => {
  const directoryPath = path.join(workspaceRoot, "public", directory);
  const entries = await readdir(directoryPath);
  return entries
    .filter((entry) => entry.endsWith(".jps"))
    .map((fileName) => ({ fileName, filePath: path.join(directoryPath, fileName) }));
}))).flat();

for (const fileName of jpsFiles) {
  const jpsPath = path.join(publicJpsDir, fileName);
  const input = await readFile(jpsPath, "utf8");
  const parsed = parseJps(input);
  const expectedTitle = (parsed.headerValues.B?.[0] || parsed.header.B || parsed.header.V || path.parse(fileName).name).trim();
  const output = translate(input);
  let expectedSvg;

  try {
    expectedSvg = await readCachedSvg(fileName, input);
  } catch (error) {
    missingCaches += 1;
    failures.push(`${fileName}: cached oracle unavailable (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  if (!output.includes(expectedTitle)) {
    failures.push(`${fileName}: output title does not include ${expectedTitle}`);
  }

  if (!hasNotationGlyphs(output)) {
    failures.push(`${fileName}: output does not look like notation SVG`);
  }

  const expectedSvgTitle = extractSvgTitle(expectedSvg);

  if (expectedSvgTitle !== expectedTitle) {
    failures.push(`${fileName}: cached SVG title ${expectedSvgTitle ?? "<missing>"} does not match JPS title ${expectedTitle}`);
    continue;
  }

  const normalizedOutput = normalizeSvgForParity(output);
  const normalizedExpectedSvg = normalizeSvgForParity(expectedSvg);
  if (normalizedOutput !== normalizedExpectedSvg) {
    const localBytes = Buffer.byteLength(normalizedOutput);
    const cacheBytes = Buffer.byteLength(normalizedExpectedSvg);
    failures.push(`${fileName}: mismatch (local=${localBytes} bytes, cache=${cacheBytes} bytes, firstDiff=${firstDifferingByte(normalizedOutput, normalizedExpectedSvg)})`);
  } else {
    parityMatches += 1;
  }
}

const goldenJpsPath = path.join(workspaceRoot, "public", "100首练习", "0004-金婚曲.jps");
const goldenInput = await readFile(goldenJpsPath, "utf8");
const goldenReference = await readFile(`${goldenJpsPath}.svg`, "utf8");
const goldenOutput = translate(goldenInput);
const goldenEvents = parseJpsEvents(goldenInput);
const actualGlyphSequence = notationGlyphSequence(goldenOutput);
const referenceGlyphSequence = notationGlyphSequence(goldenReference);
if (
  actualGlyphSequence.length !== referenceGlyphSequence.length
  || actualGlyphSequence.some((glyph, index) => glyph !== referenceGlyphSequence[index])
) {
  failures.push("0004-金婚曲.jps: rendered notation glyph sequence differs from its reference SVG");
}
if (
  goldenEvents.filter((event) => event.type === "note").length !== 287
  || goldenEvents.filter((event) => event.articulations?.includes("dy")).length !== 120
  || goldenEvents.filter((event) => event.sustainedOrnament === "tr").length !== 3
) {
  failures.push("0004-金婚曲.jps: notes, staccato marks, or trill marks were not all parsed");
}

if (sourceName === "jps-files") {
  const memoryInput = await readFile(path.join(publicJpsDir, "memory-from-cats.jps"), "utf8");
  const editedMemoryOutput = translate(memoryInput.replace("B: Memory Cats", "B: Live Preview Test"));

  if (!editedMemoryOutput.includes("Live Preview Test")) {
    failures.push("edited memory-from-cats title did not propagate into output");
  }
}

const auxiliaryTimeSignatureInput = [
  "V: 1.0",
  "B: Auxiliary Time Signatures",
  "D: C",
  "P: 4/4 (2/4 1/4)",
  "Q: |1|",
].join("\n");
const auxiliaryTimeSignatureOutput = translate(auxiliaryTimeSignatureInput);
const auxiliaryTimeSignatureGlyphs = [...auxiliaryTimeSignatureOutput.matchAll(/xlink:href="#shuzi_b_bian_(\d+)"/g)]
  .map((match) => match[1]);
if (
  (auxiliaryTimeSignatureOutput.match(/xlink:href="#paihao_xian"/g) ?? []).length !== 3
  || auxiliaryTimeSignatureGlyphs.slice(0, 6).join(",") !== "4,4,2,4,1,4"
) {
  failures.push("parenthesized auxiliary time signatures were not rendered in header order");
}

const lyricAnnotationInput = [
  "V: 1.0",
  "B: Lyric Annotation",
  "D: C",
  "P: 4/4",
  "Q: |1 2 3|",
  'C: "女:_声部"来 来',
].join("\n");
const lyricAnnotationOutput = translate(lyricAnnotationInput);
if (
  !lyricAnnotationOutput.includes('cipos="0_1_2" >\u5973: \u58f0\u90e8</text>')
  || !lyricAnnotationOutput.includes('cipos="0_1_3" >\u6765</text>')
  || !lyricAnnotationOutput.includes('cipos="0_1_4" >\u6765</text>')
) {
  failures.push("quoted lyric annotations or their underscore spaces were not aligned before lyric text");
}

const mixedLyricInput = [
  "V: 1.0",
  "B: Mixed English and Chinese Lyrics",
  "D: C",
  "P: 4/4",
  "Q: |1 2 3 4 0 |5 6 7 1'|",
  "C: \u4f60 do/lai/mi@fa/so/la/xi/",
].join("\n");
const mixedLyricOutput = translate(mixedLyricInput);
if (
  !mixedLyricOutput.includes('cipos="0_1_2" >\u4f60</text>')
  || !mixedLyricOutput.includes('cipos="0_1_3" >do</text>')
  || !mixedLyricOutput.includes('cipos="0_1_4" >lai</text>')
  || !mixedLyricOutput.includes('cipos="0_1_5" >mi</text>')
  || !mixedLyricOutput.includes('cipos="0_1_8" >fa</text>')
  || !mixedLyricOutput.includes('cipos="0_1_11" >xi</text>')
) {
  failures.push("slash-separated English lyric words or mixed Chinese alignment were not preserved");
}

const barAnnotationInput = [
  "V: 1.0",
  "B: Bar Annotations",
  "D: C",
  "P: 4/4",
  "Q: |1 ||&fine 2 ||&dc 3|",
].join("\n");
const barAnnotationEvents = parseJpsEvents(barAnnotationInput);
const barAnnotationBars = barAnnotationEvents.filter((event) => event.type === "bar");
const barAnnotationOutput = translate(barAnnotationInput);
if (
  barAnnotationBars.map((event) => event.barAnnotation ?? "").join(",") !== ",fine,dc,"
  || barAnnotationEvents.some((event) => event.type === "note" && event.code.startsWith("&"))
  || !barAnnotationOutput.includes('data-bar-annotation="fine" >Fine</text>')
  || !barAnnotationOutput.includes('data-bar-annotation="dc" >D.C.</text>')
) {
  failures.push("Fine and D.C. bar annotations were not attached to and rendered with their bars");
}

if (sourceName === "songs") {
  const customBeatInput = await readPublicFixture("abc-examples.jps", ["songs", "abc-spec"]);
  const customBeatEvents = parseJpsEvents(customBeatInput).filter((event) => event.type === "note");
  const joinIndexes = customBeatEvents
    .map((event, index) => event.beatJoinAfter ? index : -1)
    .filter((index) => index >= 0);
  const splitIndexes = customBeatEvents
    .map((event, index) => event.beatSplitAfter ? index : -1)
    .filter((index) => index >= 0);
  if (joinIndexes.join(",") !== "1,3,4" || splitIndexes.join(",") !== "6") {
    failures.push("abc-examples custom beat markers were not parsed on the expected notes");
  }

  const customBeatOutput = translate(customBeatInput);
  const beamLines = [...customBeatOutput.matchAll(/<line x1="([^"]+)"[^>]*x2="([^"]+)"[^>]*data-type="jianshixian"/g)]
    .map((match) => ({ x1: Number(match[1]), x2: Number(match[2]) }));
  if (
    beamLines.length !== 7
    || beamLines[0].x1 !== 112
    || beamLines[0].x2 !== 174
    || beamLines[1].x1 !== 199.5
    || beamLines[1].x2 !== 261.5
  ) {
    failures.push("abc-examples join markers did not produce the expected three-note primary beams");
  }
  if (beamLines[2].x2 - beamLines[2].x1 !== 12 || beamLines[3].x2 - beamLines[3].x1 !== 12) {
    failures.push("abc-examples split marker did not isolate the opening sixteenth beams");
  }
}

console.log(`Checked ${jpsFiles.length} ${sourceName} JPS files: ${parityMatches} parity matches, ${jpsFiles.length - parityMatches - missingCaches} mismatched, ${missingCaches} missing caches`);

if (failures.length > 0) {
  throw new Error(`${sourceName} JPS verification failed:\n- ${failures.join("\n- ")}`);
}

console.log(`Verified ${jpsFiles.length} ${sourceName} JPS files against cached parity${sourceName === "jps-files" ? " and live edit propagation" : ""}${sourceName === "songs" ? ", plus abc-examples custom beat behavior" : ""}`);
