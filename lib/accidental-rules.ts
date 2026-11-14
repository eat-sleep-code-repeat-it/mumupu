export type AccidentalRuleViolation = {
  start: number;
  end: number;
  line: number;
  column: number;
  note: string;
};

function isNoteSuffix(char: string): boolean {
  return char === "#" || char === "$" || char === "=" || char === "," || char === "'";
}

export function checkAccidentalRules(script: string): AccidentalRuleViolation[] {
  const violations: AccidentalRuleViolation[] = [];
  let lineStart = 0;
  let lineNumber = 1;

  while (lineStart < script.length) {
    const newlineIndex = script.indexOf("\n", lineStart);
    const lineEnd = newlineIndex === -1 ? script.length : newlineIndex;
    const line = script.slice(lineStart, lineEnd).replace(/\r$/, "");

    if (/^\s*Q:/.test(line)) {
      const accidentals = new Map<string, number>();
      let inQuotedText = false;
      let isEscaped = false;

      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];

        if (inQuotedText) {
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
          inQuotedText = true;
          continue;
        }

        if (char === "|") {
          accidentals.clear();
          continue;
        }

        if (char < "1" || char > "7") {
          continue;
        }

        const start = index;
        index += 1;
        let suffix = "";
        while (index < line.length && isNoteSuffix(line[index])) {
          suffix += line[index];
          index += 1;
        }
        index -= 1;

        const octave = [...suffix].reduce(
          (value, mark) => value + (mark === "'" ? 1 : mark === "," ? -1 : 0),
          0,
        );
        const noteKey = `${char}:${octave}`;
        const explicitAccidental = suffix.includes("#")
          ? 1
          : suffix.includes("$")
            ? -1
            : suffix.includes("=")
              ? 0
              : null;
        const activeAccidental = accidentals.get(noteKey) ?? 0;

        if (explicitAccidental === null && activeAccidental !== 0) {
          const end = index + 1;
          violations.push({
            start: lineStart + start,
            end: lineStart + end,
            line: lineNumber,
            column: start + 1,
            note: line.slice(start, end),
          });
        } else if (explicitAccidental !== null) {
          accidentals.set(noteKey, explicitAccidental);
        }
      }
    }

    if (newlineIndex === -1) {
      break;
    }
    lineStart = newlineIndex + 1;
    lineNumber += 1;
  }

  return violations;
}
