const sharpNotes = ["1", "1#", "2", "2#", "3", "4", "4#", "5", "5#", "6", "6#", "7"];
const flatNotes = ["1", "2$", "2", "3$", "3", "4", "5$", "5", "6$", "6", "7$", "7"];
const sharpMajorKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const flatMajorKeys = ["C", "D$", "D", "E$", "E", "F", "G$", "G", "A$", "A", "B$", "B"];
const alternativeNotes = {
  "3#": "4",
  "3,#": "4,",
  "3#,": "4,",
  "3,,#": "4,,",
  "3#,,": "4,,",
  "3'#": "4'",
  "3#'": "4'",
  "3''#": "4''",
  "3#''": "4''",
  "7,#": "1",
  "7#,": "1",
  "7#": "1'",
  "7#'": "1''",
};

const isSharpNote = true;

function fanQieKey(movable) {
  const base = movable.split("-")[0];
  const keyDict = {
    C: "C",
    "C#": "C#",
    Db: "D$",
    D: "D",
    "D#": "D#",
    Eb: "E$",
    E: "E",
    F: "F",
    "F#": "F#",
    Gb: "G$",
    G: "G",
    "G#": "G#",
    Ab: "A$",
    A: "A",
    "A#": "A#",
    Bb: "B$",
    B: "B",
  };
  return keyDict[base];
}

function replaceAlternativeNote(note) {
  return alternativeNotes[note] ?? note;
}

function isOneOfSevenKey(note) {
  return ["1", "2", "3", "4", "5", "6", "7"].includes(note);
}

function getMajorIndex(majorKey) {
  const mapped = fanQieKey(majorKey);
  if (sharpMajorKeys.includes(mapped)) {
    return sharpMajorKeys.indexOf(mapped);
  }
  if (flatMajorKeys.includes(mapped)) {
    return flatMajorKeys.indexOf(mapped);
  }
  return null;
}

function moveNote(note, numSemitone) {
  const normalizedNote = replaceAlternativeNote(note);
  const maxLen = 12;
  const flatSymbol = ",";
  const sharpSymbol = "'";

  const cleanNote = normalizedNote.replaceAll(flatSymbol, "").replaceAll(sharpSymbol, "");
  let flat = (normalizedNote.match(/,/g) ?? []).length;
  let sharp = (normalizedNote.match(/'/g) ?? []).length;

  let notePos = -1;
  if (sharpNotes.includes(cleanNote)) {
    notePos = sharpNotes.indexOf(cleanNote);
  } else if (flatNotes.includes(cleanNote)) {
    notePos = flatNotes.indexOf(cleanNote);
  } else {
    throw new Error(`Invalid note: "${note}"`);
  }

  let pos = notePos + numSemitone;
  if (pos < 0) {
    flat += 1;
    pos += maxLen;
  } else {
    sharp += Math.floor(pos / maxLen);
    pos %= maxLen;
  }

  const adjust = sharp - flat;
  const chromatic = isSharpNote ? sharpNotes[pos] : flatNotes[pos];

  if (adjust < 0) {
    return `${chromatic}${flatSymbol.repeat(Math.abs(adjust))}`;
  }
  return `${chromatic}${sharpSymbol.repeat(adjust)}`;
}

function transposeNote(fromKey, toKey, fromNote, adjustment = 0) {
  const fromKeyIndex = getMajorIndex(fromKey);
  const toKeyIndex = getMajorIndex(toKey);

  if (fromKeyIndex === null) {
    throw new Error(`Invalid from key: ${fromKey}`);
  }
  if (toKeyIndex === null) {
    throw new Error(`Invalid to key: ${toKey}`);
  }

  const diffKey = fromKeyIndex - toKeyIndex + adjustment;
  return moveNote(fromNote, diffKey);
}

function transposeLine(line, fromKey, toKey, adjustment = 0) {
  let newLine = "";
  let todoNote = "";

  for (const char of line) {
    if (char === " ") {
      continue;
    }

    if (isOneOfSevenKey(char.trim())) {
      if (todoNote === "") {
        todoNote = char;
      } else {
        newLine += transposeNote(fromKey, toKey, todoNote, adjustment);
        todoNote = char;
      }
    } else if (char === "," || char === "'" || char === "#" || char === "$") {
      if (todoNote === "") {
        newLine += char;
      } else {
        todoNote += char;
      }
    } else {
      if (todoNote === "") {
        newLine += char;
      } else {
        newLine += `${transposeNote(fromKey, toKey, todoNote, adjustment)}${char}`;
      }
      todoNote = "";
    }
  }

  if (todoNote !== "") {
    newLine += transposeNote(fromKey, toKey, todoNote, adjustment);
  }

  return newLine;
}

function splitLinesKeepEndings(input) {
  const matches = input.match(/[^\r\n]*\r?\n|[^\r\n]+/g);
  return matches ?? [];
}

export function transposeScriptByAdjustment(script, adjustment) {
  const lines = splitLinesKeepEndings(script);
  let result = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("Q:")) {
      result += transposeLine(line, "C", "C", adjustment);
    } else if (trimmed.length < 1) {
      continue;
    } else {
      result += line;
    }
  }

  return result;
}
