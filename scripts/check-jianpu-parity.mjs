import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const fixtureDirectories = ["jps-files", "songs"];

const { translate } = await import("../lib/translate.ts");

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

async function readFixture(fileName) {
  let input = null;
  for (const directory of fixtureDirectories) {
    input ??= await readOptional(path.join(workspaceRoot, "public", directory, fileName));
  }
  if (input === null) {
    throw new Error(`No public JPS fixture found for ${fileName}`);
  }

  for (const directory of fixtureDirectories) {
    const oracleSvg = await readOptional(path.join(workspaceRoot, "oracle-cache", directory, `${fileName}.svg`));
    if (oracleSvg !== null) {
      return { input, oracleSvg };
    }
  }

  for (const directory of fixtureDirectories) {
    const entries = await readdir(path.join(workspaceRoot, "public", directory));
    for (const entry of entries.filter((name) => name.endsWith(".jps") && name !== fileName)) {
      const aliasInput = await readFile(path.join(workspaceRoot, "public", directory, entry), "utf8");
      if (aliasInput !== input) {
        continue;
      }
      for (const cacheDirectory of fixtureDirectories) {
        const oracleSvg = await readOptional(path.join(workspaceRoot, "oracle-cache", cacheDirectory, `${entry}.svg`));
        if (oracleSvg !== null) {
          return { input, oracleSvg };
        }
      }
    }
  }

  for (const directory of fixtureDirectories) {
    const oracleSvg = await readOptional(path.join(workspaceRoot, "oracle-cache", directory, `${path.parse(fileName).name}.svg`));
    if (oracleSvg !== null) {
      return { input, oracleSvg };
    }
  }

  throw new Error(`No cached JPS/oracle pair found for ${fileName}`);
}

const fileName = process.argv[2] ?? "memory-from-cats.jps";
const { input, oracleSvg } = await readFixture(fileName);
const localSvg = translate(input);

console.log(JSON.stringify({
  fileName,
  equal: localSvg === oracleSvg,
  localLength: localSvg.length,
  oracleLength: oracleSvg.length,
  localTitle: localSvg.match(/<text[^>]*>([^<]*)<\/text>/)?.[1] ?? null,
  oracleTitle: oracleSvg.match(/<text[^>]*>([^<]*)<\/text>/)?.[1] ?? null,
}, null, 2));
