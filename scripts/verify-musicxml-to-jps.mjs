import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { convertMusicXMLToJps, MusicXMLConversionError } from "../lib/musicxml-to-jps.ts";
import { strToU8, zipSync } from "fflate";

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise xmlns="http://www.musicxml.org/ns/musicxml">
  <work><work-title>Import Test</work-title></work>
  <identification><creator type="composer">Test Composer</creator></identification>
  <part-list><score-part id="P1"><part-name>Melody</part-name></score-part></part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key><fifths>1</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
      </attributes>
      <note>
        <pitch><step>G</step><octave>4</octave></pitch>
        <duration>1</duration><tie type="start"/>
      </note>
      <note>
        <pitch><step>F</step><alter>1</alter><octave>4</octave></pitch>
        <duration>1</duration><tie type="stop"/>
      </note>
      <note><rest/><duration>2</duration></note>
      <barline location="right"><bar-style>light-heavy</bar-style></barline>
    </measure>
  </part>
</score-partwise>`;

const expected = [
  "V: 1.0",
  "B: Import Test",
  "D: G",
  "P: 4/4",
  "Z: Test Composer",
  "",
  "Q:  ( 1' 7 ) 0 - ||",
  "",
].join("\n");

assert.equal(convertMusicXMLToJps("sample.musicxml", strToU8(xml)), expected);

const container = `<?xml version="1.0"?>
<container><rootfiles><rootfile full-path="scores/sample.musicxml"/></rootfiles></container>`;
const archive = zipSync({
  "META-INF/container.xml": strToU8(container),
  "scores/sample.musicxml": strToU8(xml),
});
assert.equal(convertMusicXMLToJps("sample.mxl", archive), expected);

assert.throws(
  () => convertMusicXMLToJps("sample.musicxml", strToU8("<not-a-score/>")),
  MusicXMLConversionError,
);

const referenceDirectoryArgument = process.argv.slice(2).find((argument) => argument !== "--");
if (referenceDirectoryArgument) {
  const referenceDirectory = path.resolve(referenceDirectoryArgument);
  const files = await readdir(referenceDirectory);
  const musicXmlFiles = files.filter((file) => /\.(musicxml|mxl)$/i.test(file));
  for (const fileName of musicXmlFiles) {
    const referencePath = path.join(
      referenceDirectory,
      `${path.parse(fileName).name}.txt`,
    );
    const [source, reference] = await Promise.all([
      readFile(path.join(referenceDirectory, fileName)),
      readFile(referencePath, "utf8"),
    ]);
    const actual = `${convertMusicXMLToJps(fileName, source)}\n`;
    assert.equal(
      actual.replace(/\r\n/g, "\n"),
      reference.replace(/\r\n/g, "\n"),
      `Conversion differs from the Python reference for ${fileName}`,
    );
  }
  console.log(`Matched ${musicXmlFiles.length} Python reference conversions.`);
}

console.log("MusicXML and MXL conversion checks passed.");
