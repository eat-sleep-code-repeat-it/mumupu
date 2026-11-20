import {
  DOMParser,
  type Element as XmlElement,
  type Node as XmlNode,
} from "@xmldom/xmldom";
import { strFromU8, unzipSync } from "fflate";

export const MAX_MUSICXML_FILE_SIZE = 25 * 1024 * 1024;

export class MusicXMLConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MusicXMLConversionError";
  }
}

type MusicAttributes = {
  divisions: number;
  fifths: number;
  key: string;
  beats: number;
  beatType: number;
  staves: number;
};

type Pitch = {
  name: string;
  octave: number;
};

type MusicNote = {
  rest: boolean;
  pitch: Pitch | null;
  duration: number;
  actualNotes: number | null;
  normalNotes: number | null;
  tieStart: boolean;
  tieStop: boolean;
  tupletStart: boolean;
  tupletStop: boolean;
  tremolo: number;
  slideStart: boolean;
  slideUp: boolean;
};

type Barline = "NORMAL" | "DOUBLE" | "FINAL" | "REPEAT";

type MusicMeasure = {
  attributes: MusicAttributes;
  notes: MusicNote[];
  leftBarline: Barline;
  rightBarline: Barline;
  segno: boolean;
  dalSegno: boolean;
  coda: boolean;
  toCoda: boolean;
  tempo: number;
};

type MusicPart = {
  id: string;
  measures: MusicMeasure[];
};

const KEY_NAMES: Record<number, string> = {
  [-6]: "Gb",
  [-5]: "Db",
  [-4]: "Ab",
  [-3]: "Eb",
  [-2]: "Bb",
  [-1]: "F",
  0: "C",
  1: "G",
  2: "D",
  3: "A",
  4: "E",
  5: "B",
  6: "F#",
};

const KEY_ACCIDENTALS: Record<string, { accidental: "#" | "b"; steps: string[] }> = {
  C: { accidental: "#", steps: [] },
  G: { accidental: "#", steps: ["F"] },
  D: { accidental: "#", steps: ["F", "C"] },
  A: { accidental: "#", steps: ["F", "C", "G"] },
  E: { accidental: "#", steps: ["F", "C", "G", "D"] },
  B: { accidental: "#", steps: ["F", "C", "G", "D", "A"] },
  "F#": { accidental: "#", steps: ["F", "C", "G", "D", "A", "E"] },
  F: { accidental: "b", steps: ["B"] },
  Bb: { accidental: "b", steps: ["B", "E"] },
  Eb: { accidental: "b", steps: ["B", "E", "A"] },
  Ab: { accidental: "b", steps: ["B", "E", "A", "D"] },
  Db: { accidental: "b", steps: ["B", "E", "A", "D", "G"] },
  Gb: { accidental: "b", steps: ["B", "E", "A", "D", "G", "C"] },
};

const NOTE_DEGREES: Record<string, number> = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  "E#": 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

const DEGREE_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const STEP_NUMBERS: Record<string, string> = {
  C: "1",
  D: "2",
  E: "3",
  F: "4",
  G: "5",
  A: "6",
  B: "7",
};

function localName(node: XmlNode): string {
  return node.nodeName.split(":").at(-1) || "";
}

function childElements(parent: XmlElement, name?: string): XmlElement[] {
  const result: XmlElement[] = [];
  for (let index = 0; index < parent.childNodes.length; index += 1) {
    const node = parent.childNodes.item(index);
    if (node?.nodeType === 1 && (!name || localName(node) === name)) {
      result.push(node as XmlElement);
    }
  }
  return result;
}

function child(parent: XmlElement, name: string): XmlElement | null {
  return childElements(parent, name)[0] ?? null;
}

function descendants(parent: XmlElement, name: string): XmlElement[] {
  const result: XmlElement[] = [];
  for (const element of childElements(parent)) {
    if (localName(element) === name) {
      result.push(element);
    }
    result.push(...descendants(element, name));
  }
  return result;
}

function textContent(element: XmlElement | null): string | null {
  return element?.textContent ?? null;
}

function parseInteger(value: string | null, description: string): number {
  const parsed = Number(value?.trim());
  if (!Number.isInteger(parsed)) {
    throw new MusicXMLConversionError(`MusicXML ${description} must be an integer.`);
  }
  return parsed;
}

function optionalInteger(parent: XmlElement, name: string): number | null {
  const element = child(parent, name);
  return element ? parseInteger(textContent(element), name) : null;
}

function elementInteger(element: XmlElement | null, description: string): number | null {
  return element ? parseInteger(textContent(element), description) : null;
}

function parseXml(
  xml: string,
  description: string,
): ReturnType<DOMParser["parseFromString"]> {
  let parseError = "";
  let document: ReturnType<DOMParser["parseFromString"]>;
  try {
    document = new DOMParser({
      onError(level, message) {
        if (level !== "warning") {
          parseError = message;
        }
      },
    }).parseFromString(xml, "application/xml");
  } catch (error) {
    if (error instanceof Error) {
      throw new MusicXMLConversionError(`Could not parse ${description}: ${error.message}`);
    }
    throw error;
  }

  if (parseError || !document.documentElement) {
    throw new MusicXMLConversionError(
      `Could not parse ${description}${parseError ? `: ${parseError}` : "."}`,
    );
  }
  return document;
}

function readAttributes(
  element: XmlElement | null,
  previous: MusicAttributes | null,
): MusicAttributes {
  if (!element) {
    if (previous) {
      return previous;
    }
    throw new MusicXMLConversionError("The first measure is missing its attributes.");
  }

  const divisions = optionalInteger(element, "divisions") ?? previous?.divisions;
  const fifths =
    optionalInteger(child(element, "key") ?? element, "fifths") ?? previous?.fifths;
  const time = child(element, "time");
  const beats = (time ? optionalInteger(time, "beats") : null) ?? previous?.beats;
  const beatType =
    (time ? optionalInteger(time, "beat-type") : null) ?? previous?.beatType;
  const staves = optionalInteger(element, "staves") ?? previous?.staves ?? 1;

  if (divisions === undefined) {
    throw new MusicXMLConversionError("MusicXML divisions are missing.");
  }
  if (fifths === undefined) {
    throw new MusicXMLConversionError("MusicXML key signature is missing.");
  }
  if (beats === undefined || beatType === undefined) {
    throw new MusicXMLConversionError("MusicXML time signature is missing.");
  }
  if (divisions <= 0 || beats <= 0 || beatType <= 0) {
    throw new MusicXMLConversionError("MusicXML divisions and time signature must be positive.");
  }

  const key = KEY_NAMES[fifths];
  if (!key) {
    throw new MusicXMLConversionError(`Key signatures with ${fifths} fifths are not supported.`);
  }

  return { divisions, fifths, key, beats, beatType, staves };
}

function parsePitch(note: XmlElement, attributes: MusicAttributes): Pitch {
  const pitchElement = child(note, "pitch");
  const step = pitchElement && textContent(child(pitchElement, "step"));
  const octaveText = pitchElement && textContent(child(pitchElement, "octave"));
  if (!pitchElement || !step || !octaveText || !STEP_NUMBERS[step]) {
    throw new MusicXMLConversionError("A note is missing a supported pitch.");
  }

  const octave = parseInteger(octaveText, "pitch octave");
  const alterText = textContent(child(pitchElement, "alter"));
  const accidental = textContent(child(note, "accidental"));
  const notatedSharp = alterText === "1" || (alterText === null && accidental === "sharp");
  const notatedFlat = alterText === "-1" || (alterText === null && accidental === "flat");
  const notatedNatural = alterText === "0" || (alterText === null && accidental === "natural");
  const keyAccidental = KEY_ACCIDENTALS[attributes.key];

  let name = step;
  if (!notatedNatural && keyAccidental.steps.includes(step)) {
    name += keyAccidental.accidental;
  } else if (notatedSharp) {
    name += "#";
  } else if (notatedFlat) {
    name += "b";
  }

  return { name, octave };
}

function parseNote(element: XmlElement, attributes: MusicAttributes): MusicNote {
  const duration = parseInteger(textContent(child(element, "duration")), "note duration");
  const timeModification = child(element, "time-modification");
  const actualNotes = timeModification
    ? optionalInteger(timeModification, "actual-notes")
    : null;
  const normalNotes = timeModification
    ? optionalInteger(timeModification, "normal-notes")
    : null;
  if (duration <= 0 || (timeModification && (!actualNotes || !normalNotes))) {
    throw new MusicXMLConversionError("A note has an invalid duration or tuplet ratio.");
  }

  const notations = child(element, "notations");
  const tuplets = notations ? childElements(notations, "tuplet") : [];
  const slide = notations ? child(notations, "slide") : null;
  const slideY = Number(slide?.getAttribute("default-y") || 0);
  const noteY = Number(element.getAttribute("default-y") || 0);
  const tremoloText = textContent(
    notations
      ? child(child(notations, "ornaments") ?? notations, "tremolo")
      : null,
  );
  const tremolo = tremoloText ? parseInteger(tremoloText, "tremolo") : 0;
  const ties = childElements(element, "tie");

  return {
    rest: child(element, "rest") !== null,
    pitch: child(element, "rest") ? null : parsePitch(element, attributes),
    duration,
    actualNotes,
    normalNotes,
    tieStart: ties.some((tie) => tie.getAttribute("type") === "start"),
    tieStop: ties.some((tie) => tie.getAttribute("type") === "stop"),
    tupletStart:
      timeModification !== null
      && tuplets.some((tuplet) => tuplet.getAttribute("type") === "start"),
    tupletStop:
      timeModification !== null
      && tuplets.some((tuplet) => tuplet.getAttribute("type") === "stop"),
    tremolo,
    slideStart: slide?.getAttribute("type") === "start",
    slideUp: slideY < noteY,
  };
}

function readStaff(note: XmlElement): number {
  return optionalInteger(note, "staff") ?? 1;
}

function chooseChordNote(chord: XmlElement[]): XmlElement {
  return chord.reduce((chosen, candidate) => {
    const chosenString = elementInteger(
      child(child(child(chosen, "notations") ?? chosen, "technical") ?? chosen, "string"),
      "string number",
    ) ?? 1000;
    const candidateString = elementInteger(
      child(child(child(candidate, "notations") ?? candidate, "technical") ?? candidate, "string"),
      "string number",
    ) ?? 1000;
    return candidateString < chosenString ? candidate : chosen;
  });
}

function parseBarline(measure: XmlElement, location: "left" | "right"): Barline {
  const barline = childElements(measure, "barline").find(
    (candidate) => candidate.getAttribute("location") === location,
  );
  if (!barline) {
    return "NORMAL";
  }
  const style = textContent(child(barline, "bar-style"));
  if (style === null) {
    return "NORMAL";
  }
  if (child(barline, "repeat")) {
    return "REPEAT";
  }
  if (style === "light-light") {
    return "DOUBLE";
  }
  if (style === "light-heavy") {
    return "FINAL";
  }
  return "NORMAL";
}

function parseMeasure(
  element: XmlElement,
  previousAttributes: MusicAttributes | null,
  staff: number,
): MusicMeasure {
  const attributes = readAttributes(child(element, "attributes"), previousAttributes);
  const noteGroups: XmlElement[][] = [];
  for (const note of childElements(element, "note")) {
    if (readStaff(note) !== staff) {
      continue;
    }
    if (child(note, "chord")) {
      const lastGroup = noteGroups.at(-1);
      if (!lastGroup) {
        throw new MusicXMLConversionError("A chord note is missing its preceding note.");
      }
      lastGroup.push(note);
    } else {
      noteGroups.push([note]);
    }
  }

  const selectedNotes = noteGroups.map((group) => parseNote(chooseChordNote(group), attributes));
  const directions = childElements(element, "direction");
  const sound = directions
    .map((direction) => child(direction, "sound"))
    .find((candidate): candidate is XmlElement => candidate !== null);
  const tempoText = sound?.getAttribute("tempo") ?? "";
  const tempo = tempoText ? Number(tempoText) : 0;
  const hasSoundAttribute = (name: string) =>
    directions.some((direction) => child(direction, "sound")?.hasAttribute(name));

  return {
    attributes,
    notes: selectedNotes,
    leftBarline: parseBarline(element, "left"),
    rightBarline: parseBarline(element, "right"),
    segno: hasSoundAttribute("segno"),
    dalSegno: hasSoundAttribute("dalsegno"),
    coda: hasSoundAttribute("coda"),
    toCoda: hasSoundAttribute("tocoda"),
    tempo: Number.isFinite(tempo) ? tempo : 0,
  };
}

function getTransposeOffsetToC(key: string): number {
  const degree = NOTE_DEGREES[key];
  if (degree === undefined) {
    throw new MusicXMLConversionError(`Key signature ${key} cannot be transposed.`);
  }
  return degree <= 6 ? -degree : 12 - degree;
}

function transposePitch(pitch: Pitch, offset: number): Pitch {
  const degree = NOTE_DEGREES[pitch.name];
  if (degree === undefined) {
    throw new MusicXMLConversionError(`Pitch ${pitch.name} is not supported.`);
  }
  const transposed = degree + offset;
  const octave = pitch.octave + Math.floor(transposed / 12);
  const normalizedDegree = ((transposed % 12) + 12) % 12;
  return { name: DEGREE_NOTES[normalizedDegree], octave };
}

function octaveMark(octave: number): string {
  return octave >= 4 ? "'".repeat(octave - 4) : ",".repeat(4 - octave);
}

function displayedDuration(note: MusicNote): number {
  if (!note.actualNotes || !note.normalNotes) {
    return note.duration;
  }
  return Math.floor((note.duration * note.actualNotes) / note.normalNotes);
}

function timePrefixAndSuffix(
  duration: number,
  divisions: number,
  prefix = "",
): [string, string] {
  if (duration <= 0) {
    throw new MusicXMLConversionError("A note resolves to an unsupported zero duration.");
  }
  if (duration < divisions) {
    const [nextPrefix, suffix] = timePrefixAndSuffix(duration * 2, divisions, prefix);
    return [nextPrefix, `${suffix}/`];
  }
  if (duration === divisions) {
    return [prefix, ""];
  }
  if (duration * 2 === divisions * 3) {
    return [prefix, "."];
  }
  const [nextPrefix, suffix] = timePrefixAndSuffix(duration - divisions, divisions);
  return [nextPrefix, ` -${suffix}`];
}

function appendForTie(text: string, marker: string): string {
  const hyphen = text.indexOf("-");
  if (hyphen >= 0) {
    return `${text.slice(0, hyphen)}${marker} ${text.slice(hyphen)}`;
  }
  return `${text} ${marker}`;
}

function noteText(note: MusicNote, key: string, divisions: number): string {
  let result: string;
  if (note.rest) {
    result = "0";
  } else {
    if (!note.pitch) {
      throw new MusicXMLConversionError("A pitched note is missing its pitch.");
    }
    const pitch =
      key === "C"
        ? note.pitch
        : transposePitch(note.pitch, getTransposeOffsetToC(key));
    const step = pitch.name[0];
    const accidental = pitch.name[1] === "b" ? "$" : pitch.name[1] ?? "";
    result = `${STEP_NUMBERS[step]}${accidental}${octaveMark(pitch.octave)}`;
  }

  if (note.tremolo > 0) {
    result += `"${"/".repeat(note.tremolo)}"`;
  }

  const [prefix, suffix] = timePrefixAndSuffix(
    displayedDuration(note),
    divisions,
  );
  result = `${prefix}${result}${suffix}`;

  if (note.tieStart) {
    result = `( ${result}`;
  }
  if (note.tupletStart) {
    result = `(y${result}`;
  }
  if (note.tupletStop) {
    result += ")";
  }
  if (note.slideStart) {
    result += note.slideUp ? "&shy" : "&xhy";
  }
  if (note.tieStop) {
    result = appendForTie(result, ")");
  }
  return result;
}

function pythonRound(value: number): number {
  const floor = Math.floor(value);
  const fraction = value - floor;
  if (Math.abs(fraction - 0.5) < Number.EPSILON * Math.max(1, Math.abs(value))) {
    return floor % 2 === 0 ? floor : floor + 1;
  }
  return Math.round(value);
}

function leftBarlineText(measure: MusicMeasure, index: number): string {
  let result = "";
  if (measure.leftBarline === "REPEAT") {
    result = index === 0 ? "|:" : ":";
  }
  if (measure.segno) {
    result += "&hs";
  } else if (measure.coda) {
    result += "&ty";
  }
  return result;
}

function rightBarlineText(measure: MusicMeasure): string {
  let result = "|";
  if (measure.rightBarline === "REPEAT") {
    result = ":|";
  } else if (measure.rightBarline === "DOUBLE") {
    result = "||/";
  } else if (measure.rightBarline === "FINAL") {
    result = "||";
  }
  if (measure.dalSegno) {
    result += "&ds";
  } else if (measure.toCoda) {
    result += "&ty";
  }
  return result;
}

function renderMeasure(measure: MusicMeasure, index: number): string {
  const notes = measure.notes
    .map((note) => noteText(note, measure.attributes.key, measure.attributes.divisions))
    .join(" ");
  return `${leftBarlineText(measure, index)} ${notes} ${rightBarlineText(measure)}`;
}

function parseScore(xml: string, staff: number): string {
  const document = parseXml(xml, "MusicXML");
  const root = document.documentElement;
  if (!root) {
    throw new MusicXMLConversionError("MusicXML has no document element.");
  }
  if (localName(root) !== "score-partwise") {
    throw new MusicXMLConversionError(
      `Unsupported MusicXML root element: ${localName(root) || "unknown"}.`,
    );
  }

  const partIds = childElements(child(root, "part-list") ?? root, "score-part")
    .map((part) => part.getAttribute("id"))
    .filter((id): id is string => typeof id === "string" && id !== "");
  if (partIds.length === 0) {
    throw new MusicXMLConversionError("MusicXML does not contain any score parts.");
  }

  const parts: MusicPart[] = partIds.map((id) => {
    const part = childElements(root, "part").find(
      (candidate) => candidate.getAttribute("id") === id,
    );
    if (!part) {
      throw new MusicXMLConversionError(`MusicXML part ${id} is missing.`);
    }

    let attributes: MusicAttributes | null = null;
    const measures = childElements(part, "measure").map((measure) => {
      const parsed = parseMeasure(measure, attributes, staff);
      attributes = parsed.attributes;
      return parsed;
    });
    if (measures.length === 0) {
      throw new MusicXMLConversionError(`MusicXML part ${id} has no measures.`);
    }
    return { id, measures };
  });

  const initialMeasure = parts[0].measures[0];
  if (staff > initialMeasure.attributes.staves) {
    throw new MusicXMLConversionError(
      `Staff ${staff} exceeds the ${initialMeasure.attributes.staves} staves in the score.`,
    );
  }

  const title =
    textContent(child(child(root, "work") ?? root, "work-title"))
    ?? textContent(child(root, "movement-title"));
  const composer = descendants(child(root, "identification") ?? root, "creator")
    .find((creator) => creator.getAttribute("type") === "composer");
  const initialAttributes = initialMeasure.attributes;
  const header = [
    "V: 1.0",
    ...(title !== null ? [`B: ${title}`] : []),
    `D: ${initialAttributes.key.replaceAll("b", "$")}`,
    `P: ${initialAttributes.beats}/${initialAttributes.beatType}`,
    ...(initialMeasure.tempo > 0.01
      ? [
          `J: ${pythonRound(
            (initialMeasure.tempo * initialAttributes.beatType) / 4,
          )}`,
        ]
      : []),
    ...(composer && textContent(composer) !== null
      ? [`Z: ${textContent(composer)}`]
      : []),
  ].join("\n");

  const measureCount = Math.max(...parts.map((part) => part.measures.length));
  const lines: string[] = [];
  for (let start = 0; start < measureCount; start += 4) {
    for (let partIndex = 0; partIndex < parts.length; partIndex += 1) {
      const part = parts[partIndex];
      const prefix = parts.length > 1 ? `Q${partIndex + 1}` : "Q";
      const measures = part.measures
        .slice(start, start + 4)
        .map((measure, index) => renderMeasure(measure, index));
      lines.push(`${prefix}: ${measures.join("")}`);
    }
    lines.push("");
  }

  return `${header}\n\n${lines.join("\n")}`;
}

function xmlFromMxl(bytes: Uint8Array): string {
  const extractEntry = (name: string, maximumSize: number): Uint8Array | null => {
    let oversized = false;
    let files: ReturnType<typeof unzipSync>;
    try {
      files = unzipSync(bytes, {
        filter(entry) {
          if (entry.name !== name) {
            return false;
          }
          if (entry.originalSize > maximumSize) {
            oversized = true;
            return false;
          }
          return true;
        },
      });
    } catch {
      throw new MusicXMLConversionError("The .mxl file is not a valid ZIP archive.");
    }
    if (oversized) {
      throw new MusicXMLConversionError("The .mxl file contains an oversized XML document.");
    }
    return files[name] ?? null;
  };

  if (bytes.byteLength > MAX_MUSICXML_FILE_SIZE) {
    throw new MusicXMLConversionError("The .mxl file is too large to import.");
  }

  const containerBytes = extractEntry("META-INF/container.xml", 1024 * 1024);
  if (!containerBytes) {
    throw new MusicXMLConversionError("The .mxl archive is missing META-INF/container.xml.");
  }
  const container = parseXml(strFromU8(containerBytes), "MXL container");
  const containerRoot = container.documentElement;
  if (!containerRoot) {
    throw new MusicXMLConversionError("The MXL container has no document element.");
  }
  const rootFile = descendants(containerRoot, "rootfile")[0];
  const fullPath = rootFile?.getAttribute("full-path");
  if (!fullPath || fullPath.startsWith("/") || fullPath.includes("\\")
    || fullPath.split("/").some((part) => part === ".." || part === ""))
  {
    throw new MusicXMLConversionError("The .mxl archive has an invalid rootfile path.");
  }

  const musicXml = extractEntry(fullPath, MAX_MUSICXML_FILE_SIZE);
  if (!musicXml) {
    throw new MusicXMLConversionError("The MusicXML document named by the .mxl archive is missing.");
  }
  return strFromU8(musicXml);
}

export function convertMusicXMLToJps(fileName: string, bytes: Uint8Array): string {
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (extension !== ".musicxml" && extension !== ".xml" && extension !== ".mxl") {
    throw new MusicXMLConversionError("Choose a .musicxml, .xml, or .mxl file.");
  }
  if (bytes.byteLength > MAX_MUSICXML_FILE_SIZE) {
    throw new MusicXMLConversionError("The MusicXML file is too large to import.");
  }

  const xml =
    extension === ".mxl"
      ? xmlFromMxl(bytes)
      : strFromU8(bytes);
  return parseScore(xml, 1);
}
