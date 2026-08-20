import { access, readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const publicJpsDir = path.join(workspaceRoot, "public", "jps-files");
const publicSvgDir = path.join(workspaceRoot, "public", "svg-files");

const { parseJps, translate } = await import("../lib/translate.ts");

function extractSvgTitle(svg) {
  const match = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return match?.[1]?.trim() ?? null;
}

function hasNotationGlyphs(svg) {
  return svg.includes('href="#shuzi_b_') || svg.includes('xlink:href="#shuzi_b_');
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const failures = [];
const jpsFiles = (await readdir(publicJpsDir))
  .filter((entry) => entry.endsWith(".jps"))
  .sort();

for (const fileName of jpsFiles) {
  const stem = path.parse(fileName).name;
  const jpsPath = path.join(publicJpsDir, fileName);
  const svgPath = path.join(publicSvgDir, `${stem}.svg`);
  const input = await readFile(jpsPath, "utf8");
  const parsed = parseJps(input);
  const expectedTitle = (parsed.headerValues.B?.[0] || parsed.header.B || parsed.header.V || stem).trim();
  const output = translate(input);

  if (!output.includes(expectedTitle)) {
    failures.push(`${fileName}: output title does not include ${expectedTitle}`);
  }

  if (!hasNotationGlyphs(output)) {
    failures.push(`${fileName}: output does not look like notation SVG`);
  }

  if (!(await fileExists(svgPath))) {
    failures.push(`${fileName}: missing expected SVG fixture ${path.basename(svgPath)}`);
    continue;
  }

  const expectedSvg = await readFile(svgPath, "utf8");
  const expectedSvgTitle = extractSvgTitle(expectedSvg);

  if (expectedSvgTitle !== expectedTitle) {
    failures.push(`${fileName}: expected SVG title ${expectedSvgTitle ?? "<missing>"} does not match JPS title ${expectedTitle}`);
    continue;
  }

  if (output !== expectedSvg) {
    failures.push(`${fileName}: translate() output does not match ${path.basename(svgPath)}`);
  }
}

const memoryInput = await readFile(path.join(publicJpsDir, "memory-from-cats.jps"), "utf8");
const editedMemoryOutput = translate(memoryInput.replace("B: Memory Cats", "B: Live Preview Test"));

if (!editedMemoryOutput.includes("Live Preview Test")) {
  failures.push("edited memory-from-cats title did not propagate into output");
}

if (failures.length > 0) {
  throw new Error(`Public JPS verification failed:\n- ${failures.join("\n- ")}`);
}

console.log(`Verified ${jpsFiles.length} public JPS files and live edit propagation`);
