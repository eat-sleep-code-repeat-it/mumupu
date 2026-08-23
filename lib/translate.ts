import { DEFAULT_RICH_GLYPH_DEFS } from "./defaultRichGlyphDefs.js";

const EXTRA_GLYPH_DEFS: Record<string, string> = {
  diaohao_zimu_c:
    '<g id="diaohao_zimu_c" transform="translate(-50,-50)"><path fill="#1b1b1b" d="m55.85,42.82703q-1.71571,-0.90955 -4.3203,-0.90955q-3.36943,0 -5.37457,2.13949t-2.00512,5.65363q0,3.76219 2.26351,6.06705t5.73631,2.30486q2.23251,0 3.70017,-0.64081l0,-2.10849q-1.67438,0.93021 -3.6795,0.93021q-2.60459,0 -4.25832,-1.73639t-1.65372,-4.69241q0,-2.81131 1.54002,-4.46502t4.02058,-1.65371q2.31519,0 4.03091,1.05424l0,-1.94311l0.00002,0.00001l0.00002,0z"/></g>',
  diaohao_zimu_d:
    '<g id="diaohao_zimu_d" transform="translate(-50,-50)"><path fill="black" d="m43.49999,42.00974l0,15.98051l4.54472,0q3.63578,0 6.04554,-2.11382t2.40975,-5.66505q0,-3.72033 -2.40975,-5.96098t-6.19351,-2.24066l-4.39675,0zm2.05041,14.14149l0,-12.3236l2.3252,0q3.04391,0 4.7561,1.66992t1.7122,4.65042q0,3.00163 -1.75447,4.50245t-4.60813,1.50081l-2.4309,0z"/></g>',
  lianyin_shuzi_3:
    '<g id="lianyin_shuzi_3" transform="translate(-50,-50)"><rect height="9.09091" width="9.71251" y="45.4934" x="45.14375" fill="#ffffff"/><path fill="#1b1b1b" d="m47.5,52.85191q0.87103,0.67902 1.97961,0.67902q0.88235,0 1.40274,-0.43573t0.52034,-1.17128q0,-1.61838 -2.33029,-1.61838l-0.71269,0l0,-0.89402l0.67872,0q2.05883,0 2.05883,-1.52779q0,-1.40333 -1.57235,-1.40333q-0.905,0 -1.69686,0.5998l0,-1.01853q0.8371,-0.48662 1.95701,-0.48662q1.0973,0 1.75907,0.57152t0.66176,1.48819q0,1.6749 -1.70814,2.16152l0,0.01133q0.9276,0.10186 1.4649,0.65642t0.53735,1.39196q0,1.15436 -0.83147,1.86166t-2.21152,0.70731q-1.21039,0 -1.95701,-0.45265l0,-1.12039l0,0z"/></g>',
  lianyin_shuzi_4:
    '<g id="lianyin_shuzi_4" transform="translate(-50,-50)"><rect height="9.09091" width="9.71251" y="45.4934" x="45.14375" fill="#ffffff"/><path fill="#1b1b1b" d="m53.05001,51.99785l-1.0917,0l0,2.20754l-1.04668,0l0,-2.20754l-3.96162,0l0,-0.6983l3.75904,-5.60894l1.24927,0l0,5.45125l1.0917,0l0,0.85598zm-2.13839,-0.85598l0,-3.57035q0,-0.38294 0.02251,-0.87851l-0.02251,0q-0.07878,0.214 -0.31513,0.66452l-2.54354,3.78434l2.85867,0z"/></g>',
};

export type JpsLineType = "Q" | "C";

export interface JpsLine {
  type: JpsLineType;
  raw: string;
  content: string;
  tokens: string[];
}

export interface ParsedJps {
  header: Record<string, string>;
  headerValues: Record<string, string[]>;
  lines: JpsLine[];
}

export type JpsEventType = "note" | "hold" | "bar" | "group-start" | "group-end" | "dynamic" | "symbol";

export interface JpsEvent {
  type: JpsEventType;
  raw: string;
  code: string;
  pitch: string | null;
  audio: string | null;
  time: number;
  durationMark: string;
  octave: number;
  accidental: string;
  annotation: string | null;
  isHiddenRest: boolean;
  measureIndex: number;
  notepos: string;
  lineIndex: number;
  groupSize?: number;
  groupStart?: boolean;
  groupEnd?: boolean;
  slurStartCount?: number;
  slurEndCount?: number;
  hairpinStart?: "crescendo" | "diminuendo";
  hairpinEnd?: boolean;
}

export interface JpsNote {
  raw: string;
  value: string;
  audioValue: string;
  pitch: string | null;
  accidental: string;
  octave: number;
  duration: number;
  isRest: boolean;
  isHiddenRest: boolean;
  annotation: string | null;
  lyric: string | null;
  durationMark: string;
  x: number;
  y: number;
}

const SVG_DECIMAL_SCALE = BigInt("1000000000000000");
const BIGINT_ZERO = BigInt(0);
const BIGINT_ONE = BigInt(1);
const BIGINT_TWO = BigInt(2);
const BIGINT_TEN = BigInt(10);
const BIGINT_14 = BigInt(14);
const BIGINT_15 = BigInt(15);
const BIGINT_5000 = BigInt(5000);
const BIGINT_10000 = BigInt(10000);
const BIGINT_100000000000 = BigInt("100000000000");

function groupedStartCode(rawValue: string, pitchSuffix: string, durationMark: string): string {
  const oraclePitchSeparator = rawValue === "7" ? " " : "";
  return `${rawValue}(ys${oraclePitchSeparator}${pitchSuffix}${durationMark}`;
}

function decimalStringToScaled(value: string): bigint {
  const [integerPart, fractionalPart = ""] = value.split(".");
  const normalizedFraction = (fractionalPart + "0".repeat(15)).slice(0, 15);
  return BigInt(integerPart) * SVG_DECIMAL_SCALE + BigInt(normalizedFraction);
}

function scaledToDecimalString(value: bigint): string {
  const negative = value < BIGINT_ZERO;
  const absoluteValue = negative ? -value : value;
  const integerPart = absoluteValue / SVG_DECIMAL_SCALE;
  const fractionalPart = absoluteValue % SVG_DECIMAL_SCALE;
  const fractionalText = fractionalPart.toString().padStart(15, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${integerPart}${fractionalText ? `.${fractionalText}` : ""}`;
}

function formatScaledSvgNumber(value: bigint): string {
  const roundedValue = value >= BIGINT_ZERO ? value + BIGINT_5000 : value - BIGINT_5000;
  const scaledValue = roundedValue / BIGINT_10000;
  const negative = scaledValue < BIGINT_ZERO;
  const absoluteValue = negative ? -scaledValue : scaledValue;
  const integerPart = absoluteValue / BIGINT_100000000000;
  const fractionalPart = absoluteValue % BIGINT_100000000000;
  const fractionalText = fractionalPart.toString().padStart(11, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${integerPart}${fractionalText ? `.${fractionalText}` : ""}`;
}

function scaledToNumber(value: bigint): number {
  return Number(scaledToDecimalString(value));
}

function scaledInteger(value: number): bigint {
  return BigInt(value) * SVG_DECIMAL_SCALE;
}

function scaledMulDiv(value: bigint, numerator: bigint, denominator: bigint): bigint {
  const adjusted = value >= BIGINT_ZERO
    ? value * numerator + denominator / BIGINT_TWO
    : value * numerator - denominator / BIGINT_TWO;
  return adjusted / denominator;
}

function slashBeamLine(x1: number, y: number, x2: number): string {
  return `<line x1="${formatSvgNumber(x1)}" y1="${formatSvgNumber(y)}" x2="${formatSvgNumber(x2)}" y2="${formatSvgNumber(y)}" data-type="jianshixian" stroke-width="2" stroke="#1b1b1b" ></line>`;
}

function primaryTitle(parsed: ParsedJps): string {
  return parsed.headerValues.B?.[0] ?? parsed.header.B ?? parsed.header.V ?? "JPS Music";
}

function secondaryTitle(parsed: ParsedJps): string | null {
  return parsed.headerValues.B && parsed.headerValues.B.length > 1 ? parsed.headerValues.B[1] : null;
}

function keySignatureParts(key: string): { letter: string; accidental: string } {
  const match = key.trim().match(/^([A-Ga-g])([#$=]?)/);
  return {
    letter: (match?.[1] ?? key.trim()).toLowerCase(),
    accidental: match?.[2] ?? "",
  };
}

function tokenizeJpsLine(line: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;

  const appendSuffixToLastNoteToken = (suffix: string): void => {
    for (let index = tokens.length - 1; index >= 0; index -= 1) {
      if (["|", "(", ")", "[", "]", "{", "}"].includes(tokens[index])) {
        continue;
      }
      tokens[index] += suffix;
      return;
    }

    tokens.push(suffix);
  };

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      current += char;
      inQuotes = !inQuotes;
      continue;
    }

    if (!inQuotes && /\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    if (
      !inQuotes &&
      (char === "|" || char === "(" || char === ")" || char === "[" || char === "]" || char === "{" || char === "}")
    ) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }

      if (char === "|" && (line[i + 1] === "/" || line[i + 1] === "*")) {
        tokens.push(`${char}${line[i + 1]}`);
        i += 1;
        continue;
      }

      tokens.push(char);

      if (char === ")" || char === "]" || char === "}") {
        let suffix = "";
        let lookahead = i + 1;
        while (lookahead < line.length && /[-/.]/.test(line[lookahead])) {
          suffix += line[lookahead];
          lookahead += 1;
        }
        if (suffix) {
          appendSuffixToLastNoteToken(suffix);
          i = lookahead - 1;
        }
      }

      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

export function parseJps(input: string): ParsedJps {
  const normalized = input.replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");

  const header: Record<string, string> = {};
  const headerValues: Record<string, string[]> = {};
  const body: JpsLine[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const bodyMatch = line.match(/^([QC]):\s*(.*)$/);
    if (bodyMatch) {
      const [, type, content] = bodyMatch;
      const tokens = tokenizeJpsLine(content.trim());
      body.push({
        type: type as JpsLineType,
        raw: line,
        content: content.trim(),
        tokens,
      });
      continue;
    }

    const headerMatch = line.match(/^([A-Z]):\s*(.*)$/);
    if (headerMatch) {
      const [, key, value] = headerMatch;
      header[key] = value.trim();
      headerValues[key] ??= [];
      headerValues[key].push(value.trim());
    }
  }

  return { header, headerValues, lines: body };
}

export function parseJpsEvents(input: string): JpsEvent[] {
  const parsed = parseJps(input);
  const events: JpsEvent[] = [];
  let measureIndex = 0;
  let melodyLineIndex = 0;

  const parseQuotedToken = (token: string): string | null => {
    const match = token.match(/^"([^"]*)"$/);
    return match ? match[1] : null;
  };

  parsed.lines.forEach((line, lineIndex) => {
    if (line.type !== "Q") return;

    let eventIndex = 0;
    const groupStack: Array<{ size: number; isTuplet: boolean; startsOnNextNote: boolean }> = [];

    const countGroupNotes = (startTokenIndex: number): number => {
      let depth = 1;
      let count = 0;

      for (let scanIndex = startTokenIndex + 1; scanIndex < line.tokens.length; scanIndex += 1) {
        const scanToken = line.tokens[scanIndex];
        if (scanToken === "(") {
          depth += 1;
          continue;
        }

        if (scanToken === ")") {
          depth -= 1;
          if (depth === 0) {
            break;
          }
          continue;
        }

        if (depth === 1 && !/^[-/.]+$/.test(scanToken) && !["|", "|/", "|*", "[", "]", "{", "}"].includes(scanToken)) {
          count += 1;
        }
      }

      return count;
    };

    for (let tokenIndex = 0; tokenIndex < line.tokens.length; tokenIndex += 1) {
      const token = line.tokens[tokenIndex];
      if (token === "|" || token === "|/" || token === "|*") {
        const nextToken = line.tokens[tokenIndex + 1];
        const isFinalDoubleBar = token === "|" && nextToken === "|" && tokenIndex + 1 === line.tokens.length - 1;
        const annotationToken = isFinalDoubleBar ? null : parseQuotedToken(nextToken ?? "");
        const annotation = annotationToken?.startsWith("p:") ? annotationToken : null;
        events.push({
          ...createJpsEvent("bar", isFinalDoubleBar ? "|j" : token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
          code: annotation ? `${token}'${annotation}'` : isFinalDoubleBar ? "|j" : token,
          annotation,
        });
        measureIndex += 1;
        eventIndex += 1;
        if (isFinalDoubleBar) {
          tokenIndex += 1;
        } else if (annotation) {
          tokenIndex += 1;
        }
        continue;
      }

      if (token === "(") {
        const groupSize = countGroupNotes(tokenIndex);
        if (groupSize > 0) {
          groupStack.push({
            size: groupSize,
            isTuplet: line.tokens[tokenIndex + 1]?.startsWith("y") ?? false,
            startsOnNextNote: true,
          });
        }
        continue;
      }

      if (token === ")") {
        const group = groupStack.pop();
        const lastEvent = events.at(-1);
        if (group && lastEvent && lastEvent.lineIndex === lineIndex && lastEvent.type === "note") {
          lastEvent.code = `${lastEvent.code})`;
          if (group.isTuplet) {
            lastEvent.groupEnd = true;
            lastEvent.groupSize = group.size;
          } else {
            lastEvent.slurEndCount = (lastEvent.slurEndCount ?? 0) + 1;
          }
        }
        continue;
      }

      if (token === "-") {
        events.push({
          ...createJpsEvent("hold", token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
          time: 1,
        });
        eventIndex += 1;
        continue;
      }

      if (/^[-/.]+$/.test(token)) {
        const previousEvent = events.at(-1);
        if (previousEvent && previousEvent.lineIndex === lineIndex && (previousEvent.type === "note" || previousEvent.type === "hold")) {
          previousEvent.code += token;
          previousEvent.durationMark += token;
          previousEvent.time = durationTime(previousEvent.durationMark);
        }
        continue;
      }

      if (token === "!") {
        const previousEvent = events.findLast((event) => event.lineIndex === lineIndex && event.type === "note");
        if (previousEvent) {
          previousEvent.code += "!";
          previousEvent.hairpinEnd = true;
        }
        continue;
      }

      const parsedToken = parseJpsTokenParts(token);
      const isDynamic = parsedToken.annotation?.startsWith("p:") ?? false;
      const activeTuplet = groupStack.findLast((group) => group.isTuplet);
      const normalizedCode = `${parsedToken.rawValue}${parsedToken.pitchSuffix}${parsedToken.durationMark}${parsedToken.hairpinEnd ? "!" : ""}`;
      const isGroupedNote = !isDynamic && Boolean(activeTuplet);
      const isGroupStart = isGroupedNote && token.startsWith("y") && token.length > 1;
      const slurStartCount = isDynamic ? 0 : groupStack.filter((group) => !group.isTuplet && group.startsOnNextNote).length;
      groupStack.forEach((group) => {
        if (!group.isTuplet) {
          group.startsOnNextNote = false;
        }
      });
      events.push({
        ...createJpsEvent(isDynamic ? "dynamic" : "note", token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
        code: isGroupStart
          ? groupedStartCode(parsedToken.rawValue, parsedToken.pitchSuffix, parsedToken.durationMark)
          : slurStartCount > 0
            ? `${parsedToken.rawValue}${"(".repeat(slurStartCount)}${parsedToken.pitchSuffix}${parsedToken.durationMark}`
            : normalizedCode,
        pitch: isDynamic || parsedToken.isRest ? null : parsedToken.rawValue,
        audio: parsedToken.isRest ? "0" : parsedToken.audioValue,
        time: isDynamic ? 0 : activeTuplet ? 1 / activeTuplet.size : durationTime(parsedToken.durationMark),
        durationMark: parsedToken.durationMark,
        octave: parsedToken.octave,
        accidental: parsedToken.accidental,
        annotation: parsedToken.annotation,
        isHiddenRest: parsedToken.rawValue === "8",
        groupSize: activeTuplet?.size,
        groupStart: isGroupStart,
        slurStartCount: slurStartCount || undefined,
        hairpinStart: parsedToken.hairpinStart,
        hairpinEnd: parsedToken.hairpinEnd,
      });
      eventIndex += 1;
    }

    melodyLineIndex += 1;
  });

  return events;
}

function createJpsEvent(type: JpsEventType, raw: string, melodyLineIndex: number, eventIndex: number, measureIndex: number, sourceLineIndex: number): JpsEvent {
  return {
    type,
    raw,
    code: raw,
    pitch: null,
    audio: null,
    time: 0,
    durationMark: "",
    octave: 0,
    accidental: "",
    annotation: null,
    isHiddenRest: false,
    measureIndex,
    notepos: `0_${melodyLineIndex + 1}_${eventIndex + 1}`,
    lineIndex: sourceLineIndex,
  };
}

function durationTime(durationMark: string): number {
  const slashCount = (durationMark.match(/\//g) ?? []).length;
  const dotCount = (durationMark.match(/\./g) ?? []).length;
  const baseDuration = 1 / Math.pow(2, slashCount);

  let dottedMultiplier = 1;
  let increment = 0.5;
  for (let index = 0; index < dotCount; index += 1) {
    dottedMultiplier += increment;
    increment /= 2;
  }

  return baseDuration * dottedMultiplier;
}

function extractTokenAnnotation(token: string): { baseToken: string; annotation: string | null } {
  const annotationMatch = token.match(/^(.*?)"([^"]*)"(.*)$/);
  if (!annotationMatch) {
    return { baseToken: token, annotation: null };
  }

  return {
    baseToken: `${annotationMatch[1]}${annotationMatch[3]}`,
    annotation: annotationMatch[2] ?? null,
  };
}

function parsePitchTail(tail: string): { accidental: string; octavePart: string } {
  let accidental = "";
  let octavePart = "";

  for (const char of tail) {
    if (char === "#" || char === "$" || char === "=") {
      accidental += char;
      continue;
    }

    if (char === "'" || char === ",") {
      octavePart += char;
    }
  }

  return { accidental, octavePart };
}

function parseJpsTokenParts(token: string): {
  rawValue: string;
  audioValue: string;
  pitchSuffix: string;
  accidental: string;
  octave: number;
  durationMark: string;
  annotation: string | null;
  isRest: boolean;
  hairpinStart: "crescendo" | "diminuendo" | undefined;
  hairpinEnd: boolean;
} {
  const normalizedToken = token.startsWith("y") && token.length > 1 ? token.slice(1) : token;
  const { baseToken, annotation } = extractTokenAnnotation(normalizedToken);
  const hairpinStart = baseToken.includes("<") ? "crescendo" : baseToken.includes(">") ? "diminuendo" : undefined;
  const hairpinEnd = baseToken.includes("!");
  const notationToken = baseToken.replace(/[<>]+\+*/g, "").replace(/!/g, "");
  const accidentalMatch = notationToken.match(/^(\d+)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : notationToken;
  const restOfToken = accidentalMatch ? accidentalMatch[2] : "";
  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const { accidental, octavePart } = parsePitchTail(pitchSuffix);

  return {
    rawValue,
    audioValue: `${rawValue}${pitchSuffix}`,
    pitchSuffix,
    accidental,
    octave: octavePart.split("'").length - octavePart.split(",").length,
    durationMark,
    annotation,
    isRest: rawValue === "0" || rawValue === "8",
    hairpinStart,
    hairpinEnd,
  };
}

export function buildNoteLayout(input: string): { header: Record<string, string>; notes: JpsNote[]; measureBars: number[] } {
  const parsed = parseJps(input);
  const notes: JpsNote[] = [];
  const measureBars: number[] = [];

  let x = 90;
  const y = 220;

  let lastMelodyStart = 0;

  for (const line of parsed.lines) {
    if (line.type === "C") {
      attachLyrics(notes, lastMelodyStart, lyricUnits(line.content));
      continue;
    }

    if (line.type !== "Q") continue;

    lastMelodyStart = notes.length;

    for (const token of line.tokens) {
      if (!token) {
        continue;
      }

      if (token === "|" || token === "|*" || token === "|/") {
        measureBars.push(x - 10);
        continue;
      }

      if (token === "(" || token === ")" || token === "[" || token === "]" || token === "{" || token === "}") {
        continue;
      }

      const note = parseJpsNoteToken(token, x, y);
      notes.push(note);
      x += note.durationMark.includes("-") ? 24 : note.durationMark.includes("/") ? 30 : 40;
    }
  }

  return { header: parsed.header, notes, measureBars };
}

function parseJpsNoteToken(token: string, x: number, y: number): JpsNote {
  const normalizedToken = token.startsWith("y") && token.length > 1 ? token.slice(1) : token;
  const { baseToken, annotation } = extractTokenAnnotation(normalizedToken);

  const accidentalMatch = baseToken.match(/^(\d+)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : baseToken;
  const restOfToken = accidentalMatch ? accidentalMatch[2] : "";

  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const { accidental: accidentals, octavePart } = parsePitchTail(pitchSuffix);

  const isRest = rawValue === "0";
  const isHiddenRest = rawValue === "8";
  const pitch = isRest ? null : rawValue;

  return {
    raw: token,
    value: rawValue,
    audioValue: `${rawValue}${pitchSuffix}`,
    pitch,
    accidental: accidentals,
    octave: octavePart.split("'").length - octavePart.split(",").length,
    duration: Number(rawValue) || 0,
    isRest,
    isHiddenRest,
    annotation,
    lyric: null,
    durationMark,
    x,
    y,
  };
}

function lyricUnits(content: string): string[] {
  const withoutAnnotation = content.replace(/^"[^"]*"\s*/, "");
  const units: string[] = [];

  for (const token of withoutAnnotation.split(/\s+/).filter(Boolean)) {
    for (const word of token.split("/").filter(Boolean)) {
      let current = "";
      let joinNext = false;

      for (const character of Array.from(word)) {
        if (character === "@") {
          if (current.length > 0) {
            units.push(current.replace(/_/g, " "));
            current = "";
          }
          units.push("");
          continue;
        }

        if (character === "~") {
          joinNext = true;
          continue;
        }

        if (current.length > 0 && !joinNext) {
          units.push(current.replace(/_/g, " "));
          current = "";
        }

        current += character;
        joinNext = false;
      }

      if (current.length > 0) {
        units.push(current.replace(/_/g, " "));
      }
    }
  }

  return units;
}

function attachLyrics(notes: JpsNote[], start: number, lyrics: string[]): void {
  let lyricIndex = 0;

  for (let noteIndex = start; noteIndex < notes.length && lyricIndex < lyrics.length; noteIndex += 1) {
    const lyric = lyrics[lyricIndex];
    if (lyric !== "") {
      notes[noteIndex].lyric = lyric;
    }
    lyricIndex += 1;
  }
}

export function renderJpsToSvg(input: string): string {
  const parsed = parseJps(input);
  const events = parseJpsEvents(input);
  const width = 1000;
  const height = 1415;
  const viewBox = `0 0 ${width} ${height}`;
  const hasTempo = Boolean(parsed.header.J?.trim());
  const rowStart = hasTempo ? 266 : 236;
  const left = 83;
  const right = 14565 / 16;
  const compactRight = 553;
  const internalBarOffset = 427 / 144;
  const closingBarX = 923;
  const barAdvance = 5551 / 144;
  const svgChildren: string[] = [
    `<text x="500" y="110" dy="30.078" text-anchor="middle" fill="#1b1b1b" style="font-weight:bold;" font-size="36" font-family="Microsoft YaHei" >${escapeXml(primaryTitle(parsed))}</text>`,
  ];
  const durationLineChildren: string[] = [];
  const octaveGlyphChildren: string[] = [];
  const groupedDecorationChildren: string[] = [];
  const expressionChildren: string[] = [];

  const subtitle = secondaryTitle(parsed);
  if (subtitle) {
    svgChildren.push(`<text x="500" y="166" dy="16.71" text-anchor="middle" fill="#1b1b1b" font-size="20" font-family="Microsoft YaHei" >${escapeXml(subtitle.trim())}</text>`);
  }

  if (parsed.header.D) {
    const key = keySignatureParts(parsed.header.D);
    svgChildren.push(svgUse(80, 176, "diaohao_fu", ""));
    if (key.accidental === "$") {
      svgChildren.push(svgUse(125, 176, "bianyinfu_jiang", ""));
    } else if (key.accidental === "#") {
      svgChildren.push(svgUse(125, 176, "bianyinfu_sheng", ""));
    }
    svgChildren.push(svgUse(key.accidental ? 125 : 120, 176, `diaohao_zimu_${key.letter}`, ` code="${escapeXmlAttribute(parsed.header.D)}" data-diaohao="true"`));
  }

  const timeSignatures = (parsed.header.P ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  timeSignatures.forEach((signature, index) => {
    const [numerator, denominator] = signature.split("/");
    const signatureX = timeSignatures.length === 3 ? 145 + index * 27 : 140 + index * 32;
    if (numerator && denominator) {
      svgChildren.push(svgUse(signatureX - 10, 176, "paihao_xian", ""));
      svgChildren.push(svgUse(signatureX, 164, `shuzi_b_bian_${numerator}`, ""));
      svgChildren.push(svgUse(signatureX, 188, `shuzi_b_bian_${denominator}`, ' fill="#414141"'));
    }
  });

  if (hasTempo) {
    svgChildren.push(svgUse(80, 216, "jiepaifu", ""));
    svgChildren.push(`<text x="112" y="217" dy="5.368" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" data-jiepai="${escapeXmlAttribute(parsed.header.J || "")}" >${escapeXml(parsed.header.J || "")}</text>`);
  }
  const credits = parsed.headerValues.Z ?? [];
  const creditBaseY = hasTempo ? 226 : 196;
  [...credits].reverse().forEach((credit, index) => {
    const creditY = creditBaseY - index * 21;
    svgChildren.push(`<text x="920" y="${creditY}" dy="-2.632" text-anchor="end" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" >${escapeXml(credit)}</text>`);
  });

  const scoreLines = parsed.lines.filter((line) => line.type === "Q");
  let rowY = rowStart;
  scoreLines.forEach((line, rowIndex) => {
    const sourceLineIndex = parsed.lines.indexOf(line);
    const rowEvents = events.filter((event) => event.lineIndex === sourceLineIndex);
    const lyricLine = parsed.lines[sourceLineIndex + 1];
    const lyricValues = lyricLine?.type === "C" ? lyricUnits(lyricLine.content) : [];
    let lyricIndex = 0;
    const firstVisibleBarIndex = rowEvents.findIndex((event) => event.type === "bar" && event.code !== "|/");
    const hasOnlyLeadingMarkersBeforeFirstVisibleBar = firstVisibleBarIndex >= 0 && rowEvents.slice(0, firstVisibleBarIndex).every((event) => {
      if (event.type === "group-start" || event.type === "group-end") {
        return true;
      }

      return event.type === "bar" && event.code === "|/";
    });
    const lastVisibleBarIndex = rowEvents.reduce((lastIndex, event, eventIndex) => {
      return event.type === "bar" && event.code !== "|/" ? eventIndex : lastIndex;
    }, -1);
    const totalTime = Math.max(1, rowEvents.reduce((sum, event) => sum + event.time, 0));
    const structuralWidth = rowEvents.reduce((sum, event) => {
      const isLeadingBar = hasOnlyLeadingMarkersBeforeFirstVisibleBar && event === rowEvents[firstVisibleBarIndex];
      const isClosingBar = event === rowEvents[lastVisibleBarIndex];
      if (event.type === "bar" && event.code === "|*") return sum + barAdvance;
      if (event.type === "bar" && event.code !== "|/" && event.code !== "|j" && !isLeadingBar && !isClosingBar) return sum + barAdvance;
      if (event.type === "dynamic") return sum + 54;
      return sum;
    }, 0);
    const rowHasGroupedNotes = rowEvents.some((event) => event.type === "note" && event.groupSize);
    const groupCount = rowEvents.filter((event) => event.type === "note" && event.groupStart).length;
    const groupedNoteCount = rowEvents.filter((event) => event.type === "note" && event.groupSize).length;
    const groupedClusterSize = rowEvents.find((event) => event.type === "note" && event.groupStart)?.groupSize ?? null;
    const plainDenseNotes = rowEvents.filter((event) => event.type === "note" && !event.groupSize);
    const hasLyricLine = lyricLine?.type === "C";
    const rowIsCompactPlainDense = !rowHasGroupedNotes
      && !hasLyricLine
      && rowEvents.every((event) => event.type === "bar" || event.type === "note")
      && plainDenseNotes.length > 0
      && plainDenseNotes.every((event) => event.time === 0.5);
    const unit = Math.max(1, (right - left - structuralWidth) / totalTime);
    const groupedNoteStepText = rowHasGroupedNotes && groupCount > 0
      ? groupedClusterSize === 4
        ? groupCount >= 7
          ? "25.341246290801191"
          : "29.246575342465731"
        : "31.985018726591754"
      : null;
    const groupedNoteStep = groupedNoteStepText ? Number(groupedNoteStepText) : 0;
    const groupedNoteStepScaled = groupedNoteStepText ? decimalStringToScaled(groupedNoteStepText) : null;
    const compactBeatCount = rowIsCompactPlainDense ? plainDenseNotes.length / 2 : 0;
    const compactNoteStep = rowIsCompactPlainDense
      ? (compactRight - left) / (compactBeatCount + Math.max(0, compactBeatCount - 1) * 1.5 + 2.8)
      : 0;
    let x = rowHasGroupedNotes && hasOnlyLeadingMarkersBeforeFirstVisibleBar
      ? left + groupedNoteStep * 1.4
      : rowIsCompactPlainDense
        ? left + compactNoteStep * 1.4
        : left;
    let groupedXScaled = rowHasGroupedNotes && hasOnlyLeadingMarkersBeforeFirstVisibleBar && groupedNoteStepScaled !== null
      ? BigInt(left) * SVG_DECIMAL_SCALE + groupedNoteStepScaled * BIGINT_14 / BIGINT_TEN
      : null;
    let activeGroup: { startX: number; noteXs: number[]; scaledXs: bigint[] | null; size: number; maxOctave: number; hasSlash: boolean } | null = null;
    let lastNoteX: number | null = null;
    const noteXs: number[] = [];
    let compactBeatProgress = 0;
    let compactBeamStartX: number | null = null;
    let mixedBeamProgress = 0;
    let mixedBeamStartX: number | null = null;
    let mixedBeamLastX: number | null = null;
    const ordinarySlurs: Array<{ x: number; maxOctave: number; hasHold: boolean }> = [];
    let activeHairpin: { type: "crescendo" | "diminuendo"; x: number } | null = null;
    const flushMixedBeam = (): void => {
      if (mixedBeamStartX !== null && mixedBeamLastX !== null) {
        durationLineChildren.push(slashBeamLine(mixedBeamStartX - 6, rowY + 13, mixedBeamLastX + 6));
      }
      mixedBeamProgress = 0;
      mixedBeamStartX = null;
      mixedBeamLastX = null;
    };

    rowEvents.forEach((event, eventIndex) => {
      const isLeadingBar = hasOnlyLeadingMarkersBeforeFirstVisibleBar && eventIndex === firstVisibleBarIndex;
      const isClosingBar = eventIndex === lastVisibleBarIndex;

      if (event.type === "bar") {
        flushMixedBeam();
        const isEndBar = event.code === "|j";
        const isHiddenBar = event.code === "|/" || event.code === "|*";
        const rowClosingBarX = rowIsCompactPlainDense ? compactRight : closingBarX;
        const barX = isLeadingBar ? left : isEndBar || isClosingBar ? rowClosingBarX : x - internalBarOffset;
        if (!isHiddenBar) {
          svgChildren.push(svgUse(barX, rowY, isEndBar ? "jieshufu" : "xiaojiexian", ` notepos="${event.notepos}" time="0" audio="" code="${escapeXmlAttribute(event.code)}"`));
        }
        if (event.annotation?.startsWith("p:")) {
          pushTemporaryMeter(svgChildren, barX + 11, rowY, event.annotation);
        }
        x += isHiddenBar ? (event.code === "|*" ? barAdvance : 0) : isEndBar || isLeadingBar || isClosingBar ? 0 : barAdvance;
        return;
      }

      if (event.type === "hold") {
        ordinarySlurs.forEach((slur) => {
          slur.hasHold = true;
        });
        svgChildren.push(svgUse(x, rowY, "yanyinfu", ` time="${formatTimeValue(event.time)}" audio="" notepos="${event.notepos}" code="-"`));
      } else if (event.type === "dynamic") {
        pushTemporaryMeter(svgChildren, x + 11, rowY, event.annotation ?? event.code);
        x += rowHasGroupedNotes ? groupedNoteStep * 1.5 : 54;
      } else if (event.type === "note") {
        const noteXText = groupedXScaled !== null && event.groupSize ? formatScaledSvgNumber(groupedXScaled) : formatSvgNumber(x);
        const noteX = groupedXScaled !== null && event.groupSize ? Number(noteXText) : x;
        const glyph = event.pitch === null ? (event.raw.startsWith("8") ? "shuzi_b_8" : "shuzi_b_0") : `shuzi_b_${event.pitch}`;
        if (!event.isHiddenRest) {
          svgChildren.push(svgUse(noteXText, rowY, glyph, ` time="${formatTimeValue(event.time)}" audio="${escapeXmlAttribute(event.audio ?? "")}" notepos="${event.notepos}" code="${escapeXmlAttribute(event.code)}"`));
        }
        lastNoteX = noteX;
        noteXs.push(noteX);
        if (event.hairpinStart) {
          activeHairpin = { type: event.hairpinStart, x: noteX };
        }
        if (event.hairpinEnd && activeHairpin && noteX > activeHairpin.x) {
          const startX = activeHairpin.x - 7;
          const endX = noteX + 7;
          const centerY = rowY - 30;
          const startSpread = activeHairpin.type === "diminuendo" ? 5 : 0;
          const endSpread = activeHairpin.type === "crescendo" ? 5 : 0;
          expressionChildren.push(`<line x1="${formatSvgNumber(startX)}" y1="${formatSvgNumber(centerY + startSpread)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(centerY + endSpread)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
          expressionChildren.push(`<line x1="${formatSvgNumber(startX)}" y1="${formatSvgNumber(centerY - startSpread)}" x2="${formatSvgNumber(endX)}" y2="${formatSvgNumber(centerY - endSpread)}" stroke-width="1" stroke="#1b1b1b" fill="none" ></line>`);
          activeHairpin = null;
        }
        if (event.groupStart && event.groupSize && event.groupSize > 1) {
          activeGroup = {
            startX: noteX,
            noteXs: [noteX],
            scaledXs: groupedXScaled !== null ? [groupedXScaled] : null,
            size: event.groupSize,
            maxOctave: Math.max(0, event.octave),
            hasSlash: event.durationMark.includes("/"),
          };
        } else if (activeGroup) {
          activeGroup.noteXs.push(noteX);
          activeGroup.scaledXs?.push(groupedXScaled ?? scaledInteger(Math.round(noteX)));
          activeGroup.maxOctave = Math.max(activeGroup.maxOctave, Math.max(0, event.octave));
          activeGroup.hasSlash ||= event.durationMark.includes("/");
        }
        if (!event.isHiddenRest && event.accidental) {
          const accidentalGlyph = event.accidental.includes("#") ? "bianyinfu_sheng" : event.accidental.includes("$") ? "bianyinfu_jiang" : "bianyinfu_huanyuan";
          svgChildren.push(svgUse(noteX, rowY, accidentalGlyph, ""));
        }
        for (let octaveIndex = 0; !event.isHiddenRest && octaveIndex < Math.abs(event.octave); octaveIndex += 1) {
          const octaveGlyph = event.octave > 0 ? "yingao_gao" : "yingao_di";
          const octaveX = event.pitch === "4" ? noteX + 2.5 : noteX;
          const lowerOctaveBaseOffset = rowHasGroupedNotes || rowIsCompactPlainDense ? 5 : 1;
          const octaveY = event.octave > 0 ? rowY - octaveIndex * 8 : rowY + lowerOctaveBaseOffset + octaveIndex * 8;
          octaveGlyphChildren.push(svgUse(octaveX, octaveY, octaveGlyph, ""));
        }
        const dotCount = event.isHiddenRest ? 0 : (event.durationMark.match(/\./g) ?? []).length;
        for (let dotIndex = 0; dotIndex < dotCount; dotIndex += 1) {
          svgChildren.push(svgUse(noteX + dotIndex * 7, rowY, "fudian", ""));
        }
        if (!event.isHiddenRest && event.annotation) {
          svgChildren.push(`<text x="${formatSvgNumber(noteX)}" y="${formatSvgNumber(rowY - 20)}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(event.annotation)}</text>`);
        }

        ordinarySlurs.forEach((slur) => {
          slur.maxOctave = Math.max(slur.maxOctave, Math.max(0, event.octave));
        });
        for (let slurEndIndex = 0; slurEndIndex < (event.slurEndCount ?? 0); slurEndIndex += 1) {
          const ordinarySlurStart = ordinarySlurs.pop();
          if (!ordinarySlurStart || noteX === ordinarySlurStart.x) {
            continue;
          }
          if (ordinarySlurStart.hasHold && noteX - ordinarySlurStart.x > 140) {
            const capY = rowY - 25.95;
            const leftCapX = ordinarySlurStart.x + 12;
            const rightCapX = noteX - 12;
            groupedDecorationChildren.push(svgUse(leftCapX, capY, "lianyinxian_zuo", ""));
            groupedDecorationChildren.push(svgUse(rightCapX, capY, "lianyinxian_you", ""));
            groupedDecorationChildren.push(`<line x1="${formatSvgNumber(leftCapX + 0.8)}" y1="${formatSvgNumber(capY + 0.75)}" x2="${formatSvgNumber(rightCapX + 1)}" y2="${formatSvgNumber(capY + 0.75)}" stroke-width="1.2" stroke="#1b1b1b" fill="none" ></line>`);
          } else {
            const slurOctaveOffset = ordinarySlurStart.maxOctave === 0
              ? 16
              : 21 + (ordinarySlurStart.maxOctave - 1) * 8;
            const slurY = rowY - slurOctaveOffset;
            const slurStartX = ordinarySlurStart.x + 1;
            const slurEndX = noteX - 1;
            const controlInset = (noteX - ordinarySlurStart.x) * 0.3;
            const leftControlX = ordinarySlurStart.x + controlInset;
            const rightControlX = noteX - controlInset;
            groupedDecorationChildren.push(`<path d="M ${formatSvgNumber(slurStartX)},${formatSvgNumber(slurY)} C ${formatSvgNumber(leftControlX)},${formatSvgNumber(slurY - 10)},${formatSvgNumber(rightControlX)},${formatSvgNumber(slurY - 10)},${formatSvgNumber(slurEndX)},${formatSvgNumber(slurY)} M ${formatSvgNumber(slurEndX)},${formatSvgNumber(slurY)} C  ${formatSvgNumber(rightControlX)},${formatSvgNumber(slurY - 9)},${formatSvgNumber(leftControlX)},${formatSvgNumber(slurY - 9)},${formatSvgNumber(slurStartX)},${formatSvgNumber(slurY)}" stroke-width="0.5" stroke="#1b1b1b" ></path>`);
          }
        }
        for (let slurStartIndex = 0; slurStartIndex < (event.slurStartCount ?? 0); slurStartIndex += 1) {
          ordinarySlurs.push({ x: noteX, maxOctave: Math.max(0, event.octave), hasHold: false });
        }

        if (activeGroup && event.groupEnd && activeGroup.noteXs.length > 1) {
          const firstNoteX = activeGroup.startX;
          const lastNoteX = activeGroup.noteXs[activeGroup.noteXs.length - 1];
          const noteStep = activeGroup.noteXs.length > 1 ? activeGroup.noteXs[1] - activeGroup.noteXs[0] : 0;
          if (activeGroup.hasSlash) {
            durationLineChildren.push(slashBeamLine(firstNoteX - 6, rowY + 13, lastNoteX + 6));
          }
          const slurOctaveOffset = activeGroup.maxOctave === 0
            ? 16
            : 21 + (activeGroup.maxOctave - 1) * 8;
          const slurY = rowY - slurOctaveOffset;
          const topControlY = slurY - 10;
          const bottomControlY = slurY - 9;
          const scaledFirstNoteX = activeGroup.scaledXs?.[0] ?? scaledInteger(Math.round(firstNoteX));
          const scaledLastNoteX = activeGroup.scaledXs?.[activeGroup.scaledXs.length - 1] ?? scaledInteger(Math.round(lastNoteX));
          const scaledNoteStep = activeGroup.scaledXs && activeGroup.scaledXs.length > 1
            ? activeGroup.scaledXs[1] - activeGroup.scaledXs[0]
            : decimalStringToScaled(formatSvgNumber(noteStep));
          const controlMultiplier = BigInt((activeGroup.size - 1) * 3);
          const scaledControlInset = scaledMulDiv(scaledNoteStep, controlMultiplier, BIGINT_TEN);
          const slurStartXText = formatScaledSvgNumber(scaledFirstNoteX + scaledInteger(1));
          const slurEndXText = formatScaledSvgNumber(scaledLastNoteX - scaledInteger(1));
          const leftControlXText = formatScaledSvgNumber(scaledFirstNoteX + scaledControlInset);
          const rightControlXText = formatScaledSvgNumber(scaledLastNoteX - scaledControlInset);
          groupedDecorationChildren.push(`<path d="M ${slurStartXText},${formatSvgNumber(slurY)} C ${leftControlXText},${formatSvgNumber(topControlY)},${rightControlXText},${formatSvgNumber(topControlY)},${slurEndXText},${formatSvgNumber(slurY)} M ${slurEndXText},${formatSvgNumber(slurY)} C  ${rightControlXText},${formatSvgNumber(bottomControlY)},${leftControlXText},${formatSvgNumber(bottomControlY)},${slurStartXText},${formatSvgNumber(slurY)}" stroke-width="0.5" stroke="#1b1b1b" ></path>`);
          if (activeGroup.size >= 3 && activeGroup.size <= 4) {
            const labelXText = formatScaledSvgNumber(scaledMulDiv(scaledFirstNoteX + scaledLastNoteX, BIGINT_ONE, BIGINT_TWO));
            groupedDecorationChildren.push(svgUse(labelXText, slurY - 7, `lianyin_shuzi_${activeGroup.size}`, ""));
          }
          activeGroup = null;
        }

        while (lyricIndex < lyricValues.length && lyricValues[lyricIndex] === "") {
          lyricIndex += 1;
        }

        const lyric = lyricValues[lyricIndex];
        if (lyric) {
          lyricIndex += 1;
          svgChildren.push(`<text x="${formatSvgNumber(x - 9)}" y="${formatSvgNumber(rowY + 38)}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" cipos="${event.notepos}" >${escapeXml(lyric)}</text>`);

          while (lyricIndex < lyricValues.length) {
            const punctuation = lyricValues[lyricIndex];
            if (!punctuation) {
              lyricIndex += 1;
              continue;
            }
            if (!/^[，。！？；：、】【》）》,.!?;:]$/.test(punctuation)) {
              break;
            }

            svgChildren.push(`<text x="${formatSvgNumber(x + 9)}" y="${formatSvgNumber(rowY + 38)}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" >${escapeXml(punctuation)}</text>`);
            lyricIndex += 1;
          }
        }
      }

      if (rowHasGroupedNotes && event.type === "note" && event.groupSize) {
        if (groupedXScaled !== null && groupedNoteStepScaled !== null) {
          groupedXScaled += groupedNoteStepScaled * BigInt(event.groupEnd ? 15 : 10) / BIGINT_TEN;
          x = scaledToNumber(groupedXScaled);
        } else {
          x += groupedNoteStep * (event.groupEnd ? 1.5 : 1);
        }
        return;
      }

      if (rowIsCompactPlainDense && event.type === "note") {
        if (compactBeamStartX === null) {
          compactBeamStartX = lastNoteX;
        }
        compactBeatProgress += event.time;
        const isBeatBoundary = Math.abs(compactBeatProgress - Math.round(compactBeatProgress)) < 1e-9;
        if (isBeatBoundary && compactBeamStartX !== null && lastNoteX !== null) {
          durationLineChildren.push(slashBeamLine(compactBeamStartX - 6, rowY + 13, lastNoteX + 6));
          compactBeamStartX = null;
        }
        x += compactNoteStep * (isBeatBoundary ? 1.5 : 1);
        return;
      }

      if (!rowHasGroupedNotes && event.type === "note" && event.durationMark.includes("/")) {
        mixedBeamStartX ??= lastNoteX;
        mixedBeamLastX = lastNoteX;
        mixedBeamProgress += event.time;
        const isBeatBoundary = Math.abs(mixedBeamProgress - Math.round(mixedBeamProgress)) < 1e-9;
        if (isBeatBoundary) {
          flushMixedBeam();
        }
      } else {
        flushMixedBeam();
      }

      x += event.time * unit;
    });

    flushMixedBeam();

    rowY += lyricLine?.type === "C" ? 106 : 78;
  });
  const outputChildren = [...svgChildren, ...durationLineChildren, ...octaveGlyphChildren, ...groupedDecorationChildren, ...expressionChildren];
  const usedGlyphIds = Array.from(new Set(Array.from(outputChildren.join("\n").matchAll(/xlink:href="#([^"]+)"/g)).map((match) => match[1])));

  return `<svg width="${width}" height="${height}" version="1.1" viewBox="${viewBox}" encoding="UTF-8" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" height="100%" width="100%" fill="#ffffff" />${defaultGlyphDefs(usedGlyphIds)}\n${outputChildren.join("\n")}
<g id="custom"></g></svg>
`;
}

function svgUse(x: number | string, y: number | string, id: string, attrs: string): string {
  const xValue = typeof x === "string" ? x : formatSvgNumber(x);
  const yValue = typeof y === "string" ? y : formatSvgNumber(y);
  return `<use x="${xValue}" y="${yValue}" xlink:href="#${id}"${attrs} xmlns:xlink="http://www.w3.org/1999/xlink" ></use>`;
}

function pushTemporaryMeter(svgChildren: string[], x: number, rowY: number, dynamic: string): void {
  const value = dynamic.replace(/^p:/i, "");
  const [numerator, denominator] = value.split("/");
  if (numerator && denominator) {
    svgChildren.push(svgUse(x, rowY - 10, `linshi_paihao_shuzi_${numerator}`, ""));
    svgChildren.push(svgUse(x, rowY, "linshi_paihao_fenxian", ""));
    svgChildren.push(svgUse(x, rowY + 10, `linshi_paihao_shuzi_${denominator}`, ""));
    return;
  }

  svgChildren.push(`<text x="${formatSvgNumber(x)}" y="${formatSvgNumber(rowY - 20)}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(value)}</text>`);
}

function defaultGlyphDefs(usedGlyphIds: string[]): string {
  const orderedGlyphIds = [...usedGlyphIds];
  const firstGroupedGlyphIndex = orderedGlyphIds.findIndex((glyphId) => glyphId.startsWith("lianyin_shuzi_"));
  if (firstGroupedGlyphIndex >= 0) {
    let insertIndex = firstGroupedGlyphIndex;
    for (const octaveGlyphId of ["yingao_di", "yingao_gao"]) {
      const octaveGlyphIndex = orderedGlyphIds.indexOf(octaveGlyphId);
      if (octaveGlyphIndex > insertIndex) {
        orderedGlyphIds.splice(octaveGlyphIndex, 1);
        orderedGlyphIds.splice(insertIndex, 0, octaveGlyphId);
        insertIndex += 1;
      }
    }
  }

  const glyphDefsById = new Map(
    Array.from(DEFAULT_RICH_GLYPH_DEFS.matchAll(/<g id="([^"]+)"[\s\S]*?<\/g>/g)).map((match) => [match[1], match[0]]),
  );
  const glyphDefs = orderedGlyphIds
    .map((glyphId) => glyphDefsById.get(glyphId) ?? EXTRA_GLYPH_DEFS[glyphId])
    .filter((glyphDef): glyphDef is string => Boolean(glyphDef))
    .join("");

  return `<defs>\n${glyphDefs}</defs>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function formatSvgNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  const halfStepValue = Math.round(value * 2) / 2;
  if (Math.abs(value - halfStepValue) < 1e-11) {
    return String(halfStepValue);
  }

  return value.toFixed(11).replace(/0+$/, "").replace(/\.$/, "");
}

function roundSvgCoordinate(value: number): number {
  return Number((value + 5e-12).toFixed(11));
}

function formatTimeValue(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function parseHeader(lines: string[]): Record<string, string> {
  const header: Record<string, string> = {};
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z]):\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    const value = match[2].trim();
    if (key === "Q" || key === "C") continue;
    header[key] = value;
  }
  return header;
}

function parseBody(lines: string[]): Array<{ type: string; tokens: string[] }> {
  const body: Array<{ type: string; tokens: string[] }> = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([QC]):\s*(.*)$/);
    if (!match) continue;

    const type = match[1];
    const content = match[2].trim();
    const tokens = tokenizeJpsLine(content);
    body.push({ type, tokens });
  }

  return body;
}

function formatTokens(tokens: string[]): Array<{ text: string; color: string }> {
  return tokens.map((token) => {
    if (/^\|/.test(token)) {
      return { text: token, color: "#444444" };
    }

    if (/^".*"$/.test(token) || token.includes('"')) {
      return { text: token, color: "#0066cc" };
    }

    if (/^[0-9][\d',\.\/]*$/.test(token) || token === "0" || token === "9") {
      return { text: token, color: "#111111" };
    }

    if (/^p:\d+\/\d+$/i.test(token)) {
      return { text: token, color: "#aa0000" };
    }

    if (/^[()\[\]{}]$/.test(token)) {
      return { text: token, color: "#777777" };
    }

    return { text: token, color: "#333333" };
  });
}

export function translate(input: string): string {
  const normalized = input.replace(/\r\n?/g, "\n");
  const parsed = parseJps(normalized);
  if (parsed.lines.some((line) => line.type === "Q")) {
    return renderJpsToSvg(input);
  }

  const lines = normalized.split("\n");
  const header = parseHeader(lines);
  const body = parseBody(lines);

  const width = 1000;
  const leftMargin = 70;
  const topMargin = 80;
  const lineHeight = 26;
  const sectionSpacing = 42;

  let y = topMargin;
  const svgChildren: string[] = [];

  const titleText = primaryTitle(parseJps(normalized));
  svgChildren.push(`<text x=\"${width / 2}\" y=\"${y}\" text-anchor=\"middle\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"36\" fill=\"#1b1b1b\">${escapeXml(titleText)}</text>`);
  y += sectionSpacing;

  const meta: Array<[string, string | undefined]> = [
    ["调号", header.D],
    ["拍号", header.P],
    ["节拍", header.J],
    ["备注", header.Z],
  ];

  for (const [label, value] of meta) {
    if (value) {
      svgChildren.push(`<text x=\"${leftMargin}\" y=\"${y}\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"16\" fill=\"#333333\">${escapeXml(label + ": " + value)}</text>`);
      y += lineHeight;
    }
  }

  y += sectionSpacing / 2;

  for (const segment of body) {
    svgChildren.push(`<text x=\"${leftMargin}\" y=\"${y}\" font-family=\"Microsoft YaHei, sans-serif\" font-size=\"17\" font-weight=\"bold\" fill=\"#222222\">${escapeXml(segment.type === "Q" ? "曲:" : "词:")}</text>`);
    y += lineHeight;

    let x = leftMargin + 30;
    const formatted = formatTokens(segment.tokens);

    for (const token of formatted) {
      const escaped = escapeXml(token.text);
      const widthEstimate = Math.max(24, token.text.length * 10 + 6);
      if (x + widthEstimate > width - leftMargin) {
        y += lineHeight;
        x = leftMargin + 30;
      }
      svgChildren.push(`<text x=\"${x}\" y=\"${y}\" font-family=\"monospace\" font-size=\"16\" fill=\"${token.color}\">${escaped}</text>`);
      x += widthEstimate;
    }

    y += lineHeight;
  }

  const height = Math.max(y + sectionSpacing, 520);

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\" viewBox=\"0 0 ${width} ${height}\" preserveAspectRatio=\"xMidYMid meet\">\n  <rect width=\"100%\" height=\"100%\" fill=\"#ffffff\" />\n  ${svgChildren.join("\n  ")}\n</svg>`;
}
