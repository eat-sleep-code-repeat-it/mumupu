import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const publicJpsDir = path.join(workspaceRoot, "public", "jps-files");
const oracleCacheDirs = ["jps-files", "songs"].map((directory) => path.join(workspaceRoot, "oracle-cache", directory));

const { parseJps, translate } = await import("../lib/translate.ts");

function extractSvgTitle(svg) {
  const match = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return match?.[1]?.trim() ?? null;
}

function hasNotationGlyphs(svg) {
  return svg.includes('href="#shuzi_b_') || svg.includes('xlink:href="#shuzi_b_');
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
    return null;
  }
}

async function readCachedSvg(fileName, input) {
  for (const directory of oracleCacheDirs) {
    const oracleSvg = await readOptional(path.join(directory, `${fileName}.svg`));
    if (oracleSvg !== null) {
      return oracleSvg;
    }
  }

  for (const aliasName of jpsFiles.filter((name) => name !== fileName)) {
    const aliasInput = await readFile(path.join(publicJpsDir, aliasName), "utf8");
    if (aliasInput !== input) {
      continue;
    }
    for (const directory of oracleCacheDirs) {
      const oracleSvg = await readOptional(path.join(directory, `${aliasName}.svg`));
      if (oracleSvg !== null) {
        return oracleSvg;
      }
    }
  }

  for (const directory of oracleCacheDirs) {
    const oracleSvg = await readOptional(path.join(directory, `${path.parse(fileName).name}.svg`));
    if (oracleSvg !== null) {
      return oracleSvg;
    }
  }

  throw new Error(`no cached SVG found for ${fileName}`);
}

const failures = [];
const jpsFiles = (await readdir(publicJpsDir))
  .filter((entry) => entry.endsWith(".jps"))
  .sort();

for (const fileName of jpsFiles) {
  const jpsPath = path.join(publicJpsDir, fileName);
  const input = await readFile(jpsPath, "utf8");
  const parsed = parseJps(input);
  const expectedTitle = (parsed.headerValues.B?.[0] || parsed.header.B || parsed.header.V || path.parse(fileName).name).trim();
  const output = translate(input);
  let expectedSvg;

  try {
    expectedSvg = await readCachedSvg(fileName, input);
  } catch (error) {
    failures.push(`${fileName}: cached oracle unavailable (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  if (!output.includes(expectedTitle)) {
    failures.push(`${fileName}: output title does not include ${expectedTitle}`);
  }

  if (!hasNotationGlyphs(output)) {
    failures.push(`${fileName}: output does not look like notation SVG`);
  }

  const expectedSvgTitle = extractSvgTitle(expectedSvg);

  if (expectedSvgTitle !== expectedTitle) {
    failures.push(`${fileName}: cached SVG title ${expectedSvgTitle ?? "<missing>"} does not match JPS title ${expectedTitle}`);
    continue;
  }

  if (output !== expectedSvg) {
    failures.push(`${fileName}: translate() output does not match cached oracle`);
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

console.log(`Verified ${jpsFiles.length} public JPS files against cached parity and live edit propagation`);
