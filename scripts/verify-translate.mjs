import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const DEFAULT_PAGE_CONFIG = {
  biaoti_font: "Microsoft YaHei",
  biaoti_size: "36",
  body_margin_top: "40",
  fubiaoti_size: "20",
  geci_font: "Microsoft YaHei",
  geci_size: "18",
  height_cici: "10",
  height_ciqu: "40",
  height_shengbu: "0",
  lianyinxian_type: "0",
  margin_bottom: "80",
  margin_left: "80",
  margin_right: "80",
  margin_top: "80",
  page: "A4",
  shuzi_font: "b",
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const publicJpsDir = path.join(workspaceRoot, "public", "jps-files");

const { parseJps, translate } = await import("../lib/translate.ts");

function extractSvgTitle(svg) {
  const match = svg.match(/<text[^>]*>([^<]+)<\/text>/);
  return match?.[1]?.trim() ?? null;
}

function hasNotationGlyphs(svg) {
  return svg.includes('href="#shuzi_b_') || svg.includes('xlink:href="#shuzi_b_');
}

async function fetchRemoteSvg(jps) {
  const code = jps.replace(/\r\n/g, "\n").replace(/\n/g, "&hh&");
  const params = new URLSearchParams();
  params.set("code", code);
  params.set("customCode", "");
  params.set("pageConfig", JSON.stringify(DEFAULT_PAGE_CONFIG));
  params.set("pageNum", "-1");

  const response = await fetch("http://zhipu.lezhi99.com/Zhipu-draw", {
    method: "POST",
    headers: {
      Referer: "http://zhipu.lezhi99.com/Zhipu-index.html",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`external parity request failed (${response.status})`);
  }

  const text = await response.text();
  const pages = text
    .split("[fenye]")
    .map((page) => page.replace(/\r/g, ""))
    .filter((page) => page.trim().length > 0);

  if (pages.length === 0) {
    throw new Error("external parity renderer returned no SVG pages");
  }

  return pages[0].replace(/&/g, "+");
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
  let expectedSvg = "";

  try {
    expectedSvg = await fetchRemoteSvg(input);
  } catch (error) {
    failures.push(`${fileName}: ${error instanceof Error ? error.message : String(error)}`);
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
    failures.push(`${fileName}: external SVG title ${expectedSvgTitle ?? "<missing>"} does not match JPS title ${expectedTitle}`);
    continue;
  }

  if (output !== expectedSvg) {
    failures.push(`${fileName}: translate() output does not match external renderer`);
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

console.log(`Verified ${jpsFiles.length} public JPS files against external parity and live edit propagation`);
