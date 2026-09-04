import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

const { parseJpsEvents, translate } = await import("../lib/translate.ts");

const input = await readFile(path.join(workspaceRoot, "public/jps-files/memory-from-cats.jps"), "utf8");
const localSvg = translate(input);
const oracleSvg = await readFile(path.join(workspaceRoot, "oracle-cache/jps-files/memory-from-cats.jps.svg"), "utf8");

const firstRawDifference = Array.from({ length: Math.max(localSvg.length, oracleSvg.length) }, (_, index) => index)
  .find((index) => localSvg[index] !== oracleSvg[index]);
if (firstRawDifference !== undefined) {
  console.log("first raw difference:", firstRawDifference);
  console.log("local raw context:", JSON.stringify(localSvg.slice(Math.max(0, firstRawDifference - 80), firstRawDifference + 160)));
  console.log("oracle raw context:", JSON.stringify(oracleSvg.slice(Math.max(0, firstRawDifference - 80), firstRawDifference + 160)));
}
const parsedEvents = parseJpsEvents(input);

function attributes(tag) {
  return Object.fromEntries(Array.from(tag.matchAll(/([\w:-]+)="([^"]*)"/g), (match) => [match[1], match[2]]));
}

function extract(svg, tagName, predicate = () => true) {
  return Array.from(svg.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g")), (match) => attributes(match[0])).filter(predicate);
}

function coordinate(value) {
  return value === undefined ? null : Number(value);
}

function summarizeRows(elements, yAttribute) {
  return Map.groupBy(elements, (element) => element[yAttribute] ?? "unknown");
}

function compare(label, localElements, oracleElements, fields) {
  console.log(`\n${label}: local=${localElements.length}, oracle=${oracleElements.length}`);
  const count = Math.min(localElements.length, oracleElements.length);
  let differences = 0;
  let exact = 0;
  let totalError = 0;
  const rowStats = new Map();
  for (let index = 0; index < count; index += 1) {
    const local = localElements[index];
    const oracle = oracleElements[index];
    const error = Math.max(...fields.map((field) => Math.abs(coordinate(local[field]) - coordinate(oracle[field]))));
    const changed = error > 0.00001;
    totalError += error;
    exact += changed ? 0 : 1;
    const row = oracle.y ?? oracle.y1 ?? "unknown";
    const stat = rowStats.get(row) ?? { exact: 0, count: 0, error: 0 };
    stat.count += 1;
    stat.exact += changed ? 0 : 1;
    stat.error += error;
    rowStats.set(row, stat);
    if (changed && differences < 20) {
      console.log(`  ${index}: local ${fields.map((field) => `${field}=${local[field]}`).join(" ")} | oracle ${fields.map((field) => `${field}=${oracle[field]}`).join(" ")}`);
      differences += 1;
    }
  }
  console.log(`  reported differences=${differences}${differences === 20 ? "+" : ""}; exact=${exact}/${count}; mean-error=${totalError / count}`);
  console.log(`  rows=${Array.from(rowStats, ([row, stat]) => `${row}:${stat.exact}/${stat.count}@${(stat.error / stat.count).toFixed(3)}`).join(" ")}`);
}

const isScoreNote = (element) => /^shuzi_b_/.test(element["xlink:href"]?.slice(1) ?? "") && element.notepos;
const isBar = (element) => ["#xiaojiexian", "#jieshufu"].includes(element["xlink:href"]);
const localNotes = extract(localSvg, "use", isScoreNote);
const oracleNotes = extract(oracleSvg, "use", isScoreNote);
const localBars = extract(localSvg, "use", isBar);
const oracleBars = extract(oracleSvg, "use", isBar);
const localBeams = extract(localSvg, "line", (element) => element["data-type"] === "jianshixian");
const oracleBeams = extract(oracleSvg, "line", (element) => element["data-type"] === "jianshixian");
const localSlurs = extract(localSvg, "path", (element) => element.d?.startsWith("M "));
const oracleSlurs = extract(oracleSvg, "path", (element) => element.d?.startsWith("M "));

compare("notes", localNotes, oracleNotes, ["x", "y"]);
compare("bars", localBars, oracleBars, ["x", "y"]);
compare("beams", localBeams, oracleBeams, ["x1", "x2", "y1"]);
console.log(`\nslurs: local=${localSlurs.length}, oracle=${oracleSlurs.length}`);
localSlurs.forEach((slur, index) => {
  if (slur.d !== oracleSlurs[index]?.d) {
    console.log(`  ${index}:\n    local  ${slur.d}\n    oracle ${oracleSlurs[index]?.d}`);
  }
});

console.log("\nnotes per row (local):", Object.fromEntries(Array.from(summarizeRows(localNotes, "y"), ([y, notes]) => [y, notes.length])));

const oracleScoreEvents = extract(oracleSvg, "use", (element) => element.notepos);
const oracleRows = Map.groupBy(oracleScoreEvents, (element) => element.notepos.split("_")[1]);
const localScoreEvents = extract(localSvg, "use", (element) => element.notepos);
const localRows = Map.groupBy(localScoreEvents, (element) => element.notepos.split("_")[1]);
const parsedByPosition = new Map(parsedEvents.map((event) => [event.notepos, event]));

console.log("\ninferred natural-width units:");
const residuals = new Map();
for (const [row, elements] of oracleRows) {
  const transitions = elements.slice(1).map((element, index) => ({
    distance: Number(element.x) - Number(elements[index].x),
    isFixedClosingBar: Number(element.x) === 923 && ["#xiaojiexian", "#jieshufu"].includes(element["xlink:href"]),
  }));
  const distances = transitions.filter((transition) => !transition.isFixedClosingBar).map((transition) => transition.distance);
  let best = null;
  for (let scaledTotalUnits = 400; scaledTotalUnits <= 3500; scaledTotalUnits += 1) {
    const totalUnits = scaledTotalUnits / 5;
    const scale = 854 / totalUnits;
    const error = distances.reduce((sum, distance) => {
      const units = distance / scale;
      return sum + Math.abs(units * 5 - Math.round(units * 5));
    }, 0);
    if (!best || error < best.error) {
      best = { totalUnits, scale, error };
    }
  }
  console.log(`\nROW ${row}: units=${best.totalUnits} scale=${best.scale} error=${best.error}`);
  let measureTime = 0;
  elements.slice(0, -1).forEach((element, index) => {
    const event = parsedByPosition.get(element.notepos);
    const nextEvent = parsedByPosition.get(elements[index + 1].notepos);
    const next = elements[index + 1];
    const units = (Number(next.x) - Number(element.x)) / best.scale;
    const fixedClosingBar = Number(next.x) === 923 && ["#xiaojiexian", "#jieshufu"].includes(next["xlink:href"]);
    console.log(`${element.notepos} ${event?.type ?? "?"}:${event?.code ?? "?"} time=${event?.time ?? "?"} -> ${fixedClosingBar ? "[fixed closing bar]" : units.toFixed(5)}`);
    if (!fixedClosingBar && event && nextEvent && event.type !== "bar") {
      measureTime += event.time;
      const base = 1 + event.time * 2 + (event.time < 1 && Number.isInteger(measureTime) ? 1 : 0) - (nextEvent.type === "bar" ? 0.2 : 0);
      const signature = `${event.type}:${event.pitch ?? "-"}:${event.durationMark || "whole"}:${event.accidental || "-"}:${event.octave}:s${event.slurStartCount ?? 0}e${event.slurEndCount ?? 0} -> ${nextEvent.type}:${nextEvent.pitch ?? "-"}:${nextEvent.accidental || "-"}:${nextEvent.octave}:s${nextEvent.slurStartCount ?? 0}e${nextEvent.slurEndCount ?? 0}`;
      const residual = Math.round((units - base) * 5) / 5;
      const key = `${signature} residual=${residual}`;
      residuals.set(key, (residuals.get(key) ?? 0) + 1);
    } else if (event?.type === "bar") {
      measureTime = 0;
    }
  });
}

console.log("\nresidual signatures:");
Array.from(residuals).sort((left, right) => right[1] - left[1]).forEach(([signature, count]) => console.log(`${count}x ${signature}`));

console.log("\nlocal unit deltas:");
for (const [row, oracleElements] of oracleRows) {
  const localElements = localRows.get(row);
  if (!localElements || oracleElements.length < 2 || localElements.length !== oracleElements.length) continue;
  const firstEvent = parsedByPosition.get(oracleElements[0].notepos);
  const firstOracleAdvance = Number(oracleElements[1].x) - Number(oracleElements[0].x);
  const firstNaturalWidth = firstEvent?.type === "bar"
    ? 2.8 + (firstEvent.annotation?.startsWith("p:") ? 2 : 0) + (parsedByPosition.get(oracleElements[1].notepos)?.accidental ? 0.4 : 0)
    : null;
  if (!firstNaturalWidth) continue;
  const oracleScale = firstOracleAdvance / firstNaturalWidth;
  const localScale = (Number(localElements[1].x) - Number(localElements[0].x)) / firstNaturalWidth;
  const deltas = [];
  for (let index = 0; index < oracleElements.length - 1; index += 1) {
    if (Number(oracleElements[index + 1].x) === 923) continue;
    const oracleUnits = (Number(oracleElements[index + 1].x) - Number(oracleElements[index].x)) / oracleScale;
    const localUnits = (Number(localElements[index + 1].x) - Number(localElements[index].x)) / localScale;
    const delta = Math.round((localUnits - oracleUnits) * 5) / 5;
    if (delta !== 0) {
      const event = parsedByPosition.get(oracleElements[index].notepos);
      const nextEvent = parsedByPosition.get(oracleElements[index + 1].notepos);
      deltas.push(`${event?.code}->${nextEvent?.code}:${delta}`);
    }
  }
  console.log(`ROW ${row}: localTotal=${(854 / localScale).toFixed(1)} oracleTotal=${(854 / oracleScale).toFixed(1)} ${deltas.join(" ")}`);
}

function beamRanges(svg, minimumY) {
  const notes = extract(svg, "use", isScoreNote);
  const beams = extract(svg, "line", (element) => element["data-type"] === "jianshixian" && Number(element.y1) >= minimumY);
  return beams.map((beam) => {
    const rowNotes = notes.filter((note) => Number(note.y) + 13 === Number(beam.y1));
    const nearest = (x) => rowNotes.reduce((best, note) => Math.abs(Number(note.x) - x) < Math.abs(Number(best.x) - x) ? note : best);
    const start = nearest(Number(beam.x1) + 6);
    const end = nearest(Number(beam.x2) - 6);
    return `${beam.y1}:${start.notepos}-${end.notepos}`;
  });
}

console.log("\nbeam ranges local:", beamRanges(localSvg, 1059).join(" "));
console.log("beam ranges oracle:", beamRanges(oracleSvg, 1059).join(" "));
const allLocalBeamRanges = beamRanges(localSvg, 0);
const allOracleBeamRanges = beamRanges(oracleSvg, 0);
console.log("beam ranges local-only:", allLocalBeamRanges.filter((range) => !allOracleBeamRanges.includes(range)).join(" "));
console.log("beam ranges oracle-only:", allOracleBeamRanges.filter((range) => !allLocalBeamRanges.includes(range)).join(" "));

function elementSignatures(svg) {
  const body = svg.slice(svg.indexOf("</defs>") + 7);
  return Array.from(body.matchAll(/<(use|line|path|text)\b[^>]*>/g), (match) => {
    const attrs = attributes(match[0]);
    return [match[1], attrs["xlink:href"], attrs.notepos, attrs.code, attrs["data-type"], attrs.cipos].filter(Boolean).join(":");
  });
}

const localSignatures = elementSignatures(localSvg);
const oracleSignatures = elementSignatures(oracleSvg);
console.log(`\nelement signatures: local=${localSignatures.length} oracle=${oracleSignatures.length}`);
for (let index = 0; index < Math.max(localSignatures.length, oracleSignatures.length); index += 1) {
  if (localSignatures[index] !== oracleSignatures[index]) {
    console.log(`first signature difference ${index}: local=${localSignatures[index]} oracle=${oracleSignatures[index]}`);
    console.log("local signature window:", localSignatures.slice(Math.max(0, index - 5), index + 12).join(" | "));
    console.log("oracle signature window:", oracleSignatures.slice(Math.max(0, index - 5), index + 12).join(" | "));
    break;
  }
}
const localOnlySignatures = localSignatures.filter((signature) => !oracleSignatures.includes(signature));
const oracleOnlySignatures = oracleSignatures.filter((signature) => !localSignatures.includes(signature));
console.log("element signatures local-only:", localOnlySignatures.join(" "));
console.log("element signatures oracle-only:", oracleOnlySignatures.join(" "));
const signatureCounts = (signatures) => signatures.reduce((counts, signature) => counts.set(signature, (counts.get(signature) ?? 0) + 1), new Map());
const localSignatureCounts = signatureCounts(localSignatures);
const oracleSignatureCounts = signatureCounts(oracleSignatures);
console.log("element count differences:", Array.from(new Set([...localSignatures, ...oracleSignatures]))
  .filter((signature) => localSignatureCounts.get(signature) !== oracleSignatureCounts.get(signature))
  .map((signature) => `${signature}:local=${localSignatureCounts.get(signature) ?? 0},oracle=${oracleSignatureCounts.get(signature) ?? 0}`)
  .join(" "));
console.log("text signature indices local:", localSignatures.map((signature, index) => signature === "text" ? index : -1).filter((index) => index >= 0).join(" "));
console.log("text signature indices oracle:", oracleSignatures.map((signature, index) => signature === "text" ? index : -1).filter((index) => index >= 0).join(" "));
const noteUses = (svg) => Array.from(svg.matchAll(/<use\b[^>]*\bnotepos="[^"]+"[^>]*>/g), (match) => match[0]);
const localNoteUses = noteUses(localSvg);
const oracleNoteUses = noteUses(oracleSvg);
const noteAttributeDifferences = [];
for (let index = 0; index < Math.min(localNoteUses.length, oracleNoteUses.length); index += 1) {
  const localAttributes = attributes(localNoteUses[index]);
  const oracleAttributes = attributes(oracleNoteUses[index]);
  for (const name of new Set([...Object.keys(localAttributes), ...Object.keys(oracleAttributes)])) {
    if (localAttributes[name] !== oracleAttributes[name]) {
      noteAttributeDifferences.push(`${index}:${name}:local=${localAttributes[name]},oracle=${oracleAttributes[name]}`);
    }
  }
}
console.log("note attribute differences:", noteAttributeDifferences.slice(0, 80).join(" | "));
console.log("note attribute difference count:", noteAttributeDifferences.length);
console.log("opening note audio:", localNoteUses.slice(0, 80).map((tag, index) => {
  const localAttributes = attributes(tag);
  const oracleAttributes = attributes(oracleNoteUses[index]);
  return `${index}:${localAttributes.notepos}:${localAttributes.code}:${localAttributes.audio}->${oracleAttributes.audio}`;
}).join(" | "));
console.log("remaining audio exceptions:", [294, 296].map((index) => {
  const localAttributes = attributes(localNoteUses[index]);
  const oracleAttributes = attributes(oracleNoteUses[index]);
  return `${index}:${localAttributes.notepos}:${localAttributes.code}:${localAttributes.audio}->${oracleAttributes.audio}`;
}).join(" | "));
const renderedTags = (svg) => Array.from(svg.matchAll(/<(?:use|line|path|text)\b[^>]*>/g), (match) => match[0]);
const localRenderedTags = renderedTags(localSvg);
const oracleRenderedTags = renderedTags(oracleSvg);
const renderedAttributeDifferences = [];
for (let index = 0; index < Math.min(localRenderedTags.length, oracleRenderedTags.length); index += 1) {
  const localAttributes = attributes(localRenderedTags[index]);
  const oracleAttributes = attributes(oracleRenderedTags[index]);
  for (const name of new Set([...Object.keys(localAttributes), ...Object.keys(oracleAttributes)])) {
    if (localAttributes[name] !== oracleAttributes[name]) {
      renderedAttributeDifferences.push(`${index}:${name}:local=${localAttributes[name]},oracle=${oracleAttributes[name]}`);
    }
  }
}
console.log("rendered attribute differences:", renderedAttributeDifferences.join(" | "));
console.log("rendered attribute difference count:", renderedAttributeDifferences.length);
const numericDifferencePairs = new Set();
for (let index = 0; index < Math.min(localRenderedTags.length, oracleRenderedTags.length); index += 1) {
  const localNumbers = localRenderedTags[index].match(/-?\d+(?:\.\d+)?/g) ?? [];
  const oracleNumbers = oracleRenderedTags[index].match(/-?\d+(?:\.\d+)?/g) ?? [];
  if (localNumbers.length !== oracleNumbers.length) continue;
  localNumbers.forEach((value, numberIndex) => {
    if (value !== oracleNumbers[numberIndex]) {
      numericDifferencePairs.add(`${value}->${oracleNumbers[numberIndex]}`);
    }
  });
}
console.log("unique numeric differences:", Array.from(numericDifferencePairs).join(" "));

const glyphOrder = (svg) => Array.from(svg.matchAll(/<g id="([^"]+)"/g), (match) => match[1]);
console.log("glyph order local:", glyphOrder(localSvg).join(" "));
console.log("glyph order oracle:", glyphOrder(oracleSvg).join(" "));
