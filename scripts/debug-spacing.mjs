import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

const { parseJpsEvents, translate } = await import("../lib/translate.ts");

const input = await readFile(path.join(workspaceRoot, "public/jps-files/memory-from-cats.jps"), "utf8");
const localSvg = translate(input);
const oracleSvg = await readFile(path.join(workspaceRoot, "oracle-cache/jps-files/memory-from-cats.jps.svg"), "utf8");
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
