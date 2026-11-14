export type ScriptRuleIssue = {
  kind: "accidental" | "bracket" | "quote";
  start: number;
  end: number;
  line: number;
  column: number;
  text: string;
  message: string;
};

const openingBrackets: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
};

const closingBrackets = new Set(Object.values(openingBrackets));

function isNoteSuffix(char: string): boolean {
  return char === "#" || char === "$" || char === "=" || char === "," || char === "'";
}

function accidentalIssues(script: string): ScriptRuleIssue[] {
  const issues: ScriptRuleIssue[] = [];
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
          issues.push({
            kind: "accidental",
            start: lineStart + start,
            end: lineStart + end,
            line: lineNumber,
            column: start + 1,
            text: line.slice(start, end),
            message: `This note inherits a previous sharp or flat; add "=" if it should be natural (line ${lineNumber}, column ${start + 1}).`,
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

  return issues;
}

function structureIssues(script: string): ScriptRuleIssue[] {
  const issues: ScriptRuleIssue[] = [];
  const bracketStack: Array<{
    bracket: string;
    start: number;
    line: number;
    column: number;
  }> = [];
  let lineStart = 0;
  let lineNumber = 1;

  while (lineStart < script.length) {
    const newlineIndex = script.indexOf("\n", lineStart);
    const lineEnd = newlineIndex === -1 ? script.length : newlineIndex;
    const line = script.slice(lineStart, lineEnd).replace(/\r$/, "");

    if (!line.trimStart().startsWith("#")) {
      let inQuotedText = false;
      let isEscaped = false;
      let quoteStart = -1;

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
          quoteStart = index;
          continue;
        }

        if (Object.hasOwn(openingBrackets, char)) {
          bracketStack.push({
            bracket: char,
            start: lineStart + index,
            line: lineNumber,
            column: index + 1,
          });
          continue;
        }

        if (!closingBrackets.has(char)) {
          continue;
        }

        const opening = bracketStack.at(-1);
        if (opening && openingBrackets[opening.bracket] === char) {
          bracketStack.pop();
        } else {
          const message = opening
            ? `Closing bracket "${char}" does not match opening bracket "${opening.bracket}" (line ${lineNumber}, column ${index + 1}).`
            : `Unmatched closing bracket "${char}" (line ${lineNumber}, column ${index + 1}).`;
          issues.push({
            kind: "bracket",
            start: lineStart + index,
            end: lineStart + index + 1,
            line: lineNumber,
            column: index + 1,
            text: char,
            message,
          });
        }
      }

      if (inQuotedText) {
        issues.push({
          kind: "quote",
          start: lineStart + quoteStart,
          end: lineStart + quoteStart + 1,
          line: lineNumber,
          column: quoteStart + 1,
          text: "\"",
          message: `Unpaired double quote (line ${lineNumber}, column ${quoteStart + 1}).`,
        });
      }
    }

    if (newlineIndex === -1) {
      break;
    }
    lineStart = newlineIndex + 1;
    lineNumber += 1;
  }

  for (const opening of bracketStack) {
    issues.push({
      kind: "bracket",
      start: opening.start,
      end: opening.start + 1,
      line: opening.line,
      column: opening.column,
      text: opening.bracket,
      message: `Unpaired opening bracket "${opening.bracket}" (line ${opening.line}, column ${opening.column}).`,
    });
  }

  return issues;
}

export function checkScriptRules(script: string): ScriptRuleIssue[] {
  return [...accidentalIssues(script), ...structureIssues(script)]
    .sort((left, right) => left.start - right.start);
}
