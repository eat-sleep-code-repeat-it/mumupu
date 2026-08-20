import { DEFAULT_RICH_GLYPH_DEFS } from "./defaultRichGlyphDefs.js";

const EXTRA_GLYPH_DEFS: Record<string, string> = {
  diaohao_zimu_c:
    '<g id="diaohao_zimu_c" transform="translate(-50,-50)"><path fill="#1b1b1b" d="m55.85,42.82703q-1.71571,-0.90955 -4.3203,-0.90955q-3.36943,0 -5.37457,2.13949t-2.00512,5.65363q0,3.76219 2.26351,6.06705t5.73631,2.30486q2.23251,0 3.70017,-0.64081l0,-2.10849q-1.67438,0.93021 -3.6795,0.93021q-2.60459,0 -4.25832,-1.73639t-1.65372,-4.69241q0,-2.81131 1.54002,-4.46502t4.02058,-1.65371q2.31519,0 4.03091,1.05424l0,-1.94311l0.00002,0.00001l0.00002,0z"/></g>',
  diaohao_zimu_d:
    '<g id="diaohao_zimu_d" transform="translate(-50,-50)"><path fill="black" d="m43.49999,42.00974l0,15.98051l4.54472,0q3.63578,0 6.04554,-2.11382t2.40975,-5.66505q0,-3.72033 -2.40975,-5.96098t-6.19351,-2.24066l-4.39675,0zm2.05041,14.14149l0,-12.3236l2.3252,0q3.04391,0 4.7561,1.66992t1.7122,4.65042q0,3.00163 -1.75447,4.50245t-4.60813,1.50081l-2.4309,0z"/></g>',
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
    for (let tokenIndex = 0; tokenIndex < line.tokens.length; tokenIndex += 1) {
      const token = line.tokens[tokenIndex];
      if (token === "|" || token === "|/" || token === "|*") {
        const nextToken = line.tokens[tokenIndex + 1];
        const isFinalDoubleBar = token === "|" && nextToken === "|" && tokenIndex + 1 === line.tokens.length - 1;
        const annotationToken = isFinalDoubleBar ? null : parseQuotedToken(nextToken ?? "");
        const annotation = annotationToken?.startsWith("p:") ? annotationToken : null;
        events.push({
          ...createJpsEvent("bar", isFinalDoubleBar ? "|j" : token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
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
        events.push(createJpsEvent("group-start", token, melodyLineIndex, eventIndex, measureIndex, lineIndex));
        eventIndex += 1;
        continue;
      }

      if (token === ")") {
        events.push(createJpsEvent("group-end", token, melodyLineIndex, eventIndex, measureIndex, lineIndex));
        eventIndex += 1;
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

      const parsedToken = parseJpsTokenParts(token);
      const isDynamic = parsedToken.annotation?.startsWith("p:") ?? false;
      events.push({
        ...createJpsEvent(isDynamic ? "dynamic" : "note", token, melodyLineIndex, eventIndex, measureIndex, lineIndex),
        code: token,
        pitch: isDynamic || parsedToken.isRest ? null : parsedToken.rawValue,
        audio: parsedToken.isRest ? "0" : parsedToken.audioValue,
        time: isDynamic ? 0 : durationTime(parsedToken.durationMark),
        durationMark: parsedToken.durationMark,
        octave: parsedToken.octave,
        accidental: parsedToken.accidental,
        annotation: parsedToken.annotation,
        isHiddenRest: parsedToken.rawValue === "8",
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
  accidental: string;
  octave: number;
  durationMark: string;
  annotation: string | null;
  isRest: boolean;
} {
  const normalizedToken = token.startsWith("y") && token.length > 1 ? token.slice(1) : token;
  const { baseToken, annotation } = extractTokenAnnotation(normalizedToken);
  const accidentalMatch = baseToken.match(/^(\d+)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : baseToken;
  const restOfToken = accidentalMatch ? accidentalMatch[2] : "";
  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const { accidental, octavePart } = parsePitchTail(pitchSuffix);

  return {
    rawValue,
    audioValue: `${rawValue}${pitchSuffix}`,
    accidental,
    octave: octavePart.split("'").length - octavePart.split(",").length,
    durationMark,
    annotation,
    isRest: rawValue === "0" || rawValue === "8",
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
  const right = 910.3125;
  const barAdvance = 38.54861111111;
  const svgChildren: string[] = [
    `<text x="500" y="110" dy="30.078" text-anchor="middle" fill="#1b1b1b" style="font-weight:bold;" font-size="36" font-family="Microsoft YaHei" >${escapeXml(primaryTitle(parsed))}</text>`,
  ];
  const trailingGlyphChildren: string[] = [];

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
    svgChildren.push(svgUse(key.accidental ? 125 : 120, 176, `diaohao_zimu_${key.letter}`, ` code="${escapeXml(parsed.header.D)}" data-diaohao="true"`));
  }

  const timeSignatures = (parsed.header.P ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  timeSignatures.forEach((signature, index) => {
    const [numerator, denominator] = signature.split("/");
    const signatureX = 140 + index * 32;
    if (numerator && denominator) {
      svgChildren.push(svgUse(signatureX - 10, 176, "paihao_xian", ""));
      svgChildren.push(svgUse(signatureX, 164, `shuzi_b_bian_${numerator}`, ""));
      svgChildren.push(svgUse(signatureX, 188, `shuzi_b_bian_${denominator}`, ' fill="#414141"'));
    }
  });

  if (hasTempo) {
    svgChildren.push(svgUse(80, 216, "jiepaifu", ""));
    svgChildren.push(`<text x="112" y="217" dy="5.368" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei" data-jiepai="${escapeXml(parsed.header.J || "")}">${escapeXml(parsed.header.J || "")}</text>`);
  }
  const credits = parsed.headerValues.Z ?? [];
  credits.forEach((credit, index) => {
    const creditY = (hasTempo ? 205 : 196) + index * 21;
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
    const lastVisibleBarIndex = rowEvents.reduce((lastIndex, event, eventIndex) => {
      return event.type === "bar" && event.code !== "|/" ? eventIndex : lastIndex;
    }, -1);
    const totalTime = Math.max(1, rowEvents.reduce((sum, event) => sum + event.time, 0));
    const structuralWidth = rowEvents.reduce((sum, event) => {
      const isLeadingBar = event === rowEvents[firstVisibleBarIndex];
      const isClosingBar = event === rowEvents[lastVisibleBarIndex];
      if (event.type === "bar" && event.code === "|*") return sum + barAdvance;
      if (event.type === "bar" && event.code !== "|/" && event.code !== "|j" && !isLeadingBar && !isClosingBar) return sum + barAdvance;
      if (event.type === "dynamic") return sum + 54;
      return sum;
    }, 0);
    const unit = Math.max(1, (right - left - structuralWidth) / totalTime);
    let x = left;
    const groupStarts: number[] = [];
    let lastNoteX: number | null = null;
    const noteXs: number[] = [];

    rowEvents.forEach((event, eventIndex) => {
      const isLeadingBar = eventIndex === firstVisibleBarIndex;
      const isClosingBar = eventIndex === lastVisibleBarIndex;
      if (event.type === "group-start") {
        groupStarts.push(x);
        return;
      }

      if (event.type === "group-end") {
        const groupStart = groupStarts.pop();
        if (groupStart !== undefined && lastNoteX !== null && lastNoteX > groupStart) {
          const controlX = (groupStart + lastNoteX) / 2;
          svgChildren.push(`<path d="M ${groupStart} ${rowY - 12} Q ${controlX} ${rowY - 28} ${lastNoteX} ${rowY - 12}" fill="none" stroke="#1b1b1b" stroke-width="1" data-notepos="${event.notepos}" />`);
        }
        return;
      }

      if (event.type === "bar") {
        const isEndBar = event.code === "|j";
        const isHiddenBar = event.code === "|/" || event.code === "|*";
        const barX = isLeadingBar ? left : isEndBar || isClosingBar ? right : x;
        if (!isHiddenBar) {
          svgChildren.push(svgUse(barX, rowY, isEndBar ? "jieshufu" : "xiaojiexian", ` notepos="${event.notepos}" time="0" audio="" code="${escapeXml(event.code)}"`));
        }
        if (event.annotation?.startsWith("p:")) {
          pushTemporaryMeter(svgChildren, barX + 11, rowY, event.annotation);
        }
        x += isHiddenBar ? (event.code === "|*" ? barAdvance : 0) : isEndBar || isLeadingBar || isClosingBar ? 0 : barAdvance;
        return;
      }

      if (event.type === "hold") {
        svgChildren.push(svgUse(x, rowY, "yanyinfu", ` time="${event.time}" audio="" notepos="${event.notepos}" code="-"`));
      } else if (event.type === "dynamic") {
        pushTemporaryMeter(svgChildren, x + 11, rowY, event.annotation ?? event.code);
        x += 54;
      } else if (event.type === "note") {
        const glyph = event.pitch === null ? (event.raw.startsWith("8") ? "shuzi_b_8" : "shuzi_b_0") : `shuzi_b_${event.pitch}`;
        if (!event.isHiddenRest) {
          svgChildren.push(svgUse(x, rowY, glyph, ` time="${event.time}" audio="${escapeXml(event.audio ?? "")}" notepos="${event.notepos}" code="${escapeXml(event.code)}"`));
        }
        lastNoteX = x;
        noteXs.push(x);
        if (!event.isHiddenRest && event.accidental) {
          const accidentalGlyph = event.accidental.includes("#") ? "bianyinfu_sheng" : event.accidental.includes("$") ? "bianyinfu_jiang" : "bianyinfu_huanyuan";
          svgChildren.push(svgUse(x, rowY, accidentalGlyph, ""));
        }
        for (let octaveIndex = 0; !event.isHiddenRest && octaveIndex < Math.abs(event.octave); octaveIndex += 1) {
          const octaveGlyph = event.octave > 0 ? "yingao_gao" : "yingao_di";
          const octaveY = event.octave > 0 ? rowY - octaveIndex * 4 : rowY + 1 + octaveIndex * 4;
          trailingGlyphChildren.push(svgUse(x, octaveY, octaveGlyph, ""));
        }
        const dotCount = event.isHiddenRest ? 0 : (event.durationMark.match(/\./g) ?? []).length;
        for (let dotIndex = 0; dotIndex < dotCount; dotIndex += 1) {
          svgChildren.push(svgUse(x + dotIndex * 7, rowY, "fudian", ""));
        }
        if (!event.isHiddenRest && event.annotation) {
          svgChildren.push(`<text x="${x}" y="${rowY - 20}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(event.annotation)}</text>`);
        }

        while (lyricIndex < lyricValues.length && lyricValues[lyricIndex] === "") {
          lyricIndex += 1;
        }

        const lyric = lyricValues[lyricIndex];
        if (lyric) {
          lyricIndex += 1;
          svgChildren.push(`<text x="${x - 9}" y="${rowY + 38}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" cipos="0_${rowIndex + 1}_${noteXs.length}" >${escapeXml(lyric)}</text>`);

          while (lyricIndex < lyricValues.length) {
            const punctuation = lyricValues[lyricIndex];
            if (!punctuation) {
              lyricIndex += 1;
              continue;
            }
            if (!/^[，。！？；：、】【》）》,.!?;:]$/.test(punctuation)) {
              break;
            }

            svgChildren.push(`<text x="${x + 9}" y="${rowY + 38}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" >${escapeXml(punctuation)}</text>`);
            lyricIndex += 1;
          }
        }
      }

      x += event.time * unit;
    });

    rowY += lyricLine?.type === "C" ? 106 : 78;
  });
  const outputChildren = [...svgChildren, ...trailingGlyphChildren];
  const usedGlyphIds = Array.from(new Set(Array.from(outputChildren.join("\n").matchAll(/xlink:href="#([^"]+)"/g)).map((match) => match[1])));

  return `<svg width="${width}" height="${height}" version="1.1" viewBox="${viewBox}" encoding="UTF-8" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" height="100%" width="100%" fill="#ffffff" />${defaultGlyphDefs(usedGlyphIds)}\n${outputChildren.join("\n")}
</svg>`;
}

function svgUse(x: number, y: number, id: string, attrs: string): string {
  return `<use x="${x}" y="${y}" xlink:href="#${id}"${attrs} xmlns:xlink="http://www.w3.org/1999/xlink" ></use>`;
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

  svgChildren.push(`<text x="${x}" y="${rowY - 20}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(value)}</text>`);
}

function defaultGlyphDefs(usedGlyphIds: string[]): string {
  const glyphDefsById = new Map(
    Array.from(DEFAULT_RICH_GLYPH_DEFS.matchAll(/<g id="([^"]+)"[\s\S]*?<\/g>/g)).map((match) => [match[1], match[0]]),
  );
  const glyphDefs = usedGlyphIds
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
