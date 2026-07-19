import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

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

async function fetchRemoteSvg(jps: string): Promise<string> {
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
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`JPS service request failed (${response.status})`);
  }

  const text = await response.text();
  const pages = text
    .split("[fenye]")
    .map((page) => page.replace(/\r/g, ""))
    .filter((page) => page.trim().length > 0);

  if (pages.length === 0) {
    throw new Error("JPS service returned no SVG pages.");
  }

  return pages[0].replace(/&/g, "+");
}

async function fallbackSvg(): Promise<string> {
  const fallbackPath = path.join(
    process.cwd(),
    "..",
    "jianpu-spec",
    "out",
    "cat.svg"
  );
  try {
    return await readFile(fallbackPath, "utf-8");
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const jps = await request.text();
  let svg = "";

  try {
    svg = await fetchRemoteSvg(jps);
  } catch (error) {
    console.error("Jianpu remote render failed:", error);
    svg = await fallbackSvg();
  }

  return NextResponse.json({ svg });
}
