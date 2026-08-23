import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

const { translate } = await import("../lib/translate.ts");

const input = await readFile(path.join(workspaceRoot, "public/jps-files/memory-from-cats.jps"), "utf8");
const localSvg = translate(input);

// Find all <line elements
const lineMatches = localSvg.match(/<line[^>]*/g);
const useMatches = localSvg.match(/<use[^>]*/g);

console.log(`Found ${lineMatches ? lineMatches.length : 0} <line tags`);
console.log(`Found ${useMatches ? useMatches.length : 0} <use tags`);

if (lineMatches && lineMatches.length > 0) {
  console.log("\nFirst 5 line elements (start only):");
  lineMatches.slice(0, 5).forEach((line, i) => {
    console.log(`  ${i}: ${line.substring(0, 150)}`);
  });
}

if (useMatches && useMatches.length > 0) {
  console.log("\nFirst 5 use elements (start only):");
  useMatches.slice(0, 5).forEach((use, i) => {
    console.log(`  ${i}: ${use.substring(0, 150)}`);
  });
}
