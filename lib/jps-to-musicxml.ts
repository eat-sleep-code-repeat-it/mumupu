export const MAX_JPS_SCRIPT_LENGTH = 2_000_000;

export class JpsToMusicXMLConversionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JpsToMusicXMLConversionError";
  }
}

type Meter = {
  beats: number;
  beatType: number;
};

type Fraction = {
  numerator: number;
  denominator: number;
};

type GraceNote = {
  step: string;
  octave: number;
  accidental: number;
  slash: boolean;
};

type NoteEvent = {
  rest: boolean;
  hidden: boolean;
  step: string | null;
  octave: number;
  accidental: number;
  duration: Fraction;
  tieStart: boolean;
  tieStop: boolean;
  slurStarts: number[];
  slurStops: number[];
  tuplet: boolean;
  tupletStart: boolean;
  tupletStop: boolean;
  tremolo: number;
  annotation: string | null;
  slideUp: boolean | null;
  directionsBefore: string[];
  directionsAfter: string[];
  fermata: boolean;
  trill: boolean;
  graceNotes: GraceNote[];
};

type Barline = "regular" | "double" | "final" | "repeat";

type Measure = {
  events: NoteEvent[];
  meter: Meter;
  leftRepeat: boolean;
  rightBarline: Barline;
  directionsBefore: string[];
  directionsAfter: string[];
};

type ParsedPart = {
  number: string;
  measures: Measure[];
};

type KeyInfo = {
  name: string;
  fifths: number;
  semitoneOffset: number;
  diatonicOffset: number;
};

type PitchEvent = Pick<NoteEvent, "rest" | "step" | "octave" | "accidental">;

type OpenGroup = {
  events: NoteEvent[];
  tuplet: boolean;
};

const STEPS = ["C", "D", "E", "F", "G", "A", "B"];
const STEP_SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const STEP_BY_DEGREE: Record<string, string> = {
  "1": "C",
  "2": "D",
  "3": "E",
  "4": "F",
  "5": "G",
  "6": "A",
  "7": "B",
};
const SHARP_ORDER = ["F", "C", "G", "D", "A", "E", "B"];
const FLAT_ORDER = ["B", "E", "A", "D", "G", "C", "F"];
const MUSICXML_DYNAMIC_MARKS = new Set([
  "p", "pp", "ppp", "pppp", "ppppp", "pppppp",
  "mp", "mf", "f", "ff", "fff", "ffff", "fffff", "ffffff",
  "sf", "sfp", "sfpp", "fp", "rf", "rfz", "sfz", "sffz", "fz",
  "rit",
]);
const KEY_SETTINGS: Record<string, { fifths: number; semitoneOffset: number }> = {
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

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function fraction(numerator: number, denominator: number): Fraction {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new JpsToMusicXMLConversionError("A note has an unsupported duration.");
  }
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

function scaleDuration(duration: Fraction, numerator: number, denominator: number): Fraction {
  return fraction(
    duration.numerator * numerator,
    duration.denominator * denominator,
  );
}

function parseGraceNote(value: string): GraceNote {
  const match = /^([1-7])([#$=]?)([',]*)(\/+)?\.{0,2}$/.exec(value);
  if (!match) {
    throw new JpsToMusicXMLConversionError(`Unsupported grace note: ${value}.`);
  }
  const octave = Array.from(match[3]).reduce(
    (offset, marker) => offset + (marker === "'" ? 1 : -1),
    0,
  );
  const accidental = match[2] === "#" ? 1 : match[2] === "$" ? -1 : 0;
  return {
    step: STEP_BY_DEGREE[match[1]],
    octave: 4 + octave,
    accidental,
    slash: Boolean(match[4]),
  };
}

function parseMeter(value: string): Meter {
  const match = /^\s*(\d+)\s*\/\s*(\d+)\s*$/.exec(value);
  const beats = Number(match?.[1]);
  const beatType = Number(match?.[2]);
  if (!match || beats <= 0 || beatType <= 0) {
    throw new JpsToMusicXMLConversionError(`Unsupported time signature: ${value.trim() || "(empty)"}.`);
  }
  return { beats, beatType };
}

function parseKey(value: string): KeyInfo {
  const name = value.trim().replaceAll("$", "b");
  const setting = KEY_SETTINGS[name];
  if (!setting) {
    throw new JpsToMusicXMLConversionError(`Unsupported key signature: ${value.trim() || "(empty)"}.`);
  }

  const { fifths, semitoneOffset } = setting;
  const tonicStep = name[0];
  const tonicIndex = STEPS.indexOf(tonicStep);
  const tonicAlter = name.endsWith("#") ? 1 : name.endsWith("b") ? -1 : 0;
  const octaveOffset =
    (semitoneOffset - STEP_SEMITONES[tonicStep] - tonicAlter) / 12;
  if (!Number.isInteger(octaveOffset)) {
    throw new JpsToMusicXMLConversionError(`Unsupported key signature: ${value.trim()}.`);
  }

  return {
    name,
    fifths,
    semitoneOffset,
    diatonicOffset: tonicIndex + octaveOffset * 7,
  };
}

function keyAlteration(step: string, fifths: number): number {
  if (fifths > 0 && SHARP_ORDER.slice(0, fifths).includes(step)) {
    return 1;
  }
  if (fifths < 0 && FLAT_ORDER.slice(0, -fifths).includes(step)) {
    return -1;
  }
  return 0;
}

function resolvePitch(event: PitchEvent, key: KeyInfo) {
  if (event.rest || !event.step) {
    return null;
  }
  const internalIndex = STEPS.indexOf(event.step);
  const transposedIndex = internalIndex + key.diatonicOffset;
  const step = STEPS[((transposedIndex % 7) + 7) % 7];
  const octave = event.octave + Math.floor(transposedIndex / 7);
  const absolutePitch =
    event.octave * 12 + STEP_SEMITONES[event.step] + event.accidental + key.semitoneOffset;
  const naturalPitch = octave * 12 + STEP_SEMITONES[step];
  const alter = absolutePitch - naturalPitch;
  if (Math.abs(alter) > 2) {
    throw new JpsToMusicXMLConversionError(
      `The accidental on ${event.step} cannot be represented in MusicXML.`,
    );
  }
  return { step, octave, alter };
}

function samePitch(left: NoteEvent, right: NoteEvent): boolean {
  return left.rest === right.rest
    && left.step === right.step
    && left.octave === right.octave
    && left.accidental === right.accidental;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function dynamicDirection(symbol: string): string {
  const directionType = symbol === "rit"
    ? "<words>rit.</words>"
    : `<dynamics><${symbol}/></dynamics>`;
  return `<direction placement="below"><direction-type>${directionType}</direction-type></direction>`;
}

function wedgeDirection(type: "crescendo" | "diminuendo" | "stop", number: number): string {
  return `<direction placement="below"><direction-type><wedge type="${type}" number="${number}"/></direction-type></direction>`;
}

function bracketDirection(type: "start" | "stop", number: number): string {
  return `<direction placement="above"><direction-type><bracket line-end="none" type="${type}" line-type="solid" number="${number}"/></direction-type></direction>`;
}

function quotedText(source: string, start: number): { value: string; next: number } {
  let value = "";
  let escaped = false;
  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      value += character;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === "\"") {
      return { value, next: index + 1 };
    } else {
      value += character;
    }
  }
  throw new JpsToMusicXMLConversionError("A quoted JPS annotation is not closed.");
}

function parsePartBody(
  number: string,
  bodies: string[],
  initialMeter: Meter,
): ParsedPart {
  const source = bodies.join("\n");
  const measures: Measure[] = [];
  const events: NoteEvent[] = [];
  const directionsBefore: string[] = [];
  const directionsAfter: string[] = [];
  const accidentalState = new Map<string, number>();
  const groups: OpenGroup[] = [];
  let activeMeter = initialMeter;
  let measureMeter = initialMeter;
  let leftRepeat = false;
  let index = 0;
  let slurNumber = 0;
  let nextBracketNumber = 0;
  let nextHairpinNumber = 0;
  const activeBracketNumbers: number[] = [];
  const activeHairpinNumbers: number[] = [];

  const finishMeasure = (rightBarline: Barline) => {
    if (
      events.length > 0
      || leftRepeat
      || directionsBefore.length > 0
      || directionsAfter.length > 0
    ) {
      measures.push({
        events: events.splice(0),
        meter: measureMeter,
        leftRepeat,
        rightBarline,
        directionsBefore: directionsBefore.splice(0),
        directionsAfter: directionsAfter.splice(0),
      });
    }
    leftRepeat = false;
    measureMeter = activeMeter;
    accidentalState.clear();
  };

  const addEvent = (event: NoteEvent) => {
    events.push(event);
    for (const group of groups) {
      group.events.push(event);
    }
  };

  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }

    if (character === "\"") {
      const parsed = quotedText(source, index);
      index = parsed.next;
      const timeChange = /^p:\s*(\d+)\s*\/\s*(\d+)$/i.exec(parsed.value.trim());
      if (timeChange) {
        if (events.length > 0) {
          throw new JpsToMusicXMLConversionError("A time signature change must appear at the start of a measure.");
        }
        activeMeter = parseMeter(`${timeChange[1]}/${timeChange[2]}`);
        measureMeter = activeMeter;
      } else if (/^\/+$/.test(parsed.value)) {
        const event = events.at(-1);
        if (!event) {
          throw new JpsToMusicXMLConversionError("A tremolo annotation must follow a note.");
        }
        event.tremolo = parsed.value.length;
      } else if (events.length > 0) {
        events.at(-1)!.annotation = parsed.value;
      } else {
        throw new JpsToMusicXMLConversionError("A quoted JPS annotation must follow a note.");
      }
      continue;
    }

    if (character === "(") {
      index += 1;
      const tuplet = source[index] === "y";
      if (tuplet) {
        if (groups.some((group) => group.tuplet)) {
          throw new JpsToMusicXMLConversionError("Nested tuplets cannot be exported.");
        }
        index += 1;
      }
      groups.push({ events: [], tuplet });
      continue;
    }

    if (character === ")") {
      const group = groups.pop();
      if (!group) {
        throw new JpsToMusicXMLConversionError("A closing parenthesis has no matching opening parenthesis.");
      }
      if (group.tuplet) {
        if (group.events.length !== 3) {
          throw new JpsToMusicXMLConversionError("Only three-note 3:2 tuplets can be exported.");
        }
        for (const event of group.events) {
          event.duration = scaleDuration(event.duration, 2, 3);
          event.tuplet = true;
          event.tupletStart = event === group.events[0];
          event.tupletStop = event === group.events.at(-1);
        }
      } else if (group.events.length > 1) {
        const allSamePitch = group.events.every((event) => samePitch(event, group.events[0]));
        if (allSamePitch && !group.events[0].rest) {
          group.events.forEach((event, eventIndex) => {
            event.tieStart = eventIndex < group.events.length - 1;
            event.tieStop = eventIndex > 0;
          });
        } else {
          slurNumber += 1;
          group.events[0].slurStarts.push(slurNumber);
          group.events.at(-1)!.slurStops.push(slurNumber);
        }
      }
      index += 1;
      continue;
    }

    if (character === "[") {
      const event = events.at(-1);
      const closingIndex = source.indexOf("]", index + 1);
      if (!event || closingIndex < 0) {
        throw new JpsToMusicXMLConversionError("A grace-note group must follow a note and have a closing bracket.");
      }
      const graceNotes = source.slice(index + 1, closingIndex).trim().split(/\s+/).filter(Boolean);
      if (graceNotes.length === 0) {
        throw new JpsToMusicXMLConversionError("A grace-note group cannot be empty.");
      }
      event.graceNotes.push(...graceNotes.map(parseGraceNote));
      index = closingIndex + 1;
      continue;
    }

    if (character === "|" || character === ":") {
      if (source.startsWith("|:", index)) {
        if (events.length > 0) {
          finishMeasure("regular");
        }
        leftRepeat = true;
        index += 2;
        continue;
      }
      if (source.startsWith(":|", index)) {
        finishMeasure("repeat");
        index += 2;
        continue;
      }
      if (source.startsWith("||/", index)) {
        finishMeasure("double");
        index += 3;
        continue;
      }
      if (source.startsWith("||", index)) {
        finishMeasure("final");
        index += 2;
        continue;
      }
      if (character === "|") {
        finishMeasure("regular");
        index += source[index + 1] === "/" ? 2 : 1;
        continue;
      }
      throw new JpsToMusicXMLConversionError(`Unsupported barline near "${source.slice(index, index + 8)}".`);
    }

    if (character === "&") {
      const match = /^&([a-z]+)/i.exec(source.slice(index));
      const symbol = match?.[1]?.toLowerCase();
      if (!match || !symbol) {
        throw new JpsToMusicXMLConversionError("An incomplete JPS symbol was found.");
      }
      index += match[0].length;
      if (MUSICXML_DYNAMIC_MARKS.has(symbol)) {
        const direction = dynamicDirection(symbol);
        const event = events.at(-1);
        (event ? event.directionsBefore : directionsBefore).push(direction);
      } else if (symbol === "hs") {
        (events.length === 0 ? directionsBefore : directionsAfter).push(
          '<direction><direction-type><segno/></direction-type><sound segno="segno"/></direction>',
        );
      } else if (symbol === "ds") {
        directionsAfter.push(
          '<direction><direction-type><words>D.S.</words></direction-type><sound dalsegno="segno"/></direction>',
        );
      } else if (symbol === "ty") {
        (events.length === 0 ? directionsBefore : directionsAfter).push(
          '<direction><direction-type><coda/></direction-type><sound coda="coda"/></direction>',
        );
      } else if (symbol === "shy" || symbol === "xhy") {
        const event = events.at(-1);
        if (!event || event.rest) {
          throw new JpsToMusicXMLConversionError(`The ${symbol} slide marker must follow a pitched note.`);
        }
        event.slideUp = symbol === "shy";
      } else if (symbol === "yc" || symbol === "cy" || symbol === "tr") {
        const event = events.at(-1);
        if (!event) {
          throw new JpsToMusicXMLConversionError(`The ${symbol} ornament must follow a note.`);
        }
        if (symbol === "tr") {
          event.trill = true;
        } else {
          event.fermata = true;
        }
      } else if (symbol === "zkh") {
        const event = events.at(-1);
        if (!event) {
          throw new JpsToMusicXMLConversionError("The zkh bracket marker must follow a note.");
        }
        const number = ++nextBracketNumber;
        activeBracketNumbers.push(number);
        event.directionsAfter.push(bracketDirection("start", number));
      } else if (symbol === "ykh") {
        const event = events.at(-1);
        const number = activeBracketNumbers.pop();
        if (!event || number === undefined) {
          throw new JpsToMusicXMLConversionError("The ykh bracket marker must follow an opening zkh marker.");
        }
        event.directionsAfter.push(bracketDirection("stop", number));
      } else {
        throw new JpsToMusicXMLConversionError(
          `The JPS symbol &${symbol} is not supported for MusicXML export.`,
        );
      }
      continue;
    }

    if (character === "-") {
      const event = events.at(-1);
      if (!event) {
        throw new JpsToMusicXMLConversionError("A duration extension must follow a note.");
      }
      event.duration = fraction(
        event.duration.numerator + event.duration.denominator,
        event.duration.denominator,
      );
      index += 1;
      continue;
    }

    if (character === "," || character === "'") {
      const event = events.at(-1);
      if (!event || event.rest) {
        throw new JpsToMusicXMLConversionError("An octave marker must follow a pitched note.");
      }
      while (source[index] === "," || source[index] === "'") {
        event.octave += source[index] === "'" ? 1 : -1;
        index += 1;
      }
      continue;
    }

    if (character === "/" || character === ".") {
      const event = events.at(-1);
      if (!event) {
        throw new JpsToMusicXMLConversionError("A duration marker must follow a note.");
      }
      let slashCount = 0;
      let dotCount = 0;
      while (source[index] === "/" || source[index] === ".") {
        if (source[index] === "/") {
          slashCount += 1;
        } else {
          dotCount += 1;
        }
        index += 1;
      }
      if (slashCount > 8 || dotCount > 2) {
        throw new JpsToMusicXMLConversionError("The note duration is too small or has too many dots to export.");
      }
      event.duration = scaleDuration(
        event.duration,
        2 ** (dotCount + 1) - 1,
        2 ** (slashCount + dotCount),
      );
      continue;
    }

    if (character === "<" || character === ">") {
      let markerEnd = index;
      while (source[markerEnd] === "<" || source[markerEnd] === ">") {
        markerEnd += 1;
      }
      const event = events.at(-1);
      if (!event) {
        throw new JpsToMusicXMLConversionError("A hairpin marker must follow a note.");
      }
      const type = source.slice(index, markerEnd).includes("<") ? "crescendo" : "diminuendo";
      const number = ++nextHairpinNumber;
      activeHairpinNumbers.push(number);
      event.directionsBefore.push(wedgeDirection(type, number));
      index = markerEnd;
      continue;
    }

    if (character === "!") {
      const event = events.at(-1);
      if (!event) {
        throw new JpsToMusicXMLConversionError("A hairpin stop marker must follow a note.");
      }
      const number = activeHairpinNumbers.pop() ?? 1;
      event.directionsAfter.push(wedgeDirection("stop", number));
      index += 1;
      continue;
    }

    if (/[0-9]/.test(character)) {
      const digit = character;
      index += 1;
      if (digit === "9") {
        throw new JpsToMusicXMLConversionError("Rhythm-only notes (9) cannot be exported as pitched MusicXML notes.");
      }

      let explicitAccidental: number | null = null;
      let octave = 0;
      while (index < source.length) {
        const suffix = source[index];
        if (suffix === "#" || suffix === "$" || suffix === "=") {
          if (explicitAccidental !== null) {
            throw new JpsToMusicXMLConversionError("A note may have only one accidental.");
          }
          explicitAccidental = suffix === "#" ? 1 : suffix === "$" ? -1 : 0;
          index += 1;
        } else if (suffix === "'" || suffix === ",") {
          octave += suffix === "'" ? 1 : -1;
          index += 1;
        } else {
          break;
        }
      }

      let slashCount = 0;
      let dotCount = 0;
      while (source[index] === "/" || source[index] === ".") {
        if (source[index] === "/") {
          slashCount += 1;
        } else {
          dotCount += 1;
        }
        index += 1;
      }
      if (slashCount > 8 || dotCount > 2) {
        throw new JpsToMusicXMLConversionError("The note duration is too small or has too many dots to export.");
      }

      let extensions = 0;
      while (true) {
        let next = index;
        while (/\s/.test(source[next] ?? "")) {
          next += 1;
        }
        if (source[next] !== "-") {
          break;
        }
        extensions += 1;
        index = next + 1;
      }

      const denominator = 2 ** (slashCount + dotCount);
      const numerator = 2 ** (dotCount + 1) - 1 + extensions * denominator;
      const step = STEP_BY_DEGREE[digit] ?? null;
      const isRest = digit === "0" || digit === "8";
      if (!step && !isRest) {
        throw new JpsToMusicXMLConversionError(`Unsupported note: ${digit}.`);
      }
      const accidentalKey = `${digit}:${octave}`;
      if (explicitAccidental !== null) {
        accidentalState.set(accidentalKey, explicitAccidental);
      }
      const event: NoteEvent = {
        rest: isRest,
        hidden: digit === "8",
        step,
        octave: 4 + octave,
        accidental: isRest ? 0 : accidentalState.get(accidentalKey) ?? 0,
        duration: fraction(numerator, denominator),
        tieStart: false,
        tieStop: false,
        slurStarts: [],
        slurStops: [],
        tuplet: false,
        tupletStart: false,
        tupletStop: false,
        tremolo: 0,
        annotation: null,
        slideUp: null,
        directionsBefore: [],
        directionsAfter: [],
        fermata: false,
        trill: false,
        graceNotes: [],
      };
      addEvent(event);
      continue;
    }

    throw new JpsToMusicXMLConversionError(
      `Unsupported JPS notation "${character}" near "${source.slice(index, index + 12)}".`,
    );
  }

  if (groups.length > 0) {
    throw new JpsToMusicXMLConversionError("An opening parenthesis has no matching closing parenthesis.");
  }
  finishMeasure("regular");
  if (measures.length === 0) {
    throw new JpsToMusicXMLConversionError(`Part ${number} has no notes to export.`);
  }

  return { number, measures };
}

function parseJps(script: string) {
  if (script.length > MAX_JPS_SCRIPT_LENGTH) {
    throw new JpsToMusicXMLConversionError("The JPS script is too large to export.");
  }

  const headers = new Map<string, string[]>();
  const partBodies = new Map<string, string[]>();
  const lines = script.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  for (const [lineIndex, line] of lines.entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const partMatch = /^Q(\d*)\s*:\s*(.*)$/i.exec(trimmed);
    if (partMatch) {
      const number = partMatch[1] || "1";
      const bodies = partBodies.get(number) ?? [];
      bodies.push(partMatch[2]);
      partBodies.set(number, bodies);
      continue;
    }
    const headerMatch = /^([A-Z])\s*:\s*(.*)$/i.exec(trimmed);
    if (headerMatch) {
      const name = headerMatch[1].toUpperCase();
      if (name === "C") {
        throw new JpsToMusicXMLConversionError("Lyrics (C: lines) cannot be exported yet.");
      }
      if (!["V", "B", "D", "P", "J", "Z", "X"].includes(name)) {
        throw new JpsToMusicXMLConversionError(`Unsupported JPS header: ${name}:.`);
      }
      const values = headers.get(name) ?? [];
      values.push(headerMatch[2].trim());
      headers.set(name, values);
      continue;
    }
    throw new JpsToMusicXMLConversionError(`Unsupported JPS content on line ${lineIndex + 1}.`);
  }

  if (partBodies.size === 0) {
    throw new JpsToMusicXMLConversionError("The JPS script does not contain a Q: melody line.");
  }

  const keyValue = headers.get("D")?.[0];
  if (!keyValue) {
    throw new JpsToMusicXMLConversionError("The JPS script is missing its D: key signature.");
  }
  const key = parseKey(keyValue);
  const meterValue = headers.get("P")?.[0];
  const meterMatch = meterValue?.match(/\d+\s*\/\s*\d+/)?.[0];
  if (!meterMatch) {
    throw new JpsToMusicXMLConversionError("The JPS script is missing its P: time signature.");
  }
  const meter = parseMeter(meterMatch);
  const title = headers.get("B")?.[0] ?? "";
  const subtitle = headers.get("B")?.[1] ?? "";
  const composers = headers.get("Z") ?? [];
  const tempoText = headers.get("J")?.[0]?.trim() ?? "";
  const tempo = /^\d+(?:\.\d+)?$/.test(tempoText) && Number(tempoText) > 0
    ? Number(tempoText)
    : null;
  const tempoWords = tempo === null ? tempoText : "";
  const indexNumber = headers.get("X")?.[0] ?? "";
  const parts = [...partBodies.entries()]
    .sort(([left], [right]) => Number(left) - Number(right))
    .map(([number, bodies]) => parsePartBody(number, bodies, meter));

  return { title, subtitle, composers, tempo, tempoWords, indexNumber, key, meter, parts };
}

function divisionsFor(parts: ParsedPart[]): number {
  let divisions = 1;
  for (const part of parts) {
    for (const measure of part.measures) {
      for (const event of measure.events) {
        divisions = (divisions * event.duration.denominator)
          / gcd(divisions, event.duration.denominator);
        if (!Number.isSafeInteger(divisions) || divisions > 16_384) {
          throw new JpsToMusicXMLConversionError("The score uses durations too precise for MusicXML export.");
        }
      }
    }
  }
  return divisions;
}

function renderEvent(event: NoteEvent, key: KeyInfo, divisions: number): string {
  const graceNotes = event.graceNotes.map((graceNote) => {
    const pitch = resolvePitch({
      rest: false,
      step: graceNote.step,
      octave: graceNote.octave,
      accidental: graceNote.accidental,
    }, key);
    if (!pitch) {
      throw new JpsToMusicXMLConversionError("A grace note must have a pitch.");
    }
    const gracePitchXml =
      `<pitch><step>${pitch.step}</step>${pitch.alter === keyAlteration(pitch.step, key.fifths) ? "" : `<alter>${pitch.alter}</alter>`}<octave>${pitch.octave}</octave></pitch>`;
    return `<note><grace${graceNote.slash ? ' slash="yes"' : ""}/>${gracePitchXml}<voice>1</voice></note>`;
  }).join("");
  const pitch = resolvePitch(event, key);
  const pitchXml = pitch
    ? `<pitch><step>${pitch.step}</step>${pitch.alter === keyAlteration(pitch.step, key.fifths) ? "" : `<alter>${pitch.alter}</alter>`}<octave>${pitch.octave}</octave></pitch>`
    : `<rest${event.hidden ? ' print-object="no"' : ""}/>`;
  const duration = event.duration.numerator * (divisions / event.duration.denominator);
  if (!Number.isInteger(duration)) {
    throw new JpsToMusicXMLConversionError("A note duration cannot be represented with the selected MusicXML divisions.");
  }

  const ties = [
    ...(event.tieStop ? ['<tie type="stop"/>'] : []),
    ...(event.tieStart ? ['<tie type="start"/>'] : []),
  ].join("");
  const ornaments = [
    ...(event.tremolo > 0 ? [`<tremolo type="single">${event.tremolo}</tremolo>`] : []),
    ...(event.trill ? ["<trill-mark/>"] : []),
  ].join("");
  const notations = [
    ...event.slurStarts.map((number) => `<slur type="start" number="${number}"/>`),
    ...event.slurStops.map((number) => `<slur type="stop" number="${number}"/>`),
    ...(event.tupletStart ? ['<tuplet type="start"/>'] : []),
    ...(event.tupletStop ? ['<tuplet type="stop"/>'] : []),
    ...(event.fermata ? ["<fermata/>"] : []),
    ...(ornaments ? [`<ornaments>${ornaments}</ornaments>`] : []),
    ...(event.slideUp !== null
      ? [`<slide type="start" line-type="solid" default-y="${event.slideUp ? -5 : 5}"/>`]
      : []),
  ].join("");
  const annotationDirection = event.annotation
    ? `<direction placement="above"><direction-type><rehearsal>${escapeXml(event.annotation)}</rehearsal></direction-type></direction>`
    : "";
  const timeModification = event.tuplet
    ? "<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>"
    : "";

  return `${annotationDirection}${graceNotes}<note>${pitchXml}<duration>${duration}</duration>${ties}<voice>1</voice>${timeModification}${notations ? `<notations>${notations}</notations>` : ""}</note>`;
}

function renderMeasure(
  measure: Measure,
  number: number,
  key: KeyInfo,
  divisions: number,
  initialMeter: Meter,
  tempo: number | null,
  tempoWords: string,
): string {
  const includeTime = number === 1
    || measure.meter.beats !== initialMeter.beats
    || measure.meter.beatType !== initialMeter.beatType;
  const attributesContent = [
    number === 1 ? `<divisions>${divisions}</divisions>` : "",
    number === 1 ? `<key><fifths>${key.fifths}</fifths></key>` : "",
    includeTime
      ? `<time><beats>${measure.meter.beats}</beats><beat-type>${measure.meter.beatType}</beat-type></time>`
      : "",
  ].filter(Boolean).join("");
  const attributes = attributesContent ? `<attributes>${attributesContent}</attributes>` : "";
  const direction = number !== 1
    ? ""
    : tempo
      ? `<direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${tempo}</per-minute></metronome></direction-type><sound tempo="${tempo}"/></direction>`
      : tempoWords
        ? `<direction placement="above"><direction-type><words>${escapeXml(tempoWords)}</words></direction-type></direction>`
        : "";
  const events = measure.events.map((event) =>
    `${event.directionsBefore.join("")}${renderEvent(event, key, divisions)}${event.directionsAfter.join("")}`,
  ).join("");
  const leftRepeat = measure.leftRepeat
    ? '<barline location="left"><bar-style>heavy-light</bar-style><repeat direction="forward"/></barline>'
    : "";
  const rightBarline = measure.rightBarline === "repeat"
    ? '<barline location="right"><bar-style>light-heavy</bar-style><repeat direction="backward"/></barline>'
    : measure.rightBarline === "double"
      ? '<barline location="right"><bar-style>light-light</bar-style></barline>'
      : measure.rightBarline === "final"
        ? '<barline location="right"><bar-style>light-heavy</bar-style></barline>'
        : "";
  const before = measure.directionsBefore.join("");
  const after = measure.directionsAfter.join("");

  return `<measure number="${number}">${attributes}${direction}${leftRepeat}${before}${events}${after}${rightBarline}</measure>`;
}

function safeFilename(title: string): string {
  const normalized = title
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 100);
  return `${normalized || "score"}.musicxml`;
}

export function convertJpsToMusicXML(script: string): { musicXml: string; filename: string } {
  const score = parseJps(script);
  const divisions = divisionsFor(score.parts);
  const workTitle = score.title
    ? `<work><work-title>${escapeXml(score.title)}</work-title></work>`
    : "";
  const movementTitle = score.subtitle
    ? `<movement-title>${escapeXml(score.subtitle)}</movement-title>`
    : "";
  const creators = score.composers
    .map((composer) => `<creator type="composer">${escapeXml(composer)}</creator>`)
    .join("");
  const partList = score.parts
    .map((part, index) => `<score-part id="P${index + 1}"><part-name>Part ${index + 1}</part-name></score-part>`)
    .join("");
  const parts = score.parts.map((part, index) => {
    const measures = part.measures
      .map((measure, measureIndex) => renderMeasure(
        measure,
        measureIndex + 1,
        score.key,
        divisions,
        score.meter,
        score.tempo,
        score.tempoWords,
      ))
      .join("");
    return `<part id="P${index + 1}">${measures}</part>`;
  }).join("");
  const miscellaneous = score.indexNumber
    ? `<miscellaneous><miscellaneous-field name="X">${escapeXml(score.indexNumber)}</miscellaneous-field></miscellaneous>`
    : "";
  const identificationContent = creators + miscellaneous;
  const identification = identificationContent
    ? `<identification>${identificationContent}</identification>`
    : "";
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<score-partwise version="4.0" xmlns="http://www.musicxml.org/ns/musicxml">',
    workTitle,
    movementTitle,
    identification,
    `<part-list>${partList}</part-list>`,
    parts,
    "</score-partwise>",
  ].filter(Boolean).join("");

  return { musicXml: xml, filename: safeFilename(score.title) };
}
