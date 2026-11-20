import assert from "node:assert/strict";
import { DOMParser } from "@xmldom/xmldom";
import {
  convertJpsToMusicXML,
  JpsToMusicXMLConversionError,
} from "../lib/jps-to-musicxml.ts";
const KEY_SETTINGS = {
  C: { fifths: 0, semitoneOffset: 0 },
  G: { fifths: 1, semitoneOffset: -5 },
  D: { fifths: 2, semitoneOffset: 2 },
  A: { fifths: 3, semitoneOffset: -3 },
  E: { fifths: 4, semitoneOffset: 4 },
  B: { fifths: 5, semitoneOffset: -1 },
  "F#": { fifths: 6, semitoneOffset: 6 },
  F: { fifths: -1, semitoneOffset: 5 },
  Bb: { fifths: -2, semitoneOffset: -2 },
  Eb: { fifths: -3, semitoneOffset: 3 },
  Ab: { fifths: -4, semitoneOffset: -4 },
  Db: { fifths: -5, semitoneOffset: 1 },
  Gb: { fifths: -6, semitoneOffset: 6 },
};

function parseMusicXML(xml) {
  const document = new DOMParser().parseFromString(xml, "application/xml");
  assert.equal(document.documentElement?.nodeName, "score-partwise");
  assert.equal(document.getElementsByTagName("parsererror").length, 0);
  return document;
}

function elementText(parent, name) {
  return parent.getElementsByTagName(name)[0]?.textContent ?? null;
}

function pitchValue(note, fifths = 0) {
  const pitch = note.getElementsByTagName("pitch")[0];
  if (!pitch) {
    return null;
  }
  const step = elementText(pitch, "step");
  const keySharpOrder = ["F", "C", "G", "D", "A", "E", "B"];
  const keyFlatOrder = ["B", "E", "A", "D", "G", "C", "F"];
  const keyAlter = fifths > 0 && keySharpOrder.slice(0, fifths).includes(step)
    ? 1
    : fifths < 0 && keyFlatOrder.slice(0, -fifths).includes(step)
      ? -1
      : 0;
  const encodedAlter = elementText(pitch, "alter");
  return {
    step,
    alter: encodedAlter === null ? keyAlter : Number(encodedAlter),
    octave: Number(elementText(pitch, "octave")),
  };
}

const script = [
  "V: 1.0",
  "B: Export & Import",
  "D: G",
  "P: 4/4",
  "J: 82",
  "Z: Composer",
  "",
  "Q: | (1' 1') 7 0 - ||",
].join("\n");
const converted = convertJpsToMusicXML(script);
const document = parseMusicXML(converted.musicXml);
const notes = Array.from(document.getElementsByTagName("note"));
assert.equal(converted.filename, "Export & Import.musicxml");
assert.match(converted.musicXml, /Export &amp; Import/);
assert.equal(elementText(document, "fifths"), "1");
assert.deepEqual(pitchValue(notes[0]), { step: "G", alter: 0, octave: 4 });
assert.deepEqual(pitchValue(notes[1]), { step: "G", alter: 0, octave: 4 });
assert.deepEqual(pitchValue(notes[2], 1), { step: "F", alter: 1, octave: 4 });
assert.equal(notes[3].getElementsByTagName("rest").length, 1);
assert.deepEqual(
  Array.from(document.getElementsByTagName("tie")).map((tie) => tie.getAttribute("type")),
  ["start", "stop"],
);
assert.deepEqual(
  notes.map((note) => elementText(note, "duration")),
  ["1", "1", "1", "2"],
);
assert.equal(elementText(document, "per-minute"), "82");

const accidentalScore = parseMusicXML(convertJpsToMusicXML([
  "D: G",
  "P: 4/4",
  "Q: | 7$ 7 | 7 ||",
].join("\n")).musicXml);
const accidentalNotes = Array.from(accidentalScore.getElementsByTagName("note"));
assert.deepEqual(
  accidentalNotes.map((note) => elementText(note.getElementsByTagName("pitch")[0], "alter")),
  ["0", "0", null],
);

for (const [key, settings] of Object.entries(KEY_SETTINGS)) {
  const keyScore = parseMusicXML(convertJpsToMusicXML([
    `D: ${key.replace("b", "$")}`,
    "P: 4/4",
    "Q: | 1 ||",
  ].join("\n")).musicXml);
  const fifths = Number(elementText(keyScore, "fifths"));
  const pitch = pitchValue(keyScore.getElementsByTagName("note")[0], fifths);
  const semitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[pitch.step];
  assert.equal(
    pitch.octave * 12 + semitone + pitch.alter,
    4 * 12 + settings.semitoneOffset,
    `Wrong tonic pitch for ${key}`,
  );
}

const tupletScore = parseMusicXML(convertJpsToMusicXML([
  "D: C",
  "P: 4/4",
  "Q: | (y1/ 2/ 3/) ||",
].join("\n")).musicXml);
assert.equal(tupletScore.getElementsByTagName("time-modification").length, 3);
assert.deepEqual(
  Array.from(tupletScore.getElementsByTagName("note")).map((note) => elementText(note, "duration")),
  ["1", "1", "1"],
);

assert.throws(
  () => convertJpsToMusicXML("D: C\nP: 4/4\nC: Lyrics"),
  JpsToMusicXMLConversionError,
);
assert.throws(
  () => convertJpsToMusicXML("D: C\nP: 4/4\nQ: | 9 ||"),
  JpsToMusicXMLConversionError,
);

console.log("JPS to MusicXML conversion checks passed.");
