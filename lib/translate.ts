import { DEFAULT_RICH_GLYPH_DEFS } from "./defaultRichGlyphDefs.js";

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
    audioValue: `${rawValue}${octavePart}`,
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

      tokens.push(char);
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

  parsed.lines.forEach((line, lineIndex) => {
    if (line.type !== "Q") return;

    let eventIndex = 0;
    for (const token of line.tokens) {
      if (token === "|") {
        events.push(createJpsEvent("bar", token, lineIndex, eventIndex, measureIndex));
        measureIndex += 1;
        eventIndex += 1;
        continue;
      }

      if (token === "(") {
        events.push(createJpsEvent("group-start", token, lineIndex, eventIndex, measureIndex));
        eventIndex += 1;
        continue;
      }

      if (token === ")") {
        events.push(createJpsEvent("group-end", token, lineIndex, eventIndex, measureIndex));
        eventIndex += 1;
        continue;
      }

      if (token === "-") {
        events.push({
          ...createJpsEvent("hold", token, lineIndex, eventIndex, measureIndex),
          time: 1,
        });
        eventIndex += 1;
        continue;
      }

      const parsedToken = parseJpsTokenParts(token);
      const isDynamic = parsedToken.annotation?.startsWith("p:") ?? false;
      events.push({
        ...createJpsEvent(isDynamic ? "dynamic" : "note", token, lineIndex, eventIndex, measureIndex),
        code: token,
        pitch: isDynamic || parsedToken.isRest ? null : parsedToken.rawValue,
        audio: parsedToken.isRest ? "0" : parsedToken.audioValue,
        time: isDynamic ? 0 : durationTime(parsedToken.durationMark),
        durationMark: parsedToken.durationMark,
        octave: parsedToken.octave,
        accidental: parsedToken.accidental,
        annotation: parsedToken.annotation,
      });
      eventIndex += 1;
    }
  });

  return events;
}

function createJpsEvent(type: JpsEventType, raw: string, lineIndex: number, eventIndex: number, measureIndex: number): JpsEvent {
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
    measureIndex,
    notepos: `0_${lineIndex + 1}_${eventIndex + 1}`,
    lineIndex,
  };
}

function durationTime(durationMark: string): number {
  if (durationMark.includes("/")) return durationMark.includes(".") ? 0.75 : 0.5;
  return durationMark.includes(".") ? 1.5 : 1;
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
  const annotationMatch = normalizedToken.match(/^(.*?)(?:"([^"]*)")$/);
  const annotation = annotationMatch ? annotationMatch[2] ?? null : null;
  const baseToken = annotationMatch ? annotationMatch[1] : normalizedToken;
  const accidentalMatch = baseToken.match(/^(\d+)([#$=]*)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : baseToken;
  const accidental = accidentalMatch ? accidentalMatch[2] : "";
  const restOfToken = accidentalMatch ? accidentalMatch[3] : "";
  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const octaveMatch = pitchSuffix.match(/([',]+)$/);
  const octavePart = octaveMatch ? octaveMatch[1] : "";

  return {
    rawValue,
    audioValue: `${rawValue}${octavePart}`,
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

      if (token === "|") {
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
  const annotationMatch = normalizedToken.match(/^(.*?)(?:"([^"]*)")$/);
  const annotation = annotationMatch ? annotationMatch[2] ?? null : null;
  const baseToken = annotationMatch ? annotationMatch[1] : normalizedToken;

  const accidentalMatch = baseToken.match(/^(\d+)([#$=]*)(.*)$/);
  const rawValue = accidentalMatch ? accidentalMatch[1] : baseToken;
  const accidentals = accidentalMatch ? accidentalMatch[2] : "";
  const restOfToken = accidentalMatch ? accidentalMatch[3] : "";

  const durationMatch = restOfToken.match(/([-/.]+)$/);
  const durationMark = durationMatch ? durationMatch[1] : "";
  const pitchSuffix = durationMatch ? restOfToken.slice(0, -durationMark.length) : restOfToken;
  const octaveMatch = pitchSuffix.match(/^(.*?)([',]+)$/);
  const octavePart = octaveMatch ? octaveMatch[2] : "";

  const isRest = rawValue === "0";
  const isHiddenRest = rawValue === "8";
  const pitch = isRest ? null : rawValue;

  return {
    raw: token,
    value: rawValue,
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
  const right = 923;
  const svgChildren: string[] = [
    `<text x="500" y="110" dy="30.078" text-anchor="middle" fill="#1b1b1b" style="font-weight:bold" font-size="36" font-family="Microsoft YaHei">${escapeXml(primaryTitle(parsed))}</text>`,
  ];

  const subtitle = secondaryTitle(parsed);
  if (subtitle) {
    svgChildren.push(`<text x="500" y="166" dy="16.71" text-anchor="middle" fill="#1b1b1b" font-size="20" font-family="Microsoft YaHei">${escapeXml(subtitle.trim())}</text>`);
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
    svgChildren.push(`<text x="920" y="${creditY}" dy="-2.632" text-anchor="end" fill="#1b1b1b" font-size="16" font-family="Microsoft YaHei">${escapeXml(credit)}</text>`);
  });

  const scoreLines = parsed.lines.filter((line) => line.type === "Q");
  let rowY = rowStart;
  scoreLines.forEach((line, rowIndex) => {
    const sourceLineIndex = parsed.lines.indexOf(line);
    const rowEvents = events.filter((event) => event.lineIndex === sourceLineIndex);
    const lyricLine = parsed.lines[sourceLineIndex + 1];
    const hasLyrics = lyricLine?.type === "C";
    const totalTime = Math.max(1, rowEvents.reduce((sum, event) => sum + event.time, 0));
    const structuralWidth = rowEvents.reduce((sum, event) => {
      if (event.type === "bar") return sum + 27;
      if (event.type === "dynamic") return sum + 54;
      return sum;
    }, 0);
    const unit = Math.max(1, (right - left - structuralWidth) / totalTime);
    let x = left;
    const groupStarts: number[] = [];
    let lastNoteX: number | null = null;
    const noteXs: number[] = [];

    for (const event of rowEvents) {
      if (event.type === "group-start") {
        groupStarts.push(x);
        continue;
      }

      if (event.type === "group-end") {
        const groupStart = groupStarts.pop();
        if (groupStart !== undefined && lastNoteX !== null && lastNoteX > groupStart) {
          const controlX = (groupStart + lastNoteX) / 2;
          svgChildren.push(`<path d="M ${groupStart} ${rowY - 12} Q ${controlX} ${rowY - 28} ${lastNoteX} ${rowY - 12}" fill="none" stroke="#1b1b1b" stroke-width="1" data-notepos="${event.notepos}" />`);
        }
        continue;
      }

      if (event.type === "bar") {
        svgChildren.push(svgUse(x, rowY, "xiaojiexian", ` notepos="${event.notepos}" time="0" audio="" code="${escapeXml(event.code)}"`));
        x += 27;
        continue;
      }

      if (event.type === "hold") {
        svgChildren.push(svgUse(x, rowY, "yanyinfu", ` time="${event.time}" audio="" notepos="${event.notepos}" code="-"`));
      } else if (event.type === "dynamic") {
        const dynamic = (event.annotation ?? event.code).replace(/^p:/i, "");
        const [numerator, denominator] = dynamic.split("/");
        const dynamicX = x + 11;
        if (numerator && denominator) {
          svgChildren.push(svgUse(dynamicX, rowY - 10, `linshi_paihao_shuzi_${numerator}`, ""));
          svgChildren.push(svgUse(dynamicX, rowY, "linshi_paihao_fenxian", ""));
          svgChildren.push(svgUse(dynamicX, rowY + 10, `linshi_paihao_shuzi_${denominator}`, ""));
        } else {
          svgChildren.push(`<text x="${dynamicX}" y="${rowY - 20}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(dynamic)}</text>`);
        }
        x += 54;
      } else if (event.type === "note") {
        const glyph = event.pitch === null ? (event.raw.startsWith("8") ? "shuzi_b_8" : "shuzi_b_0") : `shuzi_b_${event.pitch}`;
        svgChildren.push(svgUse(x, rowY, glyph, ` time="${event.time}" audio="${escapeXml(event.audio ?? "")}" notepos="${event.notepos}" code="${escapeXml(event.code)}"`));
        lastNoteX = x;
        noteXs.push(x);
        if (event.accidental) {
          const accidentalGlyph = event.accidental.includes("#") ? "bianyinfu_sheng" : event.accidental.includes("$") ? "bianyinfu_jiang" : "bianyinfu_huanyuan";
          svgChildren.push(svgUse(x, rowY, accidentalGlyph, ""));
        }
        if (!hasLyrics) {
          for (let octaveIndex = 0; octaveIndex < Math.abs(event.octave); octaveIndex += 1) {
            const octaveGlyph = event.octave > 0 ? "yingao_gao" : "yingao_di";
            const octaveY = event.octave > 0 ? rowY - octaveIndex * 4 : rowY + 5 + octaveIndex * 4;
            svgChildren.push(svgUse(x, octaveY, octaveGlyph, ""));
          }
        }
        if (event.durationMark.includes(".")) {
          svgChildren.push(svgUse(x, rowY, "fudian", ""));
        }
        if (event.annotation) {
          svgChildren.push(`<text x="${x}" y="${rowY - 20}" text-anchor="middle" fill="#1b1b1b" font-size="12" font-family="Microsoft YaHei">${escapeXml(event.annotation)}</text>`);
        }
      }

      x += event.time * unit;
    }
    if (lyricLine?.type === "C") {
      const lyricValues = lyricUnits(lyricLine.content);
      let noteIndex = 0;
      let previousNoteX: number | null = null;
      lyricValues.forEach((lyric) => {
        if (!lyric) {
          return;
        }

        if (/^[，。！？；：、】【》）》,.!?;:]$/.test(lyric) && previousNoteX !== null) {
          svgChildren.push(`<text x="${previousNoteX + 18}" y="${rowY + 38}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei">${escapeXml(lyric)}</text>`);
          return;
        }

        const noteX = noteXs[noteIndex];
        if (noteX === undefined) {
          return;
        }

        previousNoteX = noteX;
        noteIndex += 1;
        svgChildren.push(`<text x="${noteX - 9}" y="${rowY + 38}" dy="6.039" fill="#101010" font-size="18" font-family="Microsoft YaHei" cipos="0_${rowIndex + 1}_${noteIndex}">${escapeXml(lyric)}</text>`);
      });
    }

    rowY += lyricLine?.type === "C" ? 106 : 78;
  });

  const usedGlyphIds = Array.from(new Set(Array.from(svgChildren.join("\n").matchAll(/xlink:href="#([^"]+)"/g)).map((match) => match[1])));

  return `<svg width="${width}" height="${height}" version="1.1" viewBox="${viewBox}" encoding="UTF-8" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" height="100%" width="100%" fill="#ffffff" />${defaultGlyphDefs(usedGlyphIds)}\n${svgChildren.join("\n")}
</svg>`;
}

function svgUse(x: number, y: number, id: string, attrs: string): string {
  return `<use x="${x}" y="${y}" xlink:href="#${id}" xmlns:xlink="http://www.w3.org/1999/xlink"${attrs} ></use>`;
}

function defaultGlyphDefs(usedGlyphIds: string[]): string {
  const glyphDefsById = new Map(
    Array.from(DEFAULT_RICH_GLYPH_DEFS.matchAll(/<g id="([^"]+)"[\s\S]*?<\/g>/g)).map((match) => [match[1], match[0]]),
  );
  const glyphDefs = usedGlyphIds
    .map((glyphId) => glyphDefsById.get(glyphId))
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
