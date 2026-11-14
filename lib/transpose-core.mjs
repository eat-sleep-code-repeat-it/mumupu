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

function getNoteParts(note) {
  const match = note.match(/^([1-7])([,#$'=]*)$/);
  if (!match) {
    throw new Error(`Invalid note: "${note}"`);
  }

  const [, pitch, suffix] = match;
  const octaveMarks = [...suffix].filter((char) => char === "," || char === "'");
  const accidental = suffix.includes("#") ? 1 : suffix.includes("$") ? -1 : suffix.includes("=") ? 0 : null;

  return {
    pitch,
    octaveMarks: octaveMarks.join(""),
    octave: octaveMarks.reduce((value, mark) => value + (mark === "'" ? 1 : -1), 0),
    accidental,
  };
}

function transposePendingNote(note, fromKey, toKey, adjustment, inputAccidentals, outputAccidentals) {
  const noteParts = getNoteParts(note);
  const noteKey = `${noteParts.pitch}:${noteParts.octave}`;
  const inputAccidental = noteParts.accidental ?? inputAccidentals.get(noteKey) ?? 0;
  inputAccidentals.set(noteKey, inputAccidental);

  const accidentalMark = inputAccidental > 0 ? "#" : inputAccidental < 0 ? "$" : "";
  const effectiveNote = `${noteParts.pitch}${accidentalMark}${noteParts.octaveMarks}`;
  const transposedNote = transposeNote(fromKey, toKey, effectiveNote, adjustment);
  const transposedParts = getNoteParts(transposedNote);
  const transposedKey = `${transposedParts.pitch}:${transposedParts.octave}`;
  const transposedAccidental = transposedParts.accidental ?? 0;
  const currentAccidental = outputAccidentals.get(transposedKey) ?? 0;

  outputAccidentals.set(transposedKey, transposedAccidental);

  const outputPitch = transposedNote.replace(/[# $=]/g, "");
  const outputAccidentalMark = transposedAccidental > 0
    ? "#"
    : transposedAccidental < 0
      ? "$"
      : currentAccidental !== 0
        ? "="
        : "";

  return `${outputPitch.slice(0, 1)}${outputAccidentalMark}${outputPitch.slice(1)}`;
}

function transposeLine(line, fromKey, toKey, adjustment = 0) {
  let newLine = "";
  let todoNote = "";
  let inQuotedText = false;
  let isEscaped = false;
  const inputAccidentals = new Map();
  const outputAccidentals = new Map();

  const transposeTodoNote = () => {
    const transposedNote = transposePendingNote(
      todoNote,
      fromKey,
      toKey,
      adjustment,
      inputAccidentals,
      outputAccidentals,
    );
    todoNote = "";
    return transposedNote;
  };

  for (const char of line) {
    if (inQuotedText) {
      newLine += char;
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === "\"") {
        inQuotedText = false;
      }
      continue;
    }

    if (char === "\"") {
      if (todoNote !== "") {
        newLine += transposeTodoNote();
      }
      newLine += char;
      inQuotedText = true;
      continue;
    }

    if (char === " ") {
      continue;
    }

    if (isOneOfSevenKey(char.trim())) {
      if (todoNote === "") {
        todoNote = char;
      } else {
        newLine += transposeTodoNote();
        todoNote = char;
      }
    } else if (char === "," || char === "'" || char === "#" || char === "$" || char === "=") {
      if (todoNote === "") {
        newLine += char;
      } else {
        todoNote += char;
      }
    } else {
      if (todoNote === "") {
        newLine += char;
      } else {
        newLine += `${transposeTodoNote()}${char}`;
      }

      if (char === "|") {
        inputAccidentals.clear();
        outputAccidentals.clear();
      }
    }
  }

  if (todoNote !== "") {
    newLine += transposeTodoNote();
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
